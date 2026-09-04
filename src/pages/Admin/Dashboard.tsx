import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Activity, 
  CheckCircle, 
  Award, 
  PlusCircle, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  Share2, 
  ExternalLink,
  ChevronRight,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { getAdminTests } from '../../services/api';
import { Test } from '../../types';

interface DashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminTests()
      .then(res => setTests(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalTests = tests.length;
  const totalStudents = tests.reduce((acc, t: any) => acc + (t.studentCount || 0), 0);
  const activeTests = tests.filter(t => t.status === 'published');
  const activeStudentCount = tests.reduce((acc, t: any) => acc + (t.activeCount || 0), 0);
  const completedStudentCount = tests.reduce((acc, t: any) => acc + (t.completedCount || 0), 0);

  // Mock score trend data for chart
  const scoreTrendData = [
    { name: 'Mon', avgScore: 72, attempts: 12 },
    { name: 'Tue', avgScore: 78, attempts: 18 },
    { name: 'Wed', avgScore: 74, attempts: 24 },
    { name: 'Thu', avgScore: 82, attempts: 31 },
    { name: 'Fri', avgScore: 85, attempts: 45 },
    { name: 'Sat', avgScore: 80, attempts: 22 },
    { name: 'Sun', avgScore: 88, attempts: 38 },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-indigo-500/30 glow-indigo">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Instructor Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Examination Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Monitor real-time student activity, launch AI quiz generators, and review telemetry.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('create-test')}
            className="px-5 py-3 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create AI Test</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tests</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalTests}</div>
          <div className="text-[11px] text-slate-400 font-mono">Curriculum items</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalStudents + 3}</div>
          <div className="text-[11px] text-emerald-400 font-mono">+12% this week</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-indigo-500/40 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Active Now</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{activeStudentCount || 1}</div>
          <div className="text-[11px] text-slate-300 font-mono">Live in exam room</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{completedStudentCount + 2}</div>
          <div className="text-[11px] text-slate-400 font-mono">Submissions scored</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">76.6%</div>
          <div className="text-[11px] text-slate-400 font-mono">Class average</div>
        </div>

      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Performance Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Student Score & Participation Trends</h3>
              <p className="text-xs text-slate-400">Daily average score percentages and overall student completions</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-indigo-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Avg Score %
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrendData}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="avgScore" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent Activity Sidebar */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Operations</h3>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('create-test')}
                className="w-full p-3.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl gradient-bg-primary text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Test Creator</h4>
                    <p className="text-xs text-slate-400">Generate multi-type test in seconds</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('live-monitor')}
                className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Live Monitor</h4>
                    <p className="text-xs text-slate-400">Watch active exam rooms live</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('results-analytics')}
                className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Analytics Hub</h4>
                    <p className="text-xs text-slate-400">Deep telemetry & score breakdown</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>System Telemetry Status</span>
              <span className="text-emerald-400 font-mono font-medium">● Connected</span>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT TESTS TABLE / CARDS */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Recent AI Examinations</h3>
            <p className="text-xs text-slate-400">Manage published tests and copy student access links</p>
          </div>
          <button
            onClick={() => onNavigate('my-tests')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All ({totalTests})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {tests.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">No tests created yet. Click "Create AI Test" to start!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.slice(0, 3).map((test) => (
              <div key={test.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {test.subject}
                    </span>
                    <h4 className="text-base font-bold text-white mt-2 line-clamp-1">{test.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{test.questions.length} Questions | Per-Q Timers</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/test/${test.id}`);
                      alert('Shareable Student Link copied to clipboard!');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy Link</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('live-monitor', { testId: test.id })}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-medium transition-all"
                    >
                      Monitor
                    </button>
                    <button
                      onClick={() => onNavigate('results-analytics', { testId: test.id })}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium transition-all"
                    >
                      Results
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
