import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Share2, 
  Activity, 
  BarChart2, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  ExternalLink, 
  PlusCircle, 
  Copy, 
  CheckCircle, 
  Clock,
  Sparkles
} from 'lucide-react';
import { getAdminTests, updateTest, deleteTest, getNetworkInfo } from '../../services/api';

import { Test } from '../../types';

interface MyTestsProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MyTests: React.FC<MyTestsProps> = ({ onNavigate }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = () => {
    setLoading(true);
    getAdminTests()
      .then(res => setTests(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (test: Test) => {
    const newStatus = test.status === 'published' ? 'disabled' : 'published';
    try {
      await updateTest(test.id, { status: newStatus });
      loadTests();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (testId: string) => {
    if (confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      try {
        await deleteTest(testId);
        loadTests();
      } catch (err) {
        alert('Failed to delete test');
      }
    }
  };

  const handleCopyLink = (testId: string) => {
    const shareUrl = `${window.location.origin}/test/${testId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(testId);
    setTimeout(() => setCopiedId(null), 2500);
  };




  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My AI Examinations</h1>
          <p className="text-xs text-slate-400">View, manage share links, launch live monitors, and evaluate results.</p>
        </div>

        <button
          onClick={() => onNavigate('create-test')}
          className="px-5 py-2.5 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Test</span>
        </button>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 animate-pulse">Loading tests...</div>
      ) : tests.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Examinations Created Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Use the AI Question Generator to create multi-format tests with per-question timers in seconds.
          </p>
          <button
            onClick={() => onNavigate('create-test')}
            className="px-6 py-3 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Generator</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test: any) => {
            const isPublished = test.status === 'published';
            return (
              <div key={test.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  
                  {/* Top Metadata Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {test.subject}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(test)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                        isPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isPublished ? '🟢 Active' : '⚪ Disabled'}
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white line-clamp-2">{test.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{test.description || test.topic}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <div>Questions: <span className="font-bold text-white">{test.questions?.length || 0}</span></div>
                    <div>Students: <span className="font-bold text-white">{test.studentCount || 0}</span></div>
                    <div>Timers: <span className="font-bold text-amber-300">{test.settings?.useQuestionTimers ? 'Per-Question' : 'Global'}</span></div>
                    <div>Views: <span className="font-bold text-indigo-300">{test.viewCount || 0}</span></div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(test.id)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-all flex items-center justify-center gap-1.5"
                    >
                      {copiedId === test.id ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                      <span>{copiedId === test.id ? 'Copied!' : 'Copy Link'}</span>
                    </button>

                    <button
                      onClick={() => window.open(`/test/${test.id}`, '_blank')}
                      title="Preview student entrance page"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onNavigate('live-monitor', { testId: test.id })}
                      className="py-2 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Live</span>
                    </button>

                    <button
                      onClick={() => onNavigate('results-analytics', { testId: test.id })}
                      className="py-2 px-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Results</span>
                    </button>

                    <button
                      onClick={() => handleDelete(test.id)}
                      className="py-2 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
