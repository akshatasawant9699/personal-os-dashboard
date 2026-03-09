import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Target,
  Plus,
  Filter,
  LogOut,
  Calendar,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Brain,
  Briefcase,
  Plane,
  User,
  MoreVertical,
  Copy,
  Clock,
  AlertCircle,
  Search,
  Save,
  FileText,
} from 'lucide-react';
import { auth, signInWithGoogle, signOutUser } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getCalendarEvents, syncTasksToCalendar } from './utils/calendar';

const ROLES = [
  { id: 'salesforce', label: 'Salesforce Dev Advocate', color: 'bg-blue-500', hub: 'tech' },
  { id: 'youtube-tech', label: 'Tech/AI YouTuber', color: 'bg-red-500', hub: 'tech' },
  { id: 'pm-shadow', label: 'Product Manager Shadow', color: 'bg-purple-500', hub: 'career' },
  { id: 'travel-creator', label: 'Travel Creator', color: 'bg-green-500', hub: 'travel' },
  { id: 'linkedin', label: 'LinkedIn Creator', color: 'bg-indigo-500', hub: 'career' },
  { id: 'devrel', label: 'DevRel Consultant', color: 'bg-yellow-500', hub: 'career' },
  { id: 'ai-research', label: 'AI Research Member', color: 'bg-pink-500', hub: 'tech' },
];

const HUBS = [
  { id: 'all', label: 'All Tasks', icon: Sparkles, color: 'text-gray-400' },
  { id: 'tech', label: 'Hub A: Tech/AI', icon: Brain, color: 'text-hub-tech' },
  { id: 'career', label: 'Hub B: Career', icon: Briefcase, color: 'text-hub-career' },
  { id: 'travel', label: 'Hub C: Travel', icon: Plane, color: 'text-hub-travel' },
];

const COLUMNS = {
  ideas: { id: 'ideas', title: 'Idea Box', color: 'border-gray-700' },
  inProgress: { id: 'inProgress', title: 'In Progress', color: 'border-yellow-600' },
  readyToPublish: { id: 'readyToPublish', title: 'Ready to Publish', color: 'border-green-600' },
  done: { id: 'done', title: 'Done', color: 'border-gray-800' },
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ruleOfThree, setRuleOfThree] = useState(['', '', '']);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        loadUserData(currentUser.uid);
        loadCalendarEvents();
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user data from localStorage
  const loadUserData = (userId) => {
    const savedData = localStorage.getItem(`personal-os-${userId}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setRuleOfThree(parsed.ruleOfThree || ['', '', '']);
      setCards(parsed.cards || { ideas: [], inProgress: [], readyToPublish: [], done: [] });
    }
  };

  // Save user data to localStorage
  const saveUserData = (userId, data) => {
    localStorage.setItem(`personal-os-${userId}`, JSON.stringify(data));
  };

  // Auto-save on data change
  useEffect(() => {
    if (user) {
      saveUserData(user.uid, { ruleOfThree, cards });
    }
  }, [ruleOfThree, cards, user]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // "/" - Focus search
      if (e.key === '/') {
        e.preventDefault();
        document.querySelector('input[placeholder*="Search"]')?.focus();
      }

      // "n" - Focus quick capture
      if (e.key === 'n') {
        e.preventDefault();
        document.querySelector('input[placeholder*="Quickly jot"]')?.focus();
      }

      // "Escape" - Clear search and close menus
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

  // Add/Edit card
  const handleSaveCard = (columnId, card) => {
    if (editingCard) {
      setCards((prev) => ({
        ...prev,
        [columnId]: prev[columnId].map((c) => (c.id === card.id ? card : c)),
      }));
    } else {
      setCards((prev) => ({
        ...prev,
        [columnId]: [...prev[columnId], { ...card, id: Date.now().toString(), createdAt: new Date().toISOString() }],
      }));
    }
    setEditingCard(null);
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

    // Filter by hub
    if (selectedHub !== 'all') {
      filtered = filtered.filter((card) =>
        card.roles.some((roleId) => {
          const role = ROLES.find((r) => r.id === roleId);
          return role && role.hub === selectedHub;
        })
      );
    }

    // Filter by search query
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
      alert('No tasks in "Ready to Publish" column to sync. Move some tasks there first!');
      return;
    }

    try {
      const tasksData = tasksToSync.map((card) => ({
        id: card.id,
        title: card.title,
        description: `Roles: ${card.roles.map((r) => ROLES.find((role) => role.id === r)?.label).join(', ')}`,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      }));

      const result = await syncTasksToCalendar(accessToken, tasksData);

      if (result.failedTasks && result.failedTasks.length > 0) {
        alert(`Synced ${result.syncedTasks.length} tasks successfully. ${result.failedTasks.length} tasks failed. Please sign out and sign in again to refresh your access.`);
      } else {
        alert(`Successfully synced ${result.syncedTasks.length} tasks to Google Calendar!`);
      }

      loadCalendarEvents();
    } catch (error) {
      console.error('Calendar sync error:', error);
      if (error.message.includes('token') || error.message.includes('401') || error.message.includes('403')) {
        alert('Your Google Calendar access has expired. Please sign out and sign in again to refresh access.');
      } else {
        alert('Failed to sync to calendar: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="text-center space-y-8 p-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Personal OS
            </h1>
            <p className="text-xl text-gray-400">Your Ultimate Productivity Dashboard</p>
          </div>
          <button
            onClick={handleSignIn}
            className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <User size={24} />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Sparkles className="text-purple-400" size={24} />
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Personal OS
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleSyncToCalendar}
                className="px-2 sm:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm"
              >
                <Calendar size={16} />
                <span className="hidden sm:inline">Sync Calendar</span>
              </button>
              <div className="hidden md:flex items-center gap-3">
                <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
                <span className="text-sm text-gray-400">{user.displayName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Search Bar */}
        <section className="space-y-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks... (Press / to search)"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>⌨️ Shortcuts:</span>
            <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">/</kbd> Search</span>
            <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">N</kbd> Quick capture</span>
            <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">ESC</kbd> Clear/Close</span>
          </div>
        </section>

        {/* Rule of 3 */}
        <section className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-purple-400" size={24} />
            <h2 className="text-xl font-bold">Rule of 3 - Today's Non-Negotiables</h2>
          </div>
          <div className="grid gap-3">
            {ruleOfThree.map((rule, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-2xl font-bold text-purple-400">{index + 1}.</span>
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  placeholder={`Non-negotiable task #${index + 1}`}
                  className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-600"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Capture */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold">Quick Capture - Brain Dump</h2>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={quickCapture}
              onChange={(e) => setQuickCapture(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickCapture()}
              placeholder="Quickly jot down an idea before you forget it..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
            />
            <button
              onClick={handleQuickCapture}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Capture
            </button>
          </div>
        </section>

        {/* Hub Filter */}
        <section className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
          <Filter className="text-gray-400 flex-shrink-0" size={20} />
          <span className="text-xs sm:text-sm font-semibold text-gray-400 flex-shrink-0">FILTER:</span>
          {HUBS.map((hub) => {
            const Icon = hub.icon;
            return (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-1 sm:gap-2 flex-shrink-0 text-sm ${
                  selectedHub === hub.id
                    ? 'bg-gray-800 ring-2 ring-gray-600'
                    : 'bg-gray-900/50 hover:bg-gray-800'
                }`}
              >
                <Icon className={hub.color} size={16} />
                <span className="hidden sm:inline">{hub.label}</span>
                <span className="sm:hidden">{hub.label.split(':')[0]}</span>
              </button>
            );
          })}
        </section>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(COLUMNS).map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-gray-900/50 border-2 ${column.color} rounded-xl p-4 min-h-[500px] ${
                      snapshot.isDraggingOver ? 'bg-gray-800/50' : ''
                    }`}
                  >
                    <h3 className="font-bold text-lg mb-4 text-gray-200">{column.title}</h3>
                    <div className="space-y-3">
                      {filterCardsByHub(cards[column.id]).map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3 hover:border-gray-600 transition-all ${
                                snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500' : ''
                              } ${expandedCard === card.id ? 'ring-1 ring-blue-500/50' : ''}`}
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
                                    className="flex-1 bg-gray-900 border border-blue-500 rounded px-2 py-1 text-sm font-medium focus:outline-none"
                                  />
                                ) : (
                                  <p
                                    onClick={() => setEditingCard(card.id)}
                                    className="text-sm font-medium flex-1 cursor-pointer hover:text-blue-400 transition-colors"
                                  >
                                    {card.title}
                                  </p>
                                )}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => toggleCardExpansion(card.id)}
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                    title="Expand details"
                                  >
                                    <FileText size={16} />
                                  </button>
                                  <div className="relative">
                                    <button
                                      onClick={() => setShowCardMenu(showCardMenu === card.id ? null : card.id)}
                                      className="text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                      <MoreVertical size={16} />
                                    </button>
                                    {showCardMenu === card.id && (
                                      <div className="absolute right-0 top-6 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[150px]">
                                        <button
                                          onClick={() => duplicateCard(column.id, card)}
                                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 flex items-center gap-2"
                                        >
                                          <Copy size={14} />
                                          Duplicate
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleDeleteCard(column.id, card.id);
                                            setShowCardMenu(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 text-red-400 flex items-center gap-2"
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
                                  className={`text-xs px-2 py-1 rounded border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    card.priority === 'high'
                                      ? 'bg-red-500/20 text-red-400'
                                      : card.priority === 'low'
                                      ? 'bg-gray-700 text-gray-400'
                                      : 'bg-yellow-500/20 text-yellow-400'
                                  }`}
                                >
                                  <option value="high">🔴 High Priority</option>
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
                                  className="text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-400"
                                />
                              </div>

                              {/* Expanded Description */}
                              {expandedCard === card.id && (
                                <div className="space-y-2 pt-2 border-t border-gray-700">
                                  <textarea
                                    value={card.description || ''}
                                    onChange={(e) => updateCardField(column.id, card.id, 'description', e.target.value)}
                                    placeholder="Add description, notes, links..."
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-600 min-h-[80px]"
                                  />
                                </div>
                              )}

                              {/* Role Tags */}
                              <div className="flex flex-wrap gap-1.5">
                                {ROLES.map((role) => (
                                  <button
                                    key={role.id}
                                    onClick={() => toggleRole(column.id, card.id, role.id)}
                                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                                      card.roles.includes(role.id)
                                        ? `${role.color} text-white`
                                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                                  >
                                    {role.label}
                                  </button>
                                ))}
                              </div>

                              {/* Card Meta */}
                              <div className="text-xs text-gray-500 pt-1 border-t border-gray-700/50">
                                Created {new Date(card.createdAt).toLocaleDateString()}
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
      </div>
    </div>
  );
}

export default App;
