import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const MODES = {
  focus:      { label: 'Focus',       minutes: 25, color: 'from-red-500 to-orange-500' },
  shortBreak: { label: 'Short Break', minutes: 5,  color: 'from-green-400 to-teal-400' },
  longBreak:  { label: 'Long Break',  minutes: 15, color: 'from-blue-400 to-indigo-400' },
};

export default function FocusTimer({ focusStats, onUpdateStats }) {
  const [mode, setMode] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    } else if (secondsLeft === 0 && running) {
      setRunning(false);
      if (mode === 'focus') {
        onUpdateStats({
          totalSessions: (focusStats.totalSessions || 0) + 1,
          totalMinutes: (focusStats.totalMinutes || 0) + MODES.focus.minutes,
          lastSession: new Date().toISOString(),
        });
        try { new Audio('data:audio/wav;base64,UklGRl9vT19teleXRmbXQgEAAA...').play(); } catch (_) {}
        alert('Focus session complete! Take a break.');
      } else {
        alert('Break over! Ready for another focus session?');
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [running, secondsLeft]);

  const switchMode = (newMode) => {
    setRunning(false);
    setMode(newMode);
    setSecondsLeft(MODES[newMode].minutes * 60);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(MODES[mode].minutes * 60);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const total = MODES[mode].minutes * 60;
  const progress = ((total - secondsLeft) / total) * 100;

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Mode selector */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {Object.entries(MODES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === key ? 'bg-white shadow-md text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {key === 'focus' ? <Brain size={14} className="inline mr-1.5" /> : <Coffee size={14} className="inline mr-1.5" />}
            {label}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="relative flex items-center justify-center">
        <svg className="w-64 h-64 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            className="transition-all duration-1000"
            stroke="url(#timerGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mode === 'focus' ? '#ef4444' : mode === 'shortBreak' ? '#34d399' : '#60a5fa'} />
              <stop offset="100%" stopColor={mode === 'focus' ? '#f97316' : mode === 'shortBreak' ? '#2dd4bf' : '#818cf8'} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <div className="text-5xl font-bold text-gray-900 tabular-nums">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-500 mt-1">{MODES[mode].label}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Reset"
        >
          <RotateCcw size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => setRunning(!running)}
          className={`p-5 rounded-full text-white shadow-lg transition-all transform hover:scale-105 bg-gradient-to-r ${MODES[mode].color}`}
        >
          {running ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
        </button>
        <div className="w-12" />
      </div>

      {/* Stats */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Focus Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{focusStats.totalSessions || 0}</div>
            <div className="text-xs text-gray-500">Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{focusStats.totalMinutes || 0}</div>
            <div className="text-xs text-gray-500">Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {((focusStats.totalMinutes || 0) / 60).toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}
