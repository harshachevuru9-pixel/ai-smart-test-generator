import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Activity, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeTestCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, activeTestCount = 0 }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-test', label: 'Create Test', icon: PlusCircle, badge: 'AI' },
    { id: 'my-tests', label: 'My Tests', icon: FileText },
    { id: 'live-monitor', label: 'Live Monitor', icon: Activity, badge: activeTestCount > 0 ? `${activeTestCount} Live` : undefined, badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'results-analytics', label: 'Results & Analytics', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4 hidden md:flex">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Instructor Portal
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Quick Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-800/40 relative overflow-hidden">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" /> AI Question Engine
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            Generate balanced multi-type quizzes with per-question timers automatically.
          </p>
          <button
            onClick={() => setActiveTab('create-test')}
            className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md"
          >
            Launch AI Generator
          </button>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
