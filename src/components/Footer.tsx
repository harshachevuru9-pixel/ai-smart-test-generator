import React from 'react';
import { BrainCircuit, Sparkles, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span>AI Smart Test Generator</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering educators with artificial intelligence to generate curriculum-aligned examinations, enforce randomized anti-cheating timers, and deliver live telemetry analytics.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Platform</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#features" className="hover:text-indigo-400 transition-colors">AI Test Generator</a></li>
            <li><a href="#how-it-works" className="hover:text-indigo-400 transition-colors">Per-Question Timers</a></li>
            <li><a href="#benefits" className="hover:text-indigo-400 transition-colors">Live Telemetry Monitor</a></li>
            <li><a href="#analytics" className="hover:text-indigo-400 transition-colors">Real-Time Analytics</a></li>
          </ul>
        </div>

        {/* For Students */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">For Students</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><span className="cursor-pointer hover:text-indigo-400 transition-colors">Enter Test Code</span></li>
            <li><span className="cursor-pointer hover:text-indigo-400 transition-colors">Student Guidelines</span></li>
            <li><span className="cursor-pointer hover:text-indigo-400 transition-colors">Instant Score Verification</span></li>
            <li><span className="cursor-pointer hover:text-indigo-400 transition-colors">FAQ & Troubleshooting</span></li>
          </ul>
        </div>

        {/* System Specs */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Security & AI Standard</h4>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> 256-Bit Anti-Tamper Room
            </div>
            <p className="text-[11px] text-slate-400">
              Seeded question order and answer option jumbling ensures secure individual evaluations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© 2026 AI Smart Test Generator. All rights reserved.</p>
        <div className="flex items-center gap-1">
          <span>Engineered with precision for modern Educational Technology</span>
        </div>
      </div>
    </footer>
  );
};
