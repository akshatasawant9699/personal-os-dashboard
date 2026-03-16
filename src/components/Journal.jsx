import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const MOODS = [
  { emoji: '\u{1F929}', label: 'Amazing' },
  { emoji: '\u{1F60A}', label: 'Good' },
  { emoji: '\u{1F610}', label: 'Okay' },
  { emoji: '\u{1F614}', label: 'Low' },
  { emoji: '\u{1F622}', label: 'Rough' },
];

export default function Journal({ journal, onUpdateJournal }) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const [viewDate, setViewDate] = useState(todayISO);

  const entry = journal.find(j => j.date === viewDate) || null;
  const content = entry?.content || '';
  const mood = entry?.mood || null;

  const updateEntry = (field, value) => {
    const now = new Date().toISOString();
    if (entry) {
      onUpdateJournal(journal.map(j =>
        j.date === viewDate ? { ...j, [field]: value, updatedAt: now } : j
      ));
    } else {
      onUpdateJournal([...journal, {
        id: Date.now().toString(),
        date: viewDate,
        mood: field === 'mood' ? value : null,
        content: field === 'content' ? value : '',
        createdAt: now,
        updatedAt: now,
      }]);
    }
  };

  const shiftDay = (delta) => {
    const d = new Date(`${viewDate}T00:00:00`);
    d.setDate(d.getDate() + delta);
    setViewDate(d.toISOString().slice(0, 10));
  };

  const isToday = viewDate === todayISO;
  const dateLabel = new Date(`${viewDate}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  // Recent entries for timeline
  const sorted = [...journal].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14);

  return (
    <div className="space-y-6">
      {/* Date navigation */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
        <button onClick={() => shiftDay(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="font-semibold text-gray-900">{dateLabel}</div>
          {isToday && <span className="text-xs text-orange-500 font-medium">Today</span>}
        </div>
        <button onClick={() => shiftDay(1)} className="p-2 hover:bg-gray-100 rounded-lg" disabled={isToday}>
          <ChevronRight size={20} className={isToday ? 'text-gray-300' : ''} />
        </button>
      </div>

      {/* Mood picker */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">How are you feeling?</h3>
        <div className="flex justify-center gap-4">
          {MOODS.map(m => (
            <button
              key={m.label}
              onClick={() => updateEntry('mood', m.emoji)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                mood === m.emoji
                  ? 'bg-orange-100 ring-2 ring-orange-400 scale-110'
                  : 'hover:bg-gray-50 hover:scale-105'
              }`}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs text-gray-600">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Journal entry */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Journal Entry</h3>
        <textarea
          value={content}
          onChange={e => updateEntry('content', e.target.value)}
          placeholder="What's on your mind today? Reflect on wins, challenges, or anything..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y"
        />
      </div>

      {/* Recent entries timeline */}
      {sorted.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Entries</h3>
          <div className="space-y-3">
            {sorted.map(j => {
              const d = new Date(`${j.date}T00:00:00`);
              const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
              const isCurrent = j.date === viewDate;
              return (
                <button
                  key={j.id}
                  onClick={() => setViewDate(j.date)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isCurrent ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{j.mood || '\u{1F4DD}'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{weekday}, {label}</div>
                    <p className="text-xs text-gray-500 truncate">{j.content || 'No entry'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
