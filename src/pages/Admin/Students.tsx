import React, { useState, useEffect } from 'react';
import { Users, Search, Award, CheckCircle2, XCircle } from 'lucide-react';
import { getAdminTests, getTestAnalytics } from '../../services/api';
import { StudentAttempt } from '../../types';

export const Students: React.FC = () => {
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminTests().then(tests => {
      const promises = tests.map(t => getTestAnalytics(t.id));
      Promise.all(promises).then(results => {
        const allAttempts = results.flatMap(r => r.studentAttempts);
        setAttempts(allAttempts);
      }).catch(console.error).finally(() => setLoading(false));
    });
  }, []);

  const filtered = attempts.filter(a =>
    a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Student Roster</h1>
          <p className="text-xs text-slate-400">Complete student attempt records and performance metrics.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or roll no..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No student records found.</td>
                </tr>
              ) : (
                filtered.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-900/60">
                    <td className="py-3.5 px-4 font-bold text-white">{att.studentName}</td>
                    <td className="py-3.5 px-4 font-mono text-indigo-300">{att.rollNumber}</td>
                    <td className="py-3.5 px-4 text-slate-400">{att.email || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        att.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">{att.score} / {att.totalMarks}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{att.percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
