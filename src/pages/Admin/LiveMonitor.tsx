import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  RefreshCcw, 
  Search,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { getAdminTests, getLiveMonitorData } from '../../services/api';
import { joinTestRoom, leaveTestRoom, getSocket } from '../../services/socket';
import { Test, StudentAttempt } from '../../types';

interface LiveMonitorProps {
  initialTestId?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const LiveMonitor: React.FC<LiveMonitorProps> = ({ initialTestId, onNavigate }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>(initialTestId || '');
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [summary, setSummary] = useState({ totalJoined: 0, attempting: 0, completed: 0, joinedNotStarted: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    getAdminTests().then(res => {
      setTests(res);
      if (res.length > 0 && !selectedTestId) {
        setSelectedTestId(res[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedTestId) return;

    loadLiveData();

    // Socket Room Joining
    joinTestRoom(selectedTestId);
    const socket = getSocket();

    const handleUpdate = (data: any) => {
      // Refresh live data on socket event
      loadLiveData();
    };

    socket.on('live_monitor_update', handleUpdate);

    // Polling fallback every 4 seconds
    const interval = setInterval(() => {
      loadLiveData();
    }, 4000);

    return () => {
      leaveTestRoom(selectedTestId);
      socket.off('live_monitor_update', handleUpdate);
      clearInterval(interval);
    };
  }, [selectedTestId]);

  const loadLiveData = () => {
    if (!selectedTestId) return;
    getLiveMonitorData(selectedTestId)
      .then(res => {
        setAttempts(res.attempts);
        setSummary(res.summary);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const filteredAttempts = attempts.filter(a => 
    a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Test Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-emerald-500/30 glow-indigo">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-Time Telemetry Socket Active
          </div>
          <h1 className="text-2xl font-extrabold text-white">Live Student Telemetry Monitor</h1>
          <p className="text-xs text-slate-300">Watch active students attempt exams, track live question numbers, and receive instant score alerts.</p>
        </div>

        {/* Test Dropdown Selector */}
        <div className="w-full md:w-72">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Select Examination</label>
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
          >
            {tests.map(t => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                {t.subject} - {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SUMMARY STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-semibold text-slate-400">Total Joined</div>
          <div className="text-2xl font-extrabold text-white">{summary.totalJoined}</div>
          <div className="text-[10px] text-slate-500">Students registered</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/40 space-y-1">
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Currently Attempting
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{summary.attempting}</div>
          <div className="text-[10px] text-slate-400">In exam room now</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-indigo-500/40 space-y-1">
          <div className="text-xs font-semibold text-indigo-300">Completed</div>
          <div className="text-2xl font-extrabold text-indigo-300">{summary.completed}</div>
          <div className="text-[10px] text-slate-400">Submitted & scored</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/40 space-y-1">
          <div className="text-xs font-semibold text-amber-300">Joined / Idle</div>
          <div className="text-2xl font-extrabold text-amber-300">{summary.joinedNotStarted}</div>
          <div className="text-[10px] text-slate-400">Waiting to start</div>
        </div>

      </div>

      {/* LIVE TABLE & SEARCH */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Live Student Session List
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or roll no..."
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll / Student ID</th>
                <th className="py-3 px-4">Live Status</th>
                <th className="py-3 px-4">Current Question</th>
                <th className="py-3 px-4">Answered</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 text-right">Started / Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAttempts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No active student sessions found for this examination yet.
                  </td>
                </tr>
              ) : (
                filteredAttempts.map((att) => {
                  const isAttempting = att.status === 'attempting';
                  const isCompleted = att.status === 'completed';
                  return (
                    <tr key={att.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{att.studentName}</td>
                      <td className="py-3.5 px-4 font-mono text-indigo-300">{att.rollNumber}</td>
                      
                      <td className="py-3.5 px-4">
                        {isAttempting ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Attempting
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                            Joined / Waiting
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {isCompleted ? 'Finished' : `Question ${att.currentQuestionIndex + 1}`}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {att.answeredCount} Qs
                      </td>

                      <td className="py-3.5 px-4 font-bold font-mono">
                        {isCompleted ? (
                          <span className={att.passed ? 'text-emerald-400' : 'text-rose-400'}>
                            {att.score} / {att.totalMarks} ({att.percentage}%)
                          </span>
                        ) : (
                          <span className="text-slate-500">In Progress</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                        {new Date(att.submittedAt || att.startedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
