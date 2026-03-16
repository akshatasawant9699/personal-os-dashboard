import { Target, Clock, FileText, CalendarDays, TrendingUp, Zap, StickyNote, BookOpen } from 'lucide-react';

const GREETINGS = ['Good morning', 'Good afternoon', 'Good evening'];

export default function Dashboard({ cards, ruleOfThree, notes, journal, focusStats, onNavigate }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? GREETINGS[0] : hour < 18 ? GREETINGS[1] : GREETINGS[2];
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const allCards = [...cards.ideas, ...cards.inProgress, ...cards.readyToPublish, ...cards.done];
  const todayISO = new Date().toISOString().slice(0, 10);
  const todayTasks = allCards.filter(c => c.dueDate === todayISO);
  const overdueTasks = allCards.filter(c => c.dueDate && c.dueDate < todayISO && !cards.done.some(d => d.id === c.id));
  const activePriorities = ruleOfThree.filter(r => r.trim());
  const todayJournal = journal.find(j => j.date === todayISO);
  const completedToday = cards.done.filter(c => {
    if (!c.createdAt) return false;
    return c.createdAt.slice(0, 10) === todayISO;
  }).length;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">{greeting}!</h2>
        <p className="text-white/80 mt-1">{todayStr}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
            <div className="text-2xl font-bold">{allCards.length}</div>
            <div className="text-xs text-white/80">Total Tasks</div>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
            <div className="text-2xl font-bold">{cards.inProgress.length}</div>
            <div className="text-xs text-white/80">In Progress</div>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
            <div className="text-2xl font-bold">{completedToday}</div>
            <div className="text-xs text-white/80">Done Today</div>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
            <div className="text-2xl font-bold">{focusStats.totalSessions}</div>
            <div className="text-xs text-white/80">Focus Sessions</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's priorities */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-orange-500" />
            <h3 className="font-semibold text-gray-900">Today's Priorities</h3>
          </div>
          {activePriorities.length > 0 ? (
            <div className="space-y-2">
              {activePriorities.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-orange-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  <span className="text-sm font-medium text-gray-800">{p}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No priorities set yet. Go to Board to add them.</p>
          )}
        </div>

        {/* Today's tasks due */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={18} className="text-blue-500" />
            <h3 className="font-semibold text-gray-900">Due Today</h3>
            {overdueTasks.length > 0 && (
              <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                {overdueTasks.length} overdue
              </span>
            )}
          </div>
          {todayTasks.length > 0 ? (
            <div className="space-y-2">
              {todayTasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2.5 bg-blue-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-red-500' : task.priority === 'low' ? 'bg-gray-400' : 'bg-yellow-400'
                  }`} />
                  <span className="text-sm text-gray-800 truncate">{task.title}</span>
                </div>
              ))}
              {todayTasks.length > 5 && <p className="text-xs text-gray-500">+{todayTasks.length - 5} more</p>}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No tasks due today.</p>
          )}
        </div>

        {/* Journal mood */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-purple-500" />
            <h3 className="font-semibold text-gray-900">Today's Journal</h3>
          </div>
          {todayJournal ? (
            <div>
              <div className="text-3xl mb-2">{todayJournal.mood}</div>
              <p className="text-sm text-gray-600 line-clamp-3">{todayJournal.content || 'No entry yet.'}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-400 mb-3">You haven't journaled today.</p>
              <button onClick={() => onNavigate('journal')} className="text-sm text-purple-600 font-medium hover:underline">
                Write an entry
              </button>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-amber-500" />
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Board', icon: TrendingUp, tab: 'kanban', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
              { label: 'Focus', icon: Clock, tab: 'focus', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
              { label: 'Notes', icon: StickyNote, tab: 'notes', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
              { label: 'Journal', icon: BookOpen, tab: 'journal', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
            ].map(({ label, icon: Icon, tab, color }) => (
              <button
                key={tab}
                onClick={() => onNavigate(tab)}
                className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${color}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
