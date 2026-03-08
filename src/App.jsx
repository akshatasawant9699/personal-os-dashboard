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
      roles: [],
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

  // Filter cards by hub
  const filterCardsByHub = (cardList) => {
    if (selectedHub === 'all') return cardList;
    return cardList.filter((card) =>
      card.roles.some((roleId) => {
        const role = ROLES.find((r) => r.id === roleId);
        return role && role.hub === selectedHub;
      })
    );
  };

  // Sync to calendar
  const handleSyncToCalendar = async () => {
    const accessToken = localStorage.getItem('google_access_token');
    if (!accessToken) {
      alert('Please sign in to sync with Google Calendar');
      return;
    }

    try {
      const tasksToSync = cards.readyToPublish.map((card) => ({
        id: card.id,
        title: card.title,
        description: `Roles: ${card.roles.map((r) => ROLES.find((role) => role.id === r)?.label).join(', ')}`,
      }));

      await syncTasksToCalendar(accessToken, tasksToSync);
      alert('Tasks synced to Google Calendar successfully!');
      loadCalendarEvents();
    } catch (error) {
      alert('Failed to sync to calendar: ' + error.message);
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="text-purple-400" size={32} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Personal OS
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSyncToCalendar}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Calendar size={20} />
                Sync Calendar
              </button>
              <div className="flex items-center gap-3">
                <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
                <span className="text-sm text-gray-400">{user.displayName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
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
        <section className="flex items-center gap-4 flex-wrap">
          <Filter className="text-gray-400" size={20} />
          <span className="text-sm font-semibold text-gray-400">FILTER BY HUB:</span>
          {HUBS.map((hub) => {
            const Icon = hub.icon;
            return (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  selectedHub === hub.id
                    ? 'bg-gray-800 ring-2 ring-gray-600'
                    : 'bg-gray-900/50 hover:bg-gray-800'
                }`}
              >
                <Icon className={hub.color} size={18} />
                {hub.label}
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
                              className={`bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3 ${
                                snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium flex-1">{card.title}</p>
                                <button
                                  onClick={() => handleDeleteCard(column.id, card.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {ROLES.map((role) => (
                                  <button
                                    key={role.id}
                                    onClick={() => toggleRole(column.id, card.id, role.id)}
                                    className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                                      card.roles.includes(role.id)
                                        ? `${role.color} text-white`
                                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
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
      </div>
    </div>
  );
}

export default App;
