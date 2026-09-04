import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  FileText, 
  CheckSquare, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  User,
  KeyRound,
  Mail,
  ListFilter,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { getTestById, getAdminTests, startStudentAttempt } from '../../services/api';
import { Test, StudentAttempt } from '../../types';
import { Modal } from '../../components/Modal';

interface StudentAccessProps {
  testId: string;
  onStartExam: (attempt: StudentAttempt, test: Test) => void;
  onNavigateHome: () => void;
}

export const StudentAccess: React.FC<StudentAccessProps> = ({ testId, onStartExam, onNavigateHome }) => {
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [currentTestId, setCurrentTestId] = useState<string>(testId);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [starting, setStarting] = useState(false);

  // Fetch all tests to allow choosing any topic directly from start
  useEffect(() => {
    getAdminTests()
      .then(res => setAllTests(res))
      .catch(console.error);
  }, []);

  // Fetch target test whenever currentTestId changes
  useEffect(() => {
    if (!currentTestId) return;
    setLoading(true);
    setError('');
    getTestById(currentTestId)
      .then(res => setTest(res))
      .catch(err => setError(err.message || 'Test link invalid or inactive'))
      .finally(() => setLoading(false));
  }, [currentTestId]);

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Please check the confirmation box to agree to test instructions.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmStart = async () => {
    if (!test) return;
    setStarting(true);
    try {
      const res = await startStudentAttempt({
        testId: test.id,
        studentName,
        rollNumber,
        email
      });
      onStartExam(res.attempt, res.test);
    } catch (err: any) {
      alert(err.message || 'Failed to start examination session.');
    } finally {
      setStarting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950">
      <div className="max-w-2xl w-full glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* DIRECT TOPIC SELECTOR HEADER */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 space-y-3 glow-indigo">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <ListFilter className="w-4 h-4 text-purple-400" />
              <span>Select Examination Topic</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {allTests.length} Topics Available
            </span>
          </div>

          {/* Topic Dropdown Selector */}
          <div className="relative">
            <select
              value={currentTestId}
              onChange={(e) => setCurrentTestId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 text-sm font-bold text-white border border-indigo-500/30 focus:outline-none appearance-none cursor-pointer pr-10 shadow-lg"
            >
              {allTests.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white font-medium py-2">
                  📚 {t.subject} — {t.topic || t.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-indigo-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 animate-pulse font-mono text-sm">
            Loading examination details...
          </div>
        ) : error || !test ? (
          <div className="text-center py-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Examination Topic Unavailable</h2>
            <p className="text-xs text-slate-400">{error || 'The selected test link could not be found or has been disabled.'}</p>
            <button
              onClick={onNavigateHome}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
            >
              Return to Homepage
            </button>
          </div>
        ) : (
          <>
            {/* Entrance Header */}
            <div className="text-center space-y-2 border-b border-slate-800 pb-6">
              <div className="w-12 h-12 rounded-2xl gradient-bg-primary flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                <BrainCircuit className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {test.subject}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{test.title}</h1>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">{test.description || test.topic}</p>
            </div>

            {/* Test Parameters Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Questions</span>
                <span className="text-sm font-bold text-white">{test.questions.length} Questions</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timer Policy</span>
                <span className="text-sm font-bold text-amber-300">
                  {test.settings.useQuestionTimers ? 'Per-Question Timers' : `${test.settings.totalDuration || 15} Mins Global`}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Anti-Cheating</span>
                <span className="text-sm font-bold text-emerald-400">Randomized Questions</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
              <h3 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Exam Rules & Guidelines
              </h3>
              <p className="leading-relaxed text-[11px] text-slate-400">
                {test.instructions || 'Ensure you remain on this page during the examination. Answers auto-save after every question.'}
              </p>
            </div>

            {/* Student Data Form */}
            <form onSubmit={handleStartSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Roll Number / Student ID *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="e.g. CS2026-042"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@student.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-indigo-500 rounded cursor-pointer shrink-0"
                />
                <span className="text-slate-300">
                  I confirm that I have read and understood all examination rules and am ready to begin my test session for <strong className="text-white">{test.topic || test.title}</strong>.
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Test Session for {test.topic || test.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

      </div>

      {/* Confirmation Modal before launching test */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Examination Launch"
      >
        <div className="space-y-4 text-slate-300 text-xs">
          <p>
            You are about to launch your official test session for <strong className="text-white">{test?.title}</strong> as <strong className="text-indigo-300">{studentName} ({rollNumber})</strong>.
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            ⚠️ Once started, question timers will immediately begin counting down. Please do not close or refresh this browser tab.
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmStart}
              disabled={starting}
              className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-md"
            >
              {starting ? 'Initializing Session...' : 'Confirm & Launch Exam'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
