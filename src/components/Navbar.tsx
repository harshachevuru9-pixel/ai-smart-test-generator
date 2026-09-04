import React from 'react';
import { Sparkles, BrainCircuit, LogOut, User, LayoutDashboard, PlusCircle, BarChart2, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenJoinModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenJoinModal }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab && setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-lg text-white tracking-tight">
              AI Smart Test <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" /> v2.5
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Intelligent Exam Platform</p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Join Test Button (For Students) */}
          <button
            onClick={onOpenJoinModal}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-medium transition-all flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Join Test</span>
          </button>

          {/* Admin Navigation */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 pl-3 border-l border-slate-800">
              <button
                onClick={() => setActiveTab && setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'dashboard' ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span className="hidden md:inline">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab && setActiveTab('create-test')}
                className="px-3.5 py-1.5 rounded-lg gradient-bg-primary hover:opacity-90 text-white text-sm font-medium shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Create Test</span>
              </button>

              {/* Admin Profile & Logout */}
              <div className="flex items-center gap-2 pl-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                  <span className="text-[10px] text-indigo-400 font-mono">Instructor</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab && setActiveTab('login')}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                Admin Login
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('signup')}
                className="px-3.5 py-1.5 rounded-lg gradient-bg-primary text-white text-sm font-medium shadow-md shadow-indigo-600/20 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
