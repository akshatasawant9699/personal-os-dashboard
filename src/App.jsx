import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Target,
  Plus,
  LogOut,
  Calendar as CalendarIcon,
  Trash2,
  X,
  User,
  MoreVertical,
  Copy,
  Clock,
  Search,
  FileText,
  LayoutGrid,
  Check,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Edit,
  ChevronLeft,
  ChevronRight,
  Folder,
  Home,
  StickyNote,
  BookOpen,
} from 'lucide-react';
import { auth, signInWithGoogle, signOutUser, getUserData, saveUserData } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getCalendarEvents, syncTasksToCalendar } from './utils/calendar';
import Dashboard from './components/Dashboard';
import FocusTimer from './components/FocusTimer';
import Notes from './components/Notes';
import Journal from './components/Journal';

const DEFAULT_ROLES = [
  { id: 'work', label: 'Work', color: 'bg-blue-500', hub: 'career' },
  { id: 'personal', label: 'Personal', color: 'bg-green-500', hub: 'personal' },
  { id: 'learning', label: 'Learning', color: 'bg-purple-500', hub: 'growth' },
];

const DEFAULT_HUBS = [
  { id: 'all', label: 'All Tasks', icon: 'LayoutGrid', color: '#6B7280' },
  { id: 'career', label: 'Career', icon: 'Briefcase', color: '#3B82F6' },
  { id: 'personal', label: 'Personal', icon: 'Home', color: '#10B981' },
  { id: 'growth', label: 'Growth', icon: 'TrendingUp', color: '#8B5CF6' },
];

const COLUMNS = {
  ideas: { id: 'ideas', title: 'Ideas', color: 'border-l-gray-400' },
  inProgress: { id: 'inProgress', title: 'In Progress', color: 'border-l-blue-500' },
  readyToPublish: { id: 'readyToPublish', title: 'Ready', color: 'border-l-green-500' },
  done: { id: 'done', title: 'Done', color: 'border-l-gray-300' },
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  // User settings
  const [userRoles, setUserRoles] = useState(DEFAULT_ROLES);
  const [userHubs, setUserHubs] = useState(DEFAULT_HUBS);
  const [areasOfFocus, setAreasOfFocus] = useState('');
  const [purposeOfUse, setPurposeOfUse] = useState('');
  const [customTags, setCustomTags] = useState(['']);
  const [showHubManager, setShowHubManager] = useState(false);
  const [editingHub, setEditingHub] = useState(null);

  const [signingOut, setSigningOut] = useState(false);

  // App state
  const [ruleOfThree, setRuleOfThree] = useState(['', '', '']);
  const [nonPriorityTasks, setNonPriorityTasks] = useState(['', '']);
  const [quickCapture, setQuickCapture] = useState('');
  const [selectedHub, setSelectedHub] = useState('all');
  const [cards, setCards] = useState({
    ideas: [],
    inProgress: [],
    readyToPublish: [],
    done: [],
  });
  const [editingCard, setEditingCard] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [showCardMenu, setShowCardMenu] = useState(null);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hasLoadedUserData, setHasLoadedUserData] = useState(false);

  // New feature state
  const [notes, setNotes] = useState([]);
  const [journal, setJournal] = useState([]);
  const [focusStats, setFocusStats] = useState({ totalSessions: 0, totalMinutes: 0, lastSession: null });

  // Always-current ref — written synchronously before every Firestore round-trip
  const latestDataRef = useRef(null);

  // Apply a saved data object back into all state setters
  const applyStateFromData = (data) => {
    setRuleOfThree(data.ruleOfThree || ['', '', '']);
    setNonPriorityTasks(data.nonPriorityTasks || ['', '']);
    setCards(data.cards || { ideas: [], inProgress: [], readyToPublish: [], done: [] });
    setUserRoles(data.customRoles || DEFAULT_ROLES);
    setUserHubs(data.userHubs || DEFAULT_HUBS);
    setAreasOfFocus(data.areasOfFocus || '');
    setPurposeOfUse(data.purposeOfUse || '');
    setActiveTab(data.activeTab || 'dashboard');
    setSelectedHub(data.selectedHub || 'all');
    const pd = data.currentDate ? new Date(data.currentDate) : new Date();
    setCurrentDate(!isNaN(pd) ? pd : new Date());
    const psd = data.selectedDate ? new Date(data.selectedDate) : null;
    setSelectedDate(psd && !isNaN(psd) ? psd : null);
    setNotes(data.notes || []);
    setJournal(data.journal || []);
    setFocusStats(data.focusStats || { totalSessions: 0, totalMinutes: 0, lastSession: null });
  };

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        setHasLoadedUserData(false);
        await loadUserDataFromFirestore(currentUser.uid);
        loadCalendarEvents(currentUser.uid);
      } else {
        setHasLoadedUserData(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user data: localStorage first (zero network latency), then Firestore
  const loadUserDataFromFirestore = async (userId) => {
    console.log('📂 Loading for:', userId);

    // ── Step 1: Restore from localStorage immediately ──────────────────────────
    // localStorage writes are synchronous, so this always has the most recent
    // local state — even if the user refreshed before the 1.5 s Firestore debounce.
    let localData = null;
    try {
      const raw = localStorage.getItem(`userDataCache_${userId}`);
      if (raw) localData = JSON.parse(raw);
    } catch (_) {}

    if (localData) {
      console.log('⚡ Restoring from localStorage');
      applyStateFromData(localData);
      setShowOnboarding(false);
      setHasLoadedUserData(true);
    }

    // ── Step 2: Fetch from Firestore for cross-device sync ────────────────────
    try {
      const remoteData = await getUserData(userId);

      if (remoteData) {
        const localTs = localData?.lastUpdated || '0';
        const remoteTs = remoteData.lastUpdated || '0';
        // Only apply remote data when it is strictly newer (cross-device scenario)
        if (remoteTs > localTs) {
          console.log('☁️ Firestore is newer, applying remote data');
          applyStateFromData(remoteData);
          try {
            localStorage.setItem(`userDataCache_${userId}`, JSON.stringify(remoteData));
          } catch (_) {}
        } else {
          console.log('💾 localStorage is up-to-date, keeping local data');
        }
        setShowOnboarding(false);
      } else if (!localData) {
        console.log('ℹ️ New user — showing onboarding');
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('❌ Firestore load error:', error);
      if (!localData) {
        alert('Failed to load your data. Please check your connection.');
      }
    }

    setHasLoadedUserData(true);
  };

  // ── Persistence effect ────────────────────────────────────────────────────────
  // Runs on every state change once data is loaded.
  // • Writes to localStorage IMMEDIATELY (synchronous) → survives hard refresh.
  // • Debounces a Firestore write by 1.5 s for cloud backup / cross-device sync.
  useEffect(() => {
    if (!user?.uid || !hasLoadedUserData || showOnboarding) return;

    // Build the snapshot inline so we are 100% sure it captures THIS render's state
    const snapshot = {
      ruleOfThree,
      nonPriorityTasks,
      cards,
      customRoles: userRoles,
      userHubs,
      areasOfFocus,
      purposeOfUse,
      activeTab,
      selectedHub,
      currentDate: currentDate instanceof Date && !isNaN(currentDate)
        ? currentDate.toISOString() : new Date().toISOString(),
      selectedDate: selectedDate instanceof Date && !isNaN(selectedDate)
        ? selectedDate.toISOString() : null,
      notes,
      journal,
      focusStats,
      lastUpdated: new Date().toISOString(),
    };

    // Synchronous localStorage write — always completes before the page unloads
    latestDataRef.current = snapshot;
    try {
      localStorage.setItem(`userDataCache_${user.uid}`, JSON.stringify(snapshot));
      console.log('💾 localStorage saved');
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }

    // Debounced Firestore write (cloud backup)
    const uid = user.uid;
    const timer = setTimeout(async () => {
      try {
        await saveUserData(uid, snapshot);
        console.log('☁️ Firestore saved at', new Date().toLocaleTimeString());
      } catch (error) {
        console.error('❌ Firestore save error:', error);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    ruleOfThree,
    nonPriorityTasks,
    cards,
    userRoles,
    userHubs,
    areasOfFocus,
    purposeOfUse,
    activeTab,
    selectedHub,
    currentDate,
    selectedDate,
    notes,
    journal,
    focusStats,
    user,
    showOnboarding,
    hasLoadedUserData,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '/') {
        e.preventDefault();
        document.querySelector('input[placeholder*="Search"]')?.focus();
      }
      if (e.key === 'n') {
        e.preventDefault();
        document.querySelector('input[placeholder*="Quickly"]')?.focus();
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        setShowCardMenu(null);
        setExpandedCard(null);
        setEditingCard(null);
        setShowHubManager(false);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Synchronous localStorage flush on page close / refresh.
  // Browsers abort async operations on unload — localStorage.setItem is synchronous
  // and always completes. We read from the ref (always current) to avoid stale closures.
  useEffect(() => {
    const handleBeforeUnload = () => {
      const uid = user?.uid;
      if (!uid || !hasLoadedUserData || !latestDataRef.current) return;
      try {
        const snapshot = { ...latestDataRef.current, lastUpdated: new Date().toISOString() };
        localStorage.setItem(`userDataCache_${uid}`, JSON.stringify(snapshot));
      } catch (_) {}
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, hasLoadedUserData]);

  // Load calendar events
  const loadCalendarEvents = async (uid) => {
    if (!uid) return;
    const accessToken = localStorage.getItem(`google_access_token_${uid}`);
    if (accessToken) {
      try {
        const events = await getCalendarEvents(accessToken);
        setCalendarEvents(events);
      } catch (error) {
        console.error('Failed to load calendar events:', error);
      }
    }
  };

  // Onboarding completion
  const completeOnboarding = async () => {
    const newRoles = customTags
      .filter(tag => tag.trim() !== '')
      .slice(0, 10)
      .map((tag, index) => ({
        id: `custom-${index}`,
        label: tag.trim(),
        color: [
          'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
          'bg-green-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-purple-500'
        ][index % 10],
        hub: 'personal',
      }));

    const mergedRoles = [...DEFAULT_ROLES, ...newRoles];
    setUserRoles(mergedRoles);

    const onboardingData = {
      customRoles: mergedRoles,
      userHubs: DEFAULT_HUBS,
      areasOfFocus,
      purposeOfUse,
      ruleOfThree: ['', '', ''],
      nonPriorityTasks: ['', ''],
      cards: { ideas: [], inProgress: [], readyToPublish: [], done: [] },
      activeTab: 'dashboard',
      selectedHub: 'all',
      currentDate: new Date().toISOString(),
      selectedDate: null,
      notes: [],
      journal: [],
      focusStats: { totalSessions: 0, totalMinutes: 0, lastSession: null },
      lastUpdated: new Date().toISOString(),
    };

    try { localStorage.setItem(`userDataCache_${user.uid}`, JSON.stringify(onboardingData)); } catch (_) {}
    latestDataRef.current = onboardingData;
    await saveUserData(user.uid, onboardingData);

    setShowOnboarding(false);
    setHasLoadedUserData(true);
  };

  // Sign in/out
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert('Failed to sign in: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    if (!user || signingOut) return;
    const uid = user.uid;

    setSigningOut(true);
    // Disable persistence effect so state resets below don't overwrite localStorage
    setHasLoadedUserData(false);

    try {
      // Best-effort final Firestore save — give it 3 s max so we don't hang
      if (latestDataRef.current) {
        await Promise.race([
          saveUserData(uid, latestDataRef.current),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
        ]).catch(() => {});
      }

      // Remove local cache and Calendar access token
      try { localStorage.removeItem(`userDataCache_${uid}`); } catch (_) {}
      latestDataRef.current = null;

      // Firebase sign-out
      await signOutUser(uid);

      // Reset all local state for immediate UI feedback
      setRuleOfThree(['', '', '']);
      setNonPriorityTasks(['', '']);
      setCards({ ideas: [], inProgress: [], readyToPublish: [], done: [] });
      setUserRoles(DEFAULT_ROLES);
      setUserHubs(DEFAULT_HUBS);
      setActiveTab('dashboard');
      setSelectedHub('all');
      setCurrentDate(new Date());
      setSelectedDate(null);
      setNotes([]);
      setJournal([]);
      setFocusStats({ totalSessions: 0, totalMinutes: 0, lastSession: null });
    } catch (error) {
      console.error('Sign-out error:', error);
      alert('Failed to sign out: ' + error.message);
      setHasLoadedUserData(true);
    } finally {
      setSigningOut(false);
    }
  };

  // Task handlers
  const handleRuleChange = (index, value) => {
    const newRules = [...ruleOfThree];
    newRules[index] = value;
    setRuleOfThree(newRules);
  };

  const handleNonPriorityChange = (index, value) => {
    const newTasks = [...nonPriorityTasks];
    newTasks[index] = value;
    setNonPriorityTasks(newTasks);
  };

  const handleAddToBoard = () => {
    const allTasks = [...ruleOfThree, ...nonPriorityTasks];
    const tasksToAdd = allTasks.filter(task => task.trim() !== '');

    if (tasksToAdd.length === 0) {
      alert('Please add at least one task first!');
      return;
    }

    const newCards = tasksToAdd.map((task, index) => ({
      id: Date.now().toString() + index,
      title: task,
      description: '',
      roles: [],
      priority: index < 3 ? 'high' : 'low',
      dueDate: null,
      createdAt: new Date().toISOString(),
    }));

    setCards((prev) => ({
      ...prev,
      ideas: [...prev.ideas, ...newCards],
    }));

    setRuleOfThree(['', '', '']);
    setNonPriorityTasks(['', '']);
    alert(`Added ${tasksToAdd.length} task(s) to the board! ✅`);
  };

  const triggerOnboarding = () => {
    setOnboardingStep(0);
    setCustomTags(['']);
    setShowOnboarding(true);
  };

  const handleQuickCapture = () => {
    if (!quickCapture.trim()) return;
    const newCard = {
      id: Date.now().toString(),
      title: quickCapture,
      description: '',
      roles: [],
      priority: 'medium',
      dueDate: null,
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => ({ ...prev, ideas: [...prev.ideas, newCard] }));
    setQuickCapture('');
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = cards[source.droppableId];
    const destColumn = cards[destination.droppableId];
    const sourceCards = Array.from(sourceColumn);
    const destCards = source.droppableId === destination.droppableId ? sourceCards : Array.from(destColumn);

    const [movedCard] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, movedCard);

    setCards({
      ...cards,
      [source.droppableId]: sourceCards,
      [destination.droppableId]: destCards,
    });
  };

  const handleDeleteCard = (columnId, cardId) => {
    if (confirm('Delete this task?')) {
      setCards((prev) => ({
        ...prev,
        [columnId]: prev[columnId].filter((c) => c.id !== cardId),
      }));
    }
  };

  const toggleRole = (columnId, cardId, roleId) => {
    setCards((prev) => ({
      ...prev,
      [columnId]: prev[columnId].map((card) => {
        if (card.id === cardId) {
          const roles = card.roles.includes(roleId)
            ? card.roles.filter((r) => r !== roleId)
            : [...card.roles, roleId];
          return { ...card, roles };
        }
        return card;
      }),
    }));
  };

  const updateCardField = (columnId, cardId, field, value) => {
    setCards((prev) => ({
      ...prev,
      [columnId]: prev[columnId].map((card) =>
        card.id === cardId ? { ...card, [field]: value } : card
      ),
    }));
  };

  const duplicateCard = (columnId, card) => {
    const newCard = {
      ...card,
      id: Date.now().toString(),
      title: `${card.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => ({ ...prev, [columnId]: [...prev[columnId], newCard] }));
    setShowCardMenu(null);
  };

  const toggleCardExpansion = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const filterCardsByHub = (cardList) => {
    let filtered = cardList;
    if (selectedHub !== 'all') {
      filtered = filtered.filter((card) =>
        card.roles.some((roleId) => {
          const role = userRoles.find((r) => r.id === roleId);
          return role && role.hub === selectedHub;
        })
      );
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          (card.description && card.description.toLowerCase().includes(query))
      );
    }
    return filtered;
  };

  const handleSyncToCalendar = async () => {
    const accessToken = localStorage.getItem(`google_access_token_${user.uid}`);
    if (!accessToken) {
      alert('Your Google Calendar access has expired.\nPlease sign out and sign in again to reconnect.');
      return;
    }

    // Collect ALL tasks that have a due date (any column)
    const allTasks = [
      ...cards.ideas,
      ...cards.inProgress,
      ...cards.readyToPublish,
      ...cards.done,
    ];
    const tasksWithDate = allTasks.filter((card) => card.dueDate);
    const skipped = allTasks.length - tasksWithDate.length;

    if (tasksWithDate.length === 0) {
      alert('No tasks have a due date set.\nAdd a due date to a task on the board first, then sync.');
      return;
    }

    try {
      const tasksData = tasksWithDate.map((card) => {
        // Use the card's dueDate as the event start (local time, 9–10 AM)
        const start = new Date(`${card.dueDate}T09:00:00`);
        const end = new Date(`${card.dueDate}T10:00:00`);
        const roleLabels = card.roles
          .map((r) => userRoles.find((role) => role.id === r)?.label)
          .filter(Boolean)
          .join(', ');
        return {
          id: card.id,
          title: card.title,
          description: [
            card.description,
            roleLabels ? `Roles: ${roleLabels}` : '',
            `Status: ${Object.entries(cards).find(([, col]) => col.some((c) => c.id === card.id))?.[0] ?? ''}`,
          ].filter(Boolean).join('\n'),
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        };
      });

      const result = await syncTasksToCalendar(accessToken, tasksData);
      const msg = [
        `Synced ${result.syncedTasks.length} task(s) to Google Calendar.`,
        result.failedTasks.length ? `${result.failedTasks.length} failed.` : '',
        skipped ? `${skipped} task(s) skipped (no due date).` : '',
      ].filter(Boolean).join('\n');
      alert(msg);
      loadCalendarEvents(user.uid);
    } catch (error) {
      const isAuthError = error.message?.toLowerCase().includes('401')
        || error.message?.toLowerCase().includes('403')
        || error.message?.toLowerCase().includes('unauthorized')
        || error.message?.toLowerCase().includes('access token');
      if (isAuthError) {
        alert('Your Google Calendar access token has expired.\nPlease sign out and sign in again to re-authorise.');
      } else {
        alert(`Sync failed: ${error.message}\n\nIf this keeps happening, try signing out and back in.`);
      }
    }
  };

  // Custom tag management
  const addCustomTagInput = () => {
    if (customTags.length < 10) setCustomTags([...customTags, '']);
  };

  const updateCustomTag = (index, value) => {
    const newTags = [...customTags];
    newTags[index] = value;
    setCustomTags(newTags);
  };

  const removeCustomTag = (index) => {
    const newTags = customTags.filter((_, i) => i !== index);
    setCustomTags(newTags.length > 0 ? newTags : ['']);
  };

  // Hub management
  const addHub = () => {
    const newHub = {
      id: `hub-${Date.now()}`,
      label: 'New Category',
      icon: 'Folder',
      color: '#6B7280',
    };
    setUserHubs([...userHubs, newHub]);
    setEditingHub(newHub.id);
  };

  const updateHub = (hubId, field, value) => {
    setUserHubs(userHubs.map(hub =>
      hub.id === hubId ? { ...hub, [field]: value } : hub
    ));
  };

  const deleteHub = (hubId) => {
    if (hubId === 'all') {
      alert('Cannot delete the "All Tasks" category');
      return;
    }
    if (confirm('Delete this category? Tasks will not be deleted.')) {
      setUserHubs(userHubs.filter(hub => hub.id !== hubId));
      if (selectedHub === hubId) setSelectedHub('all');
    }
  };

  // Analytics calculations
  const getTaskStats = () => {
    const allCards = [...cards.ideas, ...cards.inProgress, ...cards.readyToPublish, ...cards.done];

    // Tasks by hub
    const tasksByHub = {};
    userHubs.forEach(hub => {
      if (hub.id !== 'all') {
        tasksByHub[hub.label] = 0;
      }
    });

    allCards.forEach(card => {
      card.roles.forEach(roleId => {
        const role = userRoles.find(r => r.id === roleId);
        if (role) {
          const hub = userHubs.find(h => h.id === role.hub);
          if (hub && hub.id !== 'all') {
            tasksByHub[hub.label] = (tasksByHub[hub.label] || 0) + 1;
          }
        }
      });
    });

    // Tasks by status
    const tasksByStatus = {
      'Ideas': cards.ideas.length,
      'In Progress': cards.inProgress.length,
      'Ready': cards.readyToPublish.length,
      'Done': cards.done.length,
    };

    // Tasks by priority
    const tasksByPriority = {
      'High': allCards.filter(c => c.priority === 'high').length,
      'Medium': allCards.filter(c => c.priority === 'medium').length,
      'Low': allCards.filter(c => c.priority === 'low').length,
    };

    return { tasksByHub, tasksByStatus, tasksByPriority, totalTasks: allCards.length };
  };

  // Calendar utilities
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  // Parse a "YYYY-MM-DD" date string as LOCAL midnight so it matches the calendar
  // grid dates (which are also local midnight). Without the T00:00:00 suffix the
  // browser treats the string as UTC, shifting the date by the timezone offset.
  const parseDueDate = (dueDateStr) => {
    if (!dueDateStr) return null;
    const d = new Date(`${dueDateStr}T00:00:00`);
    return isNaN(d) ? null : d;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    const allCards = [...cards.ideas, ...cards.inProgress, ...cards.readyToPublish, ...cards.done];
    return allCards.filter(card => {
      if (!card.dueDate) return false;
      const cardDate = parseDueDate(card.dueDate);
      return cardDate && isSameDay(cardDate, date);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-lg text-gray-700 flex items-center gap-3">
          <div className="animate-spin text-orange-500">☀️</div>
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100">
        <div className="text-center space-y-8 p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-orange-200">
          <div className="space-y-4">
            <div className="text-6xl animate-float">☀️</div>
            <h1 className="text-6xl font-bold gradient-summer">
              Personal OS
            </h1>
            <p className="text-2xl text-gray-700 font-light">Daily Productivity App</p>
          </div>
          <button
            onClick={handleSignIn}
            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-2xl font-semibold hover:from-orange-500 hover:to-amber-500 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto shadow-lg"
          >
            <User size={24} />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // Onboarding
  if (showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-4">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-float">☀️</div>
            <h2 className="text-4xl font-bold gradient-summer mb-2">Welcome! 🎉</h2>
            <p className="text-gray-600">Let's personalize your workspace</p>
          </div>

          {onboardingStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are your main areas of focus?
                </label>
                <textarea
                  value={areasOfFocus}
                  onChange={(e) => setAreasOfFocus(e.target.value)}
                  placeholder="E.g., Software development, fitness, learning..."
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 min-h-[100px]"
                />
              </div>
              <button
                onClick={() => setOnboardingStep(1)}
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Next →
              </button>
            </div>
          )}

          {onboardingStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are you using this for?
                </label>
                <textarea
                  value={purposeOfUse}
                  onChange={(e) => setPurposeOfUse(e.target.value)}
                  placeholder="E.g., Managing projects, tracking habits..."
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 min-h-[100px]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setOnboardingStep(0)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create your custom tags (up to 10)
                </label>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {customTags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => updateCustomTag(index, e.target.value)}
                        placeholder={`Tag ${index + 1}`}
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      />
                      {customTags.length > 1 && (
                        <button
                          onClick={() => removeCustomTag(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {customTags.length < 10 && (
                  <button
                    onClick={addCustomTagInput}
                    className="mt-3 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Tag
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setOnboardingStep(1)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={completeOnboarding}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Complete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800">
      {/* Header */}
      <header className="border-b-2 border-orange-200 bg-white/70 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-3xl animate-float">☀️</div>
              <h1 className="text-lg sm:text-2xl font-bold gradient-summer">
                Personal OS
              </h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-orange-100/50 rounded-xl p-1 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Home', icon: Home },
                { id: 'kanban', label: 'Board', icon: LayoutGrid },
                { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
                { id: 'focus', label: 'Focus', icon: Clock },
                { id: 'notes', label: 'Notes', icon: StickyNote },
                { id: 'journal', label: 'Journal', icon: BookOpen },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm whitespace-nowrap ${
                    activeTab === id
                      ? 'bg-white text-orange-600 shadow-md'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleSyncToCalendar}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-md text-sm"
              >
                <CalendarIcon size={16} />
                <span className="hidden sm:inline">Sync</span>
              </button>
              <button
                onClick={triggerOnboarding}
                className="p-2 hover:bg-orange-100 rounded-xl transition-colors"
                title="Settings"
              >
                <Settings size={18} className="text-gray-600" />
              </button>
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                <img src={user.photoURL} alt={user.displayName} className="w-7 h-7 rounded-full" />
                <span className="text-sm text-gray-700">{user.displayName}</span>
              </div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className={`p-2 rounded-md transition-colors ${signingOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                title={signingOut ? 'Signing out…' : 'Sign Out'}
              >
                {signingOut
                  ? <div className="w-[18px] h-[18px] border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : <LogOut size={18} className="text-gray-600" />
                }
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            cards={cards}
            ruleOfThree={ruleOfThree}
            notes={notes}
            journal={journal}
            focusStats={focusStats}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'kanban' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              />
            </div>

            {/* Daily Tasks */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
                <button
                  onClick={handleAddToBoard}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add to Board
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Top Priorities</h3>
                  <div className="space-y-2">
                    {ruleOfThree.map((rule, index) => (
                      <input
                        key={index}
                        type="text"
                        value={rule}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                        placeholder={`Priority ${index + 1}`}
                        className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Additional Tasks</h3>
                  <div className="space-y-2">
                    {nonPriorityTasks.map((task, index) => (
                      <input
                        key={index}
                        type="text"
                        value={task}
                        onChange={(e) => handleNonPriorityChange(index, e.target.value)}
                        placeholder={`Task ${index + 1}`}
                        className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Capture */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={quickCapture}
                  onChange={(e) => setQuickCapture(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickCapture()}
                  placeholder="Quick capture..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleQuickCapture}
                  className="px-5 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Hub Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-500">FILTER:</span>
              {userHubs.map((hub) => (
                <button
                  key={hub.id}
                  onClick={() => setSelectedHub(hub.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedHub === hub.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {hub.label}
                </button>
              ))}
              <button
                onClick={() => setShowHubManager(!showHubManager)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                title="Manage Categories"
              >
                <Settings size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Hub Manager */}
            {showHubManager && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Manage Categories</h3>
                  <button
                    onClick={() => setShowHubManager(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {userHubs.filter(h => h.id !== 'all').map(hub => (
                    <div key={hub.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      {editingHub === hub.id ? (
                        <>
                          <input
                            type="text"
                            value={hub.label}
                            onChange={(e) => updateHub(hub.id, 'label', e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-sm"
                            autoFocus
                          />
                          <input
                            type="color"
                            value={hub.color}
                            onChange={(e) => updateHub(hub.id, 'color', e.target.value)}
                            className="w-10 h-8 rounded cursor-pointer"
                          />
                          <button
                            onClick={() => setEditingHub(null)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Check size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: hub.color }}></div>
                          <span className="flex-1 text-sm font-medium">{hub.label}</span>
                          <button
                            onClick={() => setEditingHub(hub.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => deleteHub(hub.id)}
                            className="p-1 hover:bg-red-50 text-red-600 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addHub}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={16} className="inline mr-2" />
                    Add Category
                  </button>
                </div>
              </div>
            )}

            {/* Kanban Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(COLUMNS).map((column) => (
                  <Droppable key={column.id} droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-gray-100 rounded-lg p-4 min-h-[500px] border-l-4 ${column.color} ${
                          snapshot.isDraggingOver ? 'bg-gray-200' : ''
                        }`}
                      >
                        <h3 className="font-semibold text-sm text-gray-700 mb-3">{column.title}</h3>
                        <div className="space-y-2">
                          {filterCardsByHub(cards[column.id]).map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white border border-gray-200 rounded-lg p-3 space-y-2 hover:shadow-md transition-shadow ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    {editingCard === card.id ? (
                                      <input
                                        type="text"
                                        value={card.title}
                                        onChange={(e) => updateCardField(column.id, card.id, 'title', e.target.value)}
                                        onBlur={() => setEditingCard(null)}
                                        onKeyPress={(e) => e.key === 'Enter' && setEditingCard(null)}
                                        autoFocus
                                        className="flex-1 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-sm"
                                      />
                                    ) : (
                                      <p
                                        onClick={() => setEditingCard(card.id)}
                                        className="text-sm flex-1 cursor-pointer hover:text-gray-600"
                                      >
                                        {card.title}
                                      </p>
                                    )}
                                    <div className="relative">
                                      <button
                                        onClick={() => setShowCardMenu(showCardMenu === card.id ? null : card.id)}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <MoreVertical size={14} />
                                      </button>
                                      {showCardMenu === card.id && (
                                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                                          <button
                                            onClick={() => {
                                              duplicateCard(column.id, card);
                                              setShowCardMenu(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50"
                                          >
                                            <Copy size={12} className="inline mr-2" />
                                            Duplicate
                                          </button>
                                          <button
                                            onClick={() => {
                                              toggleCardExpansion(card.id);
                                              setShowCardMenu(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50"
                                          >
                                            <FileText size={12} className="inline mr-2" />
                                            Details
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleDeleteCard(column.id, card.id);
                                              setShowCardMenu(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-xs hover:bg-red-50 text-red-600"
                                          >
                                            <Trash2 size={12} className="inline mr-2" />
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {expandedCard === card.id && (
                                    <textarea
                                      value={card.description || ''}
                                      onChange={(e) => updateCardField(column.id, card.id, 'description', e.target.value)}
                                      placeholder="Add description..."
                                      className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs min-h-[60px] focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    />
                                  )}

                                  <div className="flex items-center gap-2">
                                    <select
                                      value={card.priority || 'medium'}
                                      onChange={(e) => updateCardField(column.id, card.id, 'priority', e.target.value)}
                                      className={`text-xs px-2 py-1 rounded border-0 focus:outline-none ${
                                        card.priority === 'high'
                                          ? 'bg-red-100 text-red-700'
                                          : card.priority === 'low'
                                          ? 'bg-gray-100 text-gray-600'
                                          : 'bg-yellow-100 text-yellow-700'
                                      }`}
                                    >
                                      <option value="high">High</option>
                                      <option value="medium">Medium</option>
                                      <option value="low">Low</option>
                                    </select>
                                    <input
                                      type="date"
                                      value={card.dueDate || ''}
                                      onChange={(e) => updateCardField(column.id, card.id, 'dueDate', e.target.value)}
                                      className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none"
                                    />
                                  </div>

                                  <div className="flex flex-wrap gap-1">
                                    {userRoles.map((role) => (
                                      <button
                                        key={role.id}
                                        onClick={() => toggleRole(column.id, card.id, role.id)}
                                        className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                                          card.roles.includes(role.id)
                                            ? `${role.color} text-white`
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                      >
                                        {role.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{formatMonthYear(currentDate)}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1.5 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((date, index) => {
                const tasksForDay = date ? getTasksForDate(date) : [];
                const isToday = date && isSameDay(date, new Date());
                const isSelected = date && selectedDate && isSameDay(date, selectedDate);

                return (
                  <div
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`min-h-[100px] border rounded-lg p-2 cursor-pointer transition-colors ${
                      !date
                        ? 'bg-gray-50 border-gray-100'
                        : isSelected
                          ? 'bg-orange-50 border-orange-300'
                          : isToday
                            ? 'bg-amber-50 border-amber-300'
                            : tasksForDay.length > 0
                              ? 'bg-white border-gray-300 hover:border-orange-200'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday ? 'bg-orange-500 text-white' : 'text-gray-700'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-0.5">
                          {tasksForDay.slice(0, 3).map(task => (
                            <div
                              key={task.id}
                              className={`text-xs rounded px-1.5 py-0.5 truncate font-medium ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : task.priority === 'low'
                                    ? 'bg-gray-100 text-gray-600'
                                    : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {task.title}
                            </div>
                          ))}
                          {tasksForDay.length > 3 && (
                            <div className="text-xs text-orange-500 font-medium">
                              +{tasksForDay.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Tasks for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <div className="space-y-2">
                  {getTasksForDate(selectedDate).length > 0 ? (
                    getTasksForDate(selectedDate).map(task => {
                      const col = Object.entries(cards).find(([, col]) => col.some(c => c.id === task.id))?.[0];
                      const colLabel = { ideas: 'Ideas', inProgress: 'In Progress', readyToPublish: 'Ready', done: 'Done' }[col] ?? '';
                      const roleLabels = (task.roles || [])
                        .map(r => userRoles.find(role => role.id === r)?.label)
                        .filter(Boolean);
                      return (
                        <div key={task.id} className="bg-white border border-gray-200 rounded p-3 flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                            task.priority === 'high' ? 'bg-red-500' : task.priority === 'low' ? 'bg-gray-400' : 'bg-yellow-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900">{task.title}</div>
                            {task.description && (
                              <div className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</div>
                            )}
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {colLabel && (
                                <span className="text-xs bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">{colLabel}</span>
                              )}
                              {roleLabels.map(label => (
                                <span key={label} className="text-xs bg-orange-50 text-orange-700 rounded px-1.5 py-0.5">{label}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-500">No tasks scheduled for this day.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Task Analytics</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900">{stats.totalTasks}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Tasks</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats.tasksByStatus['In Progress']}</div>
                  <div className="text-sm text-gray-600 mt-1">In Progress</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats.tasksByStatus.Done}</div>
                  <div className="text-sm text-gray-600 mt-1">Completed</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Tasks by Category */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <PieChart size={18} />
                    Tasks by Category
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.tasksByHub).map(([hub, count]) => {
                      const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks * 100).toFixed(1) : 0;
                      const hubData = userHubs.find(h => h.label === hub);
                      return (
                        <div key={hub}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: hubData?.color || '#6B7280' }}
                              ></div>
                              <span className="font-medium">{hub}</span>
                            </div>
                            <span className="text-gray-600">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: hubData?.color || '#6B7280'
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tasks by Priority */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Tasks by Priority
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.tasksByPriority).map(([priority, count]) => {
                      const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks * 100).toFixed(1) : 0;
                      const color = priority === 'High' ? '#EF4444' : priority === 'Medium' ? '#F59E0B' : '#6B7280';
                      return (
                        <div key={priority}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
                              <span className="font-medium">{priority}</span>
                            </div>
                            <span className="text-gray-600">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%`, backgroundColor: color }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BarChart3 size={18} />
                Status Distribution
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(stats.tasksByStatus).map(([status, count]) => {
                  const maxCount = Math.max(...Object.values(stats.tasksByStatus));
                  const height = maxCount > 0 ? (count / maxCount * 100) : 0;
                  const colors = {
                    'Ideas': '#9CA3AF',
                    'In Progress': '#3B82F6',
                    'Ready': '#10B981',
                    'Done': '#6B7280'
                  };
                  return (
                    <div key={status} className="text-center">
                      <div className="h-40 flex items-end justify-center mb-2">
                        <div
                          className="w-full rounded-t transition-all duration-500"
                          style={{
                            height: `${height}%`,
                            backgroundColor: colors[status],
                            minHeight: count > 0 ? '20px' : '0'
                          }}
                        ></div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-600 mt-1">{status}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'focus' && (
          <FocusTimer
            focusStats={focusStats}
            onUpdateStats={(newStats) => setFocusStats(prev => ({ ...prev, ...newStats }))}
          />
        )}

        {activeTab === 'notes' && (
          <Notes notes={notes} onUpdateNotes={setNotes} />
        )}

        {activeTab === 'journal' && (
          <Journal journal={journal} onUpdateJournal={setJournal} />
        )}
      </div>
    </div>
  );
}

export default App;
