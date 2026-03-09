import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Target,
  Plus,
  LogOut,
  Calendar as CalendarIcon,
  Trash2,
  Edit2,
  X,
  Sparkles,
  User,
  MoreVertical,
  Copy,
  Clock,
  Search,
  FileText,
  Sun,
  Palmtree,
  LayoutGrid,
  Home,
  Check,
  Settings,
} from 'lucide-react';
import { auth, signInWithGoogle, signOutUser, getUserData, saveUserData } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getCalendarEvents, syncTasksToCalendar } from './utils/calendar';

const DEFAULT_ROLES = [
  { id: 'work', label: 'Work', color: 'bg-blue-400', hub: 'career' },
  { id: 'personal', label: 'Personal', color: 'bg-green-400', hub: 'personal' },
  { id: 'learning', label: 'Learning', color: 'bg-purple-400', hub: 'growth' },
];

const HUBS = [
  { id: 'all', label: 'All Tasks', icon: Sparkles, color: 'text-orange-500' },
  { id: 'career', label: '💼 Career', icon: Home, color: 'text-blue-500' },
  { id: 'personal', label: '🌴 Personal', icon: Palmtree, color: 'text-green-500' },
  { id: 'growth', label: '🌱 Growth', icon: Sun, color: 'text-purple-500' },
];

const COLUMNS = {
  ideas: { id: 'ideas', title: '💡 Ideas', color: 'border-amber-300 bg-amber-50/50' },
  inProgress: { id: 'inProgress', title: '🚀 In Progress', color: 'border-orange-300 bg-orange-50/50' },
  readyToPublish: { id: 'readyToPublish', title: '✨ Ready', color: 'border-green-300 bg-green-50/50' },
  done: { id: 'done', title: '✅ Done', color: 'border-gray-300 bg-gray-50/50' },
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' or 'calendar'

  // User settings
  const [userRoles, setUserRoles] = useState(DEFAULT_ROLES);
  const [areasOfFocus, setAreasOfFocus] = useState('');
  const [purposeOfUse, setPurposeOfUse] = useState('');
  const [customTags, setCustomTags] = useState(['']);

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

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        await loadUserDataFromFirestore(currentUser.uid);
        loadCalendarEvents();
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user data from Firestore
  const loadUserDataFromFirestore = async (userId) => {
    try {
      const userData = await getUserData(userId);

      if (userData) {
        // Existing user
        setRuleOfThree(userData.ruleOfThree || ['', '', '']);
        setNonPriorityTasks(userData.nonPriorityTasks || ['', '']);
        setCards(userData.cards || { ideas: [], inProgress: [], readyToPublish: [], done: [] });
        setUserRoles(userData.customRoles || DEFAULT_ROLES);
        setAreasOfFocus(userData.areasOfFocus || '');
        setPurposeOfUse(userData.purposeOfUse || '');
        setShowOnboarding(false);
      } else {
        // New user - show onboarding
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Save user data to Firestore
  const saveUserDataToFirestore = async () => {
    if (!user) return;

    try {
      await saveUserData(user.uid, {
        ruleOfThree,
        nonPriorityTasks,
        cards,
        customRoles: userRoles,
        areasOfFocus,
        purposeOfUse,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Auto-save on data change
  useEffect(() => {
    if (user && !showOnboarding) {
      const timer = setTimeout(() => {
        saveUserDataToFirestore();
      }, 1000); // Debounce saves

      return () => clearTimeout(timer);
    }
  }, [ruleOfThree, nonPriorityTasks, cards, user, showOnboarding]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

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
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Load calendar events
  const loadCalendarEvents = async () => {
    const accessToken = localStorage.getItem('google_access_token');
    if (accessToken) {
      try {
        const events = await getCalendarEvents(accessToken);
        setCalendarEvents(events);
      } catch (error) {
        console.error('Failed to load calendar events:', error);
      }
    }
  };

  // Handle onboarding completion
  const completeOnboarding = async () => {
    // Convert custom tags to roles
    const newRoles = customTags
      .filter(tag => tag.trim() !== '')
      .slice(0, 10)
      .map((tag, index) => ({
        id: `custom-${index}`,
        label: tag.trim(),
        color: [
          'bg-rose-400', 'bg-pink-400', 'bg-fuchsia-400', 'bg-purple-400',
          'bg-violet-400', 'bg-indigo-400', 'bg-blue-400', 'bg-cyan-400',
          'bg-teal-400', 'bg-emerald-400'
        ][index % 10],
        hub: 'personal',
      }));

    setUserRoles([...DEFAULT_ROLES, ...newRoles]);

    // Save to Firestore
    await saveUserData(user.uid, {
      customRoles: [...DEFAULT_ROLES, ...newRoles],
      areasOfFocus,
      purposeOfUse,
      ruleOfThree: ['', '', ''],
      nonPriorityTasks: ['', ''],
      cards: { ideas: [], inProgress: [], readyToPublish: [], done: [] },
      lastUpdated: new Date().toISOString(),
    });

    setShowOnboarding(false);
  };

  // Handle sign in
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert('Failed to sign in: ' + error.message);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOutUser();
      setRuleOfThree(['', '', '']);
      setCards({ ideas: [], inProgress: [], readyToPublish: [], done: [] });
      setUserRoles(DEFAULT_ROLES);
    } catch (error) {
      alert('Failed to sign out: ' + error.message);
    }
  };

  // Handle Rule of 3 changes
  const handleRuleChange = (index, value) => {
    const newRules = [...ruleOfThree];
    newRules[index] = value;
    setRuleOfThree(newRules);
  };

  // Handle non-priority task changes
  const handleNonPriorityChange = (index, value) => {
    const newTasks = [...nonPriorityTasks];
    newTasks[index] = value;
    setNonPriorityTasks(newTasks);
  };

  // Add all tasks to board
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
      priority: index < 3 ? 'high' : 'low', // First 3 are priority
      dueDate: null,
      createdAt: new Date().toISOString(),
    }));

    setCards((prev) => ({
      ...prev,
      ideas: [...prev.ideas, ...newCards],
    }));

    // Clear the tasks after adding
    setRuleOfThree(['', '', '']);
    setNonPriorityTasks(['', '']);

    alert(`Added ${tasksToAdd.length} task(s) to the board! 🎉`);
  };

  // Trigger onboarding manually
  const triggerOnboarding = () => {
    setOnboardingStep(0);
    setCustomTags(['']);
    setShowOnboarding(true);
  };

  // Handle Quick Capture
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

    setCards((prev) => ({
      ...prev,
      ideas: [...prev.ideas, newCard],
    }));
    setQuickCapture('');
  };

  // Handle Drag End
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

  // Delete card
  const handleDeleteCard = (columnId, cardId) => {
    setCards((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((c) => c.id !== cardId),
    }));
  };

  // Toggle role on card
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

  // Update card field
  const updateCardField = (columnId, cardId, field, value) => {
    setCards((prev) => ({
      ...prev,
      [columnId]: prev[columnId].map((card) =>
        card.id === cardId ? { ...card, [field]: value } : card
      ),
    }));
  };

  // Duplicate card
  const duplicateCard = (columnId, card) => {
    const newCard = {
      ...card,
      id: Date.now().toString(),
      title: `${card.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => ({
      ...prev,
      [columnId]: [...prev[columnId], newCard],
    }));
    setShowCardMenu(null);
  };

  // Toggle card expansion
  const toggleCardExpansion = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  // Filter cards by hub and search
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

  // Sync to calendar
  const handleSyncToCalendar = async () => {
    const accessToken = localStorage.getItem('google_access_token');
    if (!accessToken) {
      alert('Please sign out and sign in again to refresh your Google Calendar access.');
      return;
    }

    const tasksToSync = cards.readyToPublish;
    if (tasksToSync.length === 0) {
      alert('No tasks in "Ready" column to sync!');
      return;
    }

    try {
      const tasksData = tasksToSync.map((card) => ({
        id: card.id,
        title: card.title,
        description: `Roles: ${card.roles.map((r) => userRoles.find((role) => role.id === r)?.label).join(', ')}`,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }));

      const result = await syncTasksToCalendar(accessToken, tasksData);
      alert(`Successfully synced ${result.syncedTasks.length} tasks!`);
      loadCalendarEvents();
    } catch (error) {
      console.error('Calendar sync error:', error);
      alert('Failed to sync to calendar. Please try again.');
    }
  };

  // Add custom tag input
  const addCustomTagInput = () => {
    if (customTags.length < 10) {
      setCustomTags([...customTags, '']);
    }
  };

  // Update custom tag
  const updateCustomTag = (index, value) => {
    const newTags = [...customTags];
    newTags[index] = value;
    setCustomTags(newTags);
  };

  // Remove custom tag
  const removeCustomTag = (index) => {
    const newTags = customTags.filter((_, i) => i !== index);
    setCustomTags(newTags.length > 0 ? newTags : ['']);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-xl text-gray-700 flex items-center gap-3">
          <Sun className="animate-spin text-orange-500" size={32} />
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
            <Sun className="mx-auto text-orange-500 animate-float" size={80} />
            <h1 className="text-6xl font-bold gradient-summer">
              Personal OS
            </h1>
            <p className="text-2xl text-gray-700 font-light">Your Summer Productivity Hub ☀️🌴</p>
          </div>
          <button
            onClick={handleSignIn}
            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-2xl font-semibold hover:from-orange-500 hover:to-amber-500 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto shadow-lg"
          >
            <User size={24} />
            Sign in with Google
          </button>
          <p className="text-sm text-gray-600">✨ Join up to 100 users managing their productivity!</p>
        </div>
      </div>
    );
  }

  // Onboarding Flow
  if (showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-4">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
          <div className="text-center mb-8">
            <Sun className="mx-auto text-orange-500 mb-4 animate-float" size={64} />
            <h2 className="text-4xl font-bold gradient-summer mb-2">Welcome to Personal OS! 🎉</h2>
            <p className="text-gray-600">Let's personalize your workspace</p>
          </div>

          {onboardingStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  What are your main areas of focus?
                </label>
                <textarea
                  value={areasOfFocus}
                  onChange={(e) => setAreasOfFocus(e.target.value)}
                  placeholder="E.g., Software development, content creation, fitness, learning..."
                  className="w-full bg-white border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 placeholder-gray-400 min-h-[100px]"
                />
              </div>
              <button
                onClick={() => setOnboardingStep(1)}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition-all transform hover:scale-105"
              >
                Next →
              </button>
            </div>
          )}

          {onboardingStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  What are you using this for?
                </label>
                <textarea
                  value={purposeOfUse}
                  onChange={(e) => setPurposeOfUse(e.target.value)}
                  placeholder="E.g., Managing multiple projects, tracking habits, organizing life..."
                  className="w-full bg-white border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 placeholder-gray-400 min-h-[100px]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setOnboardingStep(0)}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Create your custom tags (up to 10)
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  These will help you organize and categorize your tasks
                </p>
                <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
                  {customTags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => updateCustomTag(index, e.target.value)}
                        placeholder={`Tag ${index + 1} (e.g., Work, Fitness, Learning)`}
                        className="flex-1 bg-white border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 placeholder-gray-400"
                      />
                      {customTags.length > 1 && (
                        <button
                          onClick={() => removeCustomTag(index)}
                          className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
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
                    className="mt-3 w-full px-4 py-3 bg-orange-100 text-orange-700 rounded-xl font-semibold hover:bg-orange-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Another Tag
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setOnboardingStep(1)}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={completeOnboarding}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800">
      {/* Header */}
      <header className="border-b-2 border-orange-200 bg-white/70 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Sun className="text-orange-500 animate-float" size={28} />
              <h1 className="text-lg sm:text-2xl font-bold gradient-summer">
                Personal OS
              </h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 bg-orange-100/50 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'kanban'
                    ? 'bg-white text-orange-600 shadow-md'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <LayoutGrid size={18} />
                <span className="hidden sm:inline">Kanban</span>
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'calendar'
                    ? 'bg-white text-orange-600 shadow-md'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <CalendarIcon size={18} />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleSyncToCalendar}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-md text-sm"
              >
                <CalendarIcon size={16} />
                <span className="hidden sm:inline">Sync</span>
              </button>
              <button
                onClick={triggerOnboarding}
                className="p-2 hover:bg-orange-100 rounded-xl transition-colors"
                title="Customize Tags & Settings"
              >
                <Settings size={18} className="text-gray-600" />
              </button>
              <div className="hidden md:flex items-center gap-3 bg-white/70 px-3 py-2 rounded-xl shadow-sm">
                <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-orange-200" />
                <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-orange-100 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {activeTab === 'kanban' && (
          <>
            {/* Search Bar */}
            <section className="space-y-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks... (Press / to search)"
                  className="w-full bg-white/70 border-2 border-orange-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>⌨️ Shortcuts:</span>
                <span><kbd className="px-2 py-1 bg-white rounded-lg border border-orange-200 shadow-sm">/</kbd> Search</span>
                <span><kbd className="px-2 py-1 bg-white rounded-lg border border-orange-200 shadow-sm">N</kbd> Quick capture</span>
              </div>
            </section>

            {/* Daily Tasks */}
            <section className="bg-gradient-to-r from-orange-100/70 to-amber-100/70 border-2 border-orange-300 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="text-orange-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">☀️ Today's Tasks</h2>
                </div>
                <button
                  onClick={handleAddToBoard}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add to Board
                </button>
              </div>

              {/* Top 3 Priorities */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-orange-700 mb-2 uppercase tracking-wide">🔥 Top 3 Priorities</h3>
                <div className="grid gap-2">
                  {ruleOfThree.map((rule, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-orange-600 w-8">{index + 1}.</span>
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                        placeholder={`Priority task #${index + 1}`}
                        className="flex-1 bg-white/80 border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400 shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Priority Tasks */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">📝 Additional Tasks</h3>
                <div className="grid gap-2">
                  {nonPriorityTasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xl text-gray-500 w-8">•</span>
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => handleNonPriorityChange(index, e.target.value)}
                        placeholder={`Additional task #${index + 1}`}
                        className="flex-1 bg-white/60 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-400 shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-600 bg-white/50 rounded-lg p-3">
                💡 <strong>Tip:</strong> Focus on your top 3 priorities first! Additional tasks are low priority.
              </div>
            </section>

            {/* Quick Capture */}
            <section className="bg-white/70 border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="text-orange-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">💡 Quick Capture</h2>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={quickCapture}
                  onChange={(e) => setQuickCapture(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickCapture()}
                  placeholder="Capture an idea before it flies away..."
                  className="flex-1 bg-white border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400 shadow-sm"
                />
                <button
                  onClick={handleQuickCapture}
                  className="px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
                >
                  Capture
                </button>
              </div>
            </section>

            {/* Hub Filter */}
            <section className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
              <span className="text-sm font-semibold text-gray-600 flex-shrink-0">FILTER:</span>
              {HUBS.map((hub) => {
                const Icon = hub.icon;
                return (
                  <button
                    key={hub.id}
                    onClick={() => setSelectedHub(hub.id)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 flex-shrink-0 text-sm shadow-sm ${
                      selectedHub === hub.id
                        ? 'bg-white ring-2 ring-orange-400 text-orange-600'
                        : 'bg-white/70 hover:bg-white text-gray-600'
                    }`}
                  >
                    <Icon className={hub.color} size={16} />
                    <span>{hub.label}</span>
                  </button>
                );
              })}
            </section>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(COLUMNS).map((column) => (
                  <Droppable key={column.id} droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`${column.color} border-2 rounded-2xl p-4 min-h-[500px] shadow-lg transition-all ${
                          snapshot.isDraggingOver ? 'ring-2 ring-orange-400 scale-[1.02]' : ''
                        }`}
                      >
                        <h3 className="font-bold text-lg mb-4 text-gray-800">{column.title}</h3>
                        <div className="space-y-3">
                          {filterCardsByHub(cards[column.id]).map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white border-2 border-orange-200 rounded-xl p-4 space-y-3 hover:border-orange-400 transition-all shadow-md ${
                                    snapshot.isDragging ? 'shadow-2xl ring-2 ring-orange-500 rotate-2 scale-105' : ''
                                  } ${expandedCard === card.id ? 'ring-2 ring-orange-400' : ''}`}
                                >
                                  {/* Header: Title & Actions */}
                                  <div className="flex items-start justify-between gap-2">
                                    {editingCard === card.id ? (
                                      <input
                                        type="text"
                                        value={card.title}
                                        onChange={(e) => updateCardField(column.id, card.id, 'title', e.target.value)}
                                        onBlur={() => setEditingCard(null)}
                                        onKeyPress={(e) => e.key === 'Enter' && setEditingCard(null)}
                                        autoFocus
                                        className="flex-1 bg-orange-50 border-2 border-orange-300 rounded-lg px-2 py-1 text-sm font-medium focus:outline-none"
                                      />
                                    ) : (
                                      <p
                                        onClick={() => setEditingCard(card.id)}
                                        className="text-sm font-medium flex-1 cursor-pointer hover:text-orange-600 transition-colors text-gray-800"
                                      >
                                        {card.title}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => toggleCardExpansion(card.id)}
                                        className="text-gray-400 hover:text-orange-600 transition-colors"
                                        title="Expand details"
                                      >
                                        <FileText size={16} />
                                      </button>
                                      <div className="relative">
                                        <button
                                          onClick={() => setShowCardMenu(showCardMenu === card.id ? null : card.id)}
                                          className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                          <MoreVertical size={16} />
                                        </button>
                                        {showCardMenu === card.id && (
                                          <div className="absolute right-0 top-6 bg-white border-2 border-orange-200 rounded-xl shadow-xl z-10 min-w-[150px] overflow-hidden">
                                            <button
                                              onClick={() => duplicateCard(column.id, card)}
                                              className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50 flex items-center gap-2 transition-colors"
                                            >
                                              <Copy size={14} />
                                              Duplicate
                                            </button>
                                            <button
                                              onClick={() => {
                                                handleDeleteCard(column.id, card.id);
                                                setShowCardMenu(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                                            >
                                              <Trash2 size={14} />
                                              Delete
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Priority */}
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={card.priority || 'medium'}
                                      onChange={(e) => updateCardField(column.id, card.id, 'priority', e.target.value)}
                                      className={`text-xs px-2 py-1 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                                        card.priority === 'high'
                                          ? 'bg-red-100 text-red-700 border-red-300'
                                          : card.priority === 'low'
                                          ? 'bg-gray-100 text-gray-700 border-gray-300'
                                          : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                      }`}
                                    >
                                      <option value="high">🔴 High</option>
                                      <option value="medium">🟡 Medium</option>
                                      <option value="low">⚪ Low</option>
                                    </select>
                                  </div>

                                  {/* Due Date */}
                                  <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-gray-500" />
                                    <input
                                      type="date"
                                      value={card.dueDate || ''}
                                      onChange={(e) => updateCardField(column.id, card.id, 'dueDate', e.target.value)}
                                      className="text-xs bg-white border-2 border-orange-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
                                    />
                                  </div>

                                  {/* Expanded Description */}
                                  {expandedCard === card.id && (
                                    <div className="space-y-2 pt-2 border-t-2 border-orange-100">
                                      <textarea
                                        value={card.description || ''}
                                        onChange={(e) => updateCardField(column.id, card.id, 'description', e.target.value)}
                                        placeholder="Add notes, links, details..."
                                        className="w-full bg-orange-50/50 border-2 border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400 min-h-[80px]"
                                      />
                                    </div>
                                  )}

                                  {/* Role Tags */}
                                  <div className="flex flex-wrap gap-1.5">
                                    {userRoles.map((role) => (
                                      <button
                                        key={role.id}
                                        onClick={() => toggleRole(column.id, card.id, role.id)}
                                        className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                                          card.roles.includes(role.id)
                                            ? `${role.color} text-white`
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                      >
                                        {role.label}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Card Meta */}
                                  <div className="text-xs text-gray-500 pt-1 border-t border-orange-100">
                                    {new Date(card.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
          <div className="bg-white/70 border-2 border-orange-200 rounded-2xl p-8 shadow-lg min-h-[600px]">
            <div className="text-center space-y-6">
              <CalendarIcon className="mx-auto text-orange-500" size={80} />
              <div>
                <h2 className="text-3xl font-bold gradient-summer mb-2">Calendar View</h2>
                <p className="text-gray-600 text-lg">
                  Your synced events and tasks will appear here
                </p>
              </div>

              {calendarEvents.length > 0 ? (
                <div className="grid gap-4 mt-8">
                  {calendarEvents.slice(0, 10).map((event, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-orange-100/50 to-amber-100/50 border-2 border-orange-200 rounded-xl p-4 text-left"
                    >
                      <h3 className="font-semibold text-gray-800">{event.summary || 'Untitled Event'}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.start?.dateTime
                          ? new Date(event.start.dateTime).toLocaleString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : 'All day'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-8">
                  <p className="text-gray-500 mb-4">No calendar events synced yet</p>
                  <button
                    onClick={handleSyncToCalendar}
                    className="px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md mx-auto"
                  >
                    Sync Tasks to Calendar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
