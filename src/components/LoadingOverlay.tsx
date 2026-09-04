import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Cpu, CheckCircle2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  topic?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, topic = 'Topic' }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    `Analyzing curriculum standards for "${topic}"...`,
    'Synthesizing intelligent distractor options...',
    'Balancing difficulty levels and question variance...',
    'Assigning calibrated marks and individual timers...',
    'Formatting high-accuracy explanations...'
  ];

  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % steps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading, steps.length]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-indigo-500/30 text-center shadow-2xl space-y-6">
        
        {/* Animated AI Icon Ring */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-purple-500/20 border-b-purple-500 animate-spin flex items-center justify-center" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
          <div className="w-14 h-14 rounded-2xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/40 animate-pulse">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Status Heading */}
        <div>
          <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-bounce" />
            AI Generating Questions
          </h3>
          <p className="text-xs text-indigo-300 font-mono mt-1">Powered by Neural Exam Intelligence</p>
        </div>

        {/* Dynamic Animated Steps List */}
        <div className="space-y-2 text-left bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          {steps.map((step, idx) => {
            const isDone = idx < stepIndex;
            const isCurrent = idx === stepIndex;
            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isCurrent ? 'text-indigo-300 font-semibold translate-x-1' : isDone ? 'text-slate-400' : 'text-slate-600 opacity-50'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Cpu className="w-4 h-4 text-indigo-400 animate-pulse shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 animate-pulse">
          Crafting precise questions with explanations. Please wait...
        </p>
      </div>
    </div>
  );
};
