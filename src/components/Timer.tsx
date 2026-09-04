import React, { useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  secondsLeft: number;
  totalSeconds: number;
  onTimeExpired?: () => void;
  compact?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ secondsLeft, totalSeconds, onTimeExpired, compact = false }) => {
  const percentage = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
  const isUrgent = secondsLeft <= 10 && secondsLeft > 0;

  useEffect(() => {
    if (secondsLeft === 0 && onTimeExpired) {
      onTimeExpired();
    }
  }, [secondsLeft, onTimeExpired]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const getBarColor = () => {
    if (percentage > 50) return 'bg-emerald-500 shadow-emerald-500/30';
    if (percentage > 20) return 'bg-amber-500 shadow-amber-500/30';
    return 'bg-rose-500 shadow-rose-500/30';
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold ${
        isUrgent ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 timer-urgent' : 'bg-slate-800 text-slate-200 border-slate-700'
      }`}>
        <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400 animate-spin' : 'text-indigo-400'}`} />
        <span>{formatTime(secondsLeft)}</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isUrgent 
        ? 'bg-rose-950/40 border-rose-500/50 timer-urgent shadow-lg shadow-rose-900/30' 
        : 'bg-slate-900/80 border-slate-800'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-indigo-400'}`} />
          <span>Question Timer</span>
        </div>
        <div className={`font-mono text-lg font-extrabold flex items-center gap-1.5 ${
          isUrgent ? 'text-rose-400' : 'text-slate-100'
        }`}>
          {isUrgent && <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />}
          <span>{formatTime(secondsLeft)}</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div 
          className={`h-full rounded-full transition-all duration-300 shadow-md ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isUrgent && (
        <p className="text-[11px] text-rose-300 font-medium mt-1.5 text-right animate-pulse">
          Time is running low! Answer will auto-lock soon.
        </p>
      )}
    </div>
  );
};
