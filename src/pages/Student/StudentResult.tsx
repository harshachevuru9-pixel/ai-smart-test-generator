import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowLeft, 
  BrainCircuit, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { StudentAttempt, Test } from '../../types';

interface StudentResultProps {
  attempt: StudentAttempt;
  test?: Test;
  enableInstantResult: boolean;
  allowReview: boolean;
  onNavigateHome: () => void;
}

export const StudentResult: React.FC<StudentResultProps> = ({
  attempt,
  test,
  enableInstantResult,
  allowReview,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950">
      <div className="max-w-3xl w-full space-y-6">
        
        {/* Main Score Card */}
        <div className={`glass-card p-8 sm:p-10 rounded-3xl border text-center space-y-6 shadow-2xl ${
          attempt.passed ? 'border-emerald-500/40 glow-indigo' : 'border-rose-500/40'
        }`}>
          
          {/* Header Icon */}
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl ${
            attempt.passed ? 'gradient-bg-primary shadow-indigo-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            <Award className="w-10 h-10 text-white" />
          </div>

          <div>
            <span className={`text-xs font-mono uppercase px-3 py-1 rounded-full border ${
              attempt.passed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}>
              {attempt.passed ? 'Passed Evaluation' : 'Needs Improvement'}
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-3">Examination Submitted</h1>
            <p className="text-xs text-slate-300 mt-1">Student: {attempt.studentName} ({attempt.rollNumber})</p>
          </div>

          {/* Instant Result Numbers */}
          {enableInstantResult ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Earned Score</span>
                <span className="text-2xl font-extrabold text-white">{attempt.score} / {attempt.totalMarks}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Percentage</span>
                <span className="text-2xl font-extrabold text-indigo-400">{attempt.percentage}%</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Answered</span>
                <span className="text-2xl font-extrabold text-slate-200">{attempt.answeredCount} Qs</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Result Status</span>
                <span className={`text-xl font-extrabold ${attempt.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {attempt.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              Score visibility is restricted by the instructor. Your responses have been saved securely.
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={onNavigateHome}
              className="px-8 py-3 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homepage</span>
            </button>
          </div>
        </div>

        {/* QUESTION REVIEW WITH EXPLANATIONS */}
        {allowReview && test && (
          <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Itemized Question Review & Explanations
              </h3>
              <p className="text-xs text-slate-400">Review your selected answers alongside correct keys and AI explanations.</p>
            </div>

            <div className="space-y-4">
              {test.questions.map((q, idx) => {
                const ans = attempt.answers[q.id];
                const isCorrect = ans?.isCorrect;

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">Question {idx + 1}: {q.question}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">Your Answer:</span>
                        <span className="font-semibold text-slate-200">{ans?.selectedAnswer || 'Not answered'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">Correct Key:</span>
                        <span className="font-semibold text-emerald-400">{q.correctAnswer}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 italic">
                      <strong className="text-indigo-400 not-italic">Explanation: </strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
