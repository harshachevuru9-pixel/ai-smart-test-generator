import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  BrainCircuit, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  Send,
  HelpCircle
} from 'lucide-react';
import { saveStudentAnswer, submitStudentTest } from '../../services/api';
import { Test, Question, StudentAttempt } from '../../types';
import { Timer } from '../../components/Timer';
import { Modal } from '../../components/Modal';

interface TestInterfaceProps {
  initialAttempt: StudentAttempt;
  test: Test;
  onSubmitted: (resultData: { attempt: StudentAttempt; enableInstantResult: boolean; allowReview: boolean }) => void;
}

export const TestInterface: React.FC<TestInterfaceProps> = ({ initialAttempt, test, onSubmitted }) => {
  const [attempt, setAttempt] = useState<StudentAttempt>(initialAttempt);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Answers map state: questionId -> selected string
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  
  // Locked questions map (when time hits 0)
  const [lockedQuestions, setLockedQuestions] = useState<Record<string, boolean>>({});

  // Question Ordering (shuffled or default)
  const orderedQuestions: Question[] = React.useMemo(() => {
    if (attempt.shuffledQuestionIds && attempt.shuffledQuestionIds.length > 0) {
      return attempt.shuffledQuestionIds
        .map(id => test.questions.find(q => q.id === id))
        .filter(Boolean) as Question[];
    }
    return test.questions;
  }, [attempt, test.questions]);

  const currentQuestion = orderedQuestions[currentIndex];

  // Per-question timer countdown state
  const [secondsLeft, setSecondsLeft] = useState<number>(currentQuestion?.timeLimit || 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Timer effect per question
  useEffect(() => {
    if (!currentQuestion) return;
    setSecondsLeft(currentQuestion.timeLimit || 60);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpired(currentQuestion.id);
          return 0;
        }
        return prev - 1;
      });

      setQuestionTimes(prev => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, currentQuestion?.id]);

  const handleTimeExpired = (qId: string) => {
    // Lock this question
    setLockedQuestions(prev => ({ ...prev, [qId]: true }));

    // Auto save current selection
    const selected = answersMap[qId] || '';
    saveAnswerToServer(qId, selected);

    // Auto advance to next question if available
    if (currentIndex < orderedQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleOptionSelect = (selectedAnswer: string) => {
    if (!currentQuestion || lockedQuestions[currentQuestion.id]) return;

    setAnswersMap(prev => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer
    }));

    // Save choice to server immediately
    saveAnswerToServer(currentQuestion.id, selectedAnswer);
  };

  const saveAnswerToServer = (qId: string, answerText: string) => {
    saveStudentAnswer({
      attemptId: attempt.id,
      questionId: qId,
      selectedAnswer: answerText,
      timeTaken: questionTimes[qId] || 0,
      currentQuestionIndex: currentIndex
    }).catch(console.error);
  };

  const handleNext = () => {
    if (currentIndex < orderedQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (test.settings.allowNavigation && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await submitStudentTest(attempt.id);
      onSubmitted(res);
    } catch (err: any) {
      alert(err.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  const isCurrentLocked = currentQuestion ? !!lockedQuestions[currentQuestion.id] : false;
  const answeredCount = Object.keys(answersMap).filter(k => answersMap[k]?.trim()).length;
  const progressPercentage = Math.round(((currentIndex + 1) / orderedQuestions.length) * 100);

  // Get shuffled options for current question if shuffleOptions is enabled
  const getDisplayOptions = (q: Question) => {
    if (attempt.shuffledOptionsMap && attempt.shuffledOptionsMap[q.id]) {
      return attempt.shuffledOptionsMap[q.id];
    }
    return q.options || [];
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* DISTRACTION-FREE TOPBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">{test.title}</h2>
            <p className="text-[11px] text-slate-400 font-mono">Student: {attempt.studentName} ({attempt.rollNumber})</p>
          </div>
        </div>

        {/* Question Counter & Timer */}
        <div className="flex items-center gap-3">
          {test.settings.useQuestionTimers && currentQuestion && (
            <Timer 
              secondsLeft={secondsLeft} 
              totalSeconds={currentQuestion.timeLimit || 60} 
              compact={true} 
            />
          )}

          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-2 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* OVERALL PROGRESS BAR */}
      <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* MAIN EXAMINATION CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* QUESTION PANEL (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          {currentQuestion && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
              
              {/* Question Header & Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg gradient-bg-primary text-white text-xs font-extrabold">
                    Question {currentIndex + 1} of {orderedQuestions.length}
                  </span>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {currentQuestion.questionType.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    [{currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}]
                  </span>
                </div>

                {/* Per-Question Radial Timer Card */}
                {test.settings.useQuestionTimers && (
                  <div className="w-full sm:w-64">
                    <Timer secondsLeft={secondsLeft} totalSeconds={currentQuestion.timeLimit || 60} />
                  </div>
                )}
              </div>

              {/* Locked Notice */}
              {isCurrentLocked && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-medium">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>Time limit for this question has expired. Answer choices are locked.</span>
                </div>
              )}

              {/* Question Text Prompt */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* MCQ & True/False Options Renderer */}
              {(currentQuestion.questionType === 'mcq' || currentQuestion.questionType === 'true_false') && (
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {getDisplayOptions(currentQuestion).map((option, optIdx) => {
                    const isSelected = answersMap[currentQuestion.id] === option;
                    return (
                      <button
                        key={optIdx}
                        disabled={isCurrentLocked}
                        onClick={() => handleOptionSelect(option)}
                        className={`p-4 rounded-2xl text-left border text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-100 shadow-md shadow-indigo-600/20'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                        } ${isCurrentLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                            isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Fill in the Blanks Input */}
              {currentQuestion.questionType === 'fill_in_blanks' && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Enter Your Blank Answer
                  </label>
                  <input
                    type="text"
                    disabled={isCurrentLocked}
                    value={answersMap[currentQuestion.id] || ''}
                    onChange={(e) => handleOptionSelect(e.target.value)}
                    placeholder="Type answer string..."
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Short Answer Textarea */}
              {currentQuestion.questionType === 'short_answer' && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Enter Explanation / Answer
                  </label>
                  <textarea
                    rows={4}
                    disabled={isCurrentLocked}
                    value={answersMap[currentQuestion.id] || ''}
                    onChange={(e) => handleOptionSelect(e.target.value)}
                    placeholder="Type your explanation..."
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Bottom Question Controls */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                {test.settings.allowNavigation ? (
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      currentIndex === 0 ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Question</span>
                  </button>
                ) : <div />}

                {currentIndex < orderedQuestions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Exam</span>
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

        {/* QUESTION PALETTE PANEL (1 Column) */}
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Palette</h4>
            
            {/* Grid of Question Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {orderedQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answersMap[q.id]?.trim();
                const isLocked = !!lockedQuestions[q.id];

                let btnStyle = 'bg-slate-900 text-slate-400 border-slate-800';
                if (isCurrent) {
                  btnStyle = 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-500/40';
                } else if (isAnswered) {
                  btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                } else if (isLocked) {
                  btnStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                }

                return (
                  <button
                    key={q.id}
                    disabled={!test.settings.allowNavigation && idx !== currentIndex}
                    onClick={() => test.settings.allowNavigation && setCurrentIndex(idx)}
                    className={`h-10 rounded-xl font-mono text-xs font-bold border transition-all flex items-center justify-center ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500" />
                <span>Time Expired / Locked</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* FINAL SUBMISSION CONFIRMATION MODAL */}
      <Modal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        title="Confirm Exam Submission"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <p>
            You are submitting your responses for <strong className="text-white">{test.title}</strong>.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span>Total Questions:</span>
              <strong className="text-white">{orderedQuestions.length}</strong>
            </div>
            <div className="flex justify-between">
              <span>Questions Answered:</span>
              <strong className="text-emerald-400">{answeredCount}</strong>
            </div>
            <div className="flex justify-between">
              <span>Unanswered:</span>
              <strong className="text-amber-400">{orderedQuestions.length - answeredCount}</strong>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowSubmitConfirm(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
            >
              Return to Exam
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-md"
            >
              {submitting ? 'Submitting Responses...' : 'Confirm Final Submission'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
