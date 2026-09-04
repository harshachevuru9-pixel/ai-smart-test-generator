import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Eye, 
  AlertTriangle,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { getAdminTests, getTestAnalytics } from '../../services/api';
import { Test, TestAnalytics, StudentAttempt } from '../../types';
import { Modal } from '../../components/Modal';

interface ResultsAnalyticsProps {
  initialTestId?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ResultsAnalytics: React.FC<ResultsAnalyticsProps> = ({ initialTestId, onNavigate }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>(initialTestId || '');
  const [analytics, setAnalytics] = useState<TestAnalytics | null>(null);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Student Drilldown Modal State
  const [selectedStudent, setSelectedStudent] = useState<StudentAttempt | null>(null);

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
    setLoading(true);
    getTestAnalytics(selectedTestId)
      .then(res => {
        setAnalytics(res.analytics);
        setActiveTest(res.test);
        setAttempts(res.studentAttempts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTestId]);

  const filteredAttempts = attempts.filter(a => 
    a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#6366f1', '#10b981'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Results & Telemetry Analytics</h1>
          <p className="text-xs text-slate-400">Deep performance analytics, score distribution, and individual student reports.</p>
        </div>

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

      {loading || !analytics ? (
        <div className="text-center py-16 text-slate-400 animate-pulse">Loading analytics...</div>
      ) : (
        <>
          {/* SUMMARY METRICS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-400">Evaluated Students</div>
              <div className="text-2xl font-extrabold text-white">{analytics.completedCount}</div>
              <div className="text-[10px] text-slate-500">Submissions scored</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 space-y-1">
              <div className="text-xs font-semibold text-emerald-400">Highest Score</div>
              <div className="text-2xl font-extrabold text-emerald-400">{analytics.highestScore} pts</div>
              <div className="text-[10px] text-slate-400">Top performance</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-400">Lowest Score</div>
              <div className="text-2xl font-extrabold text-white">{analytics.lowestScore} pts</div>
              <div className="text-[10px] text-slate-500">Minimum threshold</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-indigo-500/30 space-y-1">
              <div className="text-xs font-semibold text-indigo-300">Class Average</div>
              <div className="text-2xl font-extrabold text-indigo-300">{analytics.averageScore} pts</div>
              <div className="text-[10px] text-slate-400">Mean evaluation</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-purple-500/30 space-y-1">
              <div className="text-xs font-semibold text-purple-300">Pass Rate</div>
              <div className="text-2xl font-extrabold text-purple-300">{analytics.passPercentage}%</div>
              <div className="text-[10px] text-slate-400">Threshold: {activeTest?.settings.passingMarks || 60}%</div>
            </div>

          </div>

          {/* VISUAL CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Score Distribution Bar Chart */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Score Distribution Histogram</h3>
                <p className="text-xs text-slate-400">Count of students scoring within specific percentage buckets</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Question Accuracy vs Wrong Answers */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Question Accuracy Analysis</h3>
                <p className="text-xs text-slate-400">Correct vs Incorrect responses per question</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.questionStats.map((q, i) => ({ name: `Q${i+1}`, correct: q.correctCount, wrong: q.wrongCount }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="correct" fill="#10b981" stackId="a" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="wrong" fill="#ef4444" stackId="a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* STUDENT LEADERBOARD & DRILLDOWN TABLE */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Student Evaluation Roster</h3>
                <p className="text-xs text-slate-400">Click any student to inspect detailed response logs and time spent</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student or roll..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Score Earned</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Pass / Fail</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAttempts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">No completed student submissions found.</td>
                    </tr>
                  ) : (
                    filteredAttempts.map((att) => (
                      <tr 
                        key={att.id}
                        onClick={() => setSelectedStudent(att)}
                        className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-white">{att.studentName}</td>
                        <td className="py-3.5 px-4 font-mono text-indigo-300">{att.rollNumber}</td>
                        <td className="py-3.5 px-4 font-bold">{att.score} / {att.totalMarks}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{att.percentage}%</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            att.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {att.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(att);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium text-xs transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Report</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* STUDENT REPORT DRILLDOWN MODAL */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={`Student Report: ${selectedStudent?.studentName} (${selectedStudent?.rollNumber})`}
        maxWidth="max-w-3xl"
      >
        {selectedStudent && activeTest && (
          <div className="space-y-6">
            
            {/* Summary Header */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Total Score</span>
                <span className="text-lg font-bold text-white">{selectedStudent.score} / {selectedStudent.totalMarks}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Percentage</span>
                <span className="text-lg font-bold text-indigo-400">{selectedStudent.percentage}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Result Status</span>
                <span className={`text-sm font-bold ${selectedStudent.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedStudent.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Questions Answered</span>
                <span className="text-lg font-bold text-slate-200">{selectedStudent.answeredCount} Qs</span>
              </div>
            </div>

            {/* Answer Itemization */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Itemized Question Responses</h4>
              
              {activeTest.questions.map((q, idx) => {
                const ans = selectedStudent.answers[q.id];
                const isCorrect = ans?.isCorrect;
                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Q{idx + 1}: {q.question}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded bg-slate-950/60">
                        <span className="text-slate-500 block text-[10px]">Student Response:</span>
                        <span className="font-semibold text-slate-200">{ans?.selectedAnswer || 'No answer submitted'}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-950/60">
                        <span className="text-slate-500 block text-[10px]">Correct Key:</span>
                        <span className="font-semibold text-emerald-400">{q.correctAnswer}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic pt-1">
                      Explanation: {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};
