import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Clock, 
  Settings, 
  Trash2, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  Copy, 
  Share2, 
  ArrowRight, 
  ArrowLeft,
  Sliders,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { generateAIQuestions, createTest, getNetworkInfo } from '../../services/api';

import { Question, QuestionType, DifficultyLevel, TestSettings } from '../../types';
import { LoadingOverlay } from '../../components/LoadingOverlay';

interface CreateTestProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CreateTest: React.FC<CreateTestProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Form State
  const [subject, setSubject] = useState<string>('Computer Science');
  const [topic, setTopic] = useState<string>('Data Structures - Stack & Queue');
  const [description, setDescription] = useState<string>('Covering push/pop operations, LIFO vs FIFO principles, circular queues, and worst-case time complexities.');
  const [instructions, setInstructions] = useState<string>('Generate questions covering practical applications, core algorithms, edge cases, and code output analysis.');
  const [count, setCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('mixed');
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['mcq', 'true_false', 'fill_in_blanks', 'short_answer']);

  // Questions State
  const [questions, setQuestions] = useState<Question[]>([]);

  // Test Settings State
  const [settings, setSettings] = useState<TestSettings>({
    useQuestionTimers: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    allowNavigation: true,
    allowReview: true,
    enableInstantResult: true,
    passingMarks: 60,
    negativeMarking: 0,
    attemptsAllowed: 1,
    totalDuration: 15
  });

  // Published Link State
  const [publishedTestId, setPublishedTestId] = useState<string>('');
  const [publishedUrl, setPublishedUrl] = useState<string>('');
  const [networkUrl, setNetworkUrl] = useState<string>('');

  const toggleType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateAIQuestions({
        subject,
        topic,
        description,
        instructions,
        count,
        difficulty,
        questionTypes: selectedTypes
      });
      setQuestions(generated);
      setStep(3); // Move to Preview & Edit
    } catch (err: any) {
      alert(err.message || 'Failed to generate AI questions');
    } finally {
      setIsGenerating(false);
    }
  };

  // Question editing handlers
  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('A test must contain at least one question.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleRegenerateSingle = async (index: number) => {
    try {
      const single = await generateAIQuestions({
        subject,
        topic,
        description: `Regenerate question ${index + 1} with fresh prompt`,
        instructions,
        count: 1,
        difficulty,
        questionTypes: selectedTypes
      });
      if (single.length > 0) {
        const updated = [...questions];
        updated[index] = single[0];
        setQuestions(updated);
      }
    } catch (err) {
      alert('Failed to regenerate question.');
    }
  };

  const addManualQuestion = () => {
    const newQ: Question = {
      id: `q_manual_${Date.now()}`,
      question: 'Enter your new custom question prompt here...',
      questionType: 'mcq',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: 'Provide an explanation for the correct answer.',
      difficulty: 'medium',
      marks: 2,
      timeLimit: 45
    };
    setQuestions([...questions, newQ]);
  };

  const handlePublish = async () => {
    try {
      const test = await createTest({
        title: `${subject} - ${topic}`,
        subject,
        topic,
        description,
        instructions,
        questions,
        settings,
        adminId: 'admin_1'
      });

      const shareUrl = `${window.location.origin}/test/${test.id}`;
      setPublishedTestId(test.id);
      setPublishedUrl(shareUrl);
      setStep(5); // Move to Published Share Screen
    } catch (err: any) {
      alert(err.message || 'Failed to publish test');
    }
  };



  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      
      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isGenerating} topic={topic} />

      {/* Progress Steps Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Multi-Step AI Creator
            </div>
            <h1 className="text-2xl font-extrabold text-white">Create AI Smart Test</h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-semibold">
            {[1, 2, 3, 4, 5].map((sNum) => {
              const labels = ['Details', 'Rules', 'Preview & Edit', 'Settings', 'Publish'];
              const isActive = step === sNum;
              const isDone = step > sNum;
              return (
                <div key={sNum} className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                    isActive ? 'gradient-bg-primary text-white shadow-lg shadow-indigo-600/30 scale-105' : isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isDone ? '✓' : sNum}
                  </div>
                  <span className={`hidden sm:inline ${isActive ? 'text-indigo-300 font-bold' : isDone ? 'text-slate-400' : 'text-slate-600'}`}>
                    {labels[sNum - 1]}
                  </span>
                  {sNum < 5 && <span className="text-slate-700 mx-1">›</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 1: BASIC DETAILS */}
      {step === 1 && (
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Step 1: Test Topic & AI Instructions</h2>
            <p className="text-xs text-slate-400">Specify subject guidelines and detailed prompt instructions for the AI engine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Subject Name</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Topic Name</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Stack, Queue & Circular Queue"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Topic Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline specific concepts, formulas, code snippets, or real-world examples to cover..."
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Detailed AI Instructions</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Include questions on push/pop time complexities, circular queue condition formulas, and stack overflow causes."
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <span>Next: Question Rules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: QUESTION RULES & TYPE SELECTION */}
      {step === 2 && (
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Step 2: Question Rules & Formats</h2>
            <p className="text-xs text-slate-400">Configure question quantity, difficulty distribution, and multi-format types.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Number of Questions ({count})
              </label>
              <input
                type="range"
                min={3}
                max={25}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>3 Qs</span>
                <span>10 Qs</span>
                <span>25 Qs</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Difficulty Level</label>
              <div className="grid grid-cols-4 gap-2">
                {(['easy', 'medium', 'hard', 'mixed'] as DifficultyLevel[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      difficulty === diff ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Types */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Question Types (Select one or multiple)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'mcq', label: 'Multiple Choice (MCQ)' },
                { id: 'true_false', label: 'True / False' },
                { id: 'fill_in_blanks', label: 'Fill in the Blanks' },
                { id: 'short_answer', label: 'Short Answer' },
              ].map((t) => {
                const isSelected = selectedTypes.includes(t.id as QuestionType);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleType(t.id as QuestionType)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      isSelected ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/10' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{t.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleGenerateAI}
              className="px-8 py-3 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Generate Questions with AI</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: QUESTION PREVIEW & EDITING (WITH INDIVIDUAL TIMERS) */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Step 3: Preview & Fine-Tune Questions</h2>
              <p className="text-xs text-slate-400">Edit prompt texts, option choices, marks, and **per-question individual time limits**.</p>
            </div>

            <button
              onClick={addManualQuestion}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Manual Question</span>
            </button>
          </div>

          {/* List of Question Cards */}
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 relative">
                
                {/* Header Badge & Action Tools */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg gradient-bg-primary text-white text-xs font-bold flex items-center justify-center">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {q.questionType.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      q.difficulty === 'hard' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRegenerateSingle(idx)}
                      title="Regenerate this question using AI"
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-all flex items-center gap-1 text-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Regen AI</span>
                    </button>
                    <button
                      onClick={() => deleteQuestion(idx)}
                      title="Delete question"
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Question Prompt</label>
                  <textarea
                    rows={2}
                    value={q.question}
                    onChange={(e) => updateQuestion(idx, { question: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                  />
                </div>

                {/* MCQ Options Input */}
                {q.questionType === 'mcq' && q.options && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Answer Options</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-400 w-5">{String.fromCharCode(65 + optIdx)}:</span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...q.options!];
                              newOpts[optIdx] = e.target.value;
                              updateQuestion(idx, { options: newOpts });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg glass-input text-xs text-white focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Correct Answer & Explanation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Correct Answer</label>
                    <input
                      type="text"
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(idx, { correctAnswer: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-emerald-400 font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Marks Assigned</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={q.marks}
                      onChange={(e) => updateQuestion(idx, { marks: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* PER-QUESTION INDIVIDUAL TIMER INPUT */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-indigo-300 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> Individual Timer (Seconds)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={600}
                      value={q.timeLimit}
                      onChange={(e) => updateQuestion(idx, { timeLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-amber-300 font-mono font-bold focus:outline-none border-amber-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">AI Explanation</label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => updateQuestion(idx, { explanation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(4)}
              className="px-8 py-3 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <span>Next: Test Settings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: TEST SETTINGS & RULES */}
      {step === 4 && (
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Step 4: Examination Settings & Anti-Cheating</h2>
            <p className="text-xs text-slate-400">Configure timer policies, question randomization, passing scores, and feedback visibility.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Timer Policy */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" /> Timer Configuration
              </h3>
              
              <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded hover:bg-slate-800">
                <span className="text-slate-300">Enable Individual Per-Question Timers</span>
                <input
                  type="checkbox"
                  checked={settings.useQuestionTimers}
                  onChange={(e) => setSettings({ ...settings, useQuestionTimers: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </label>

              {!settings.useQuestionTimers && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Total Test Duration (Minutes)</label>
                  <input
                    type="number"
                    value={settings.totalDuration}
                    onChange={(e) => setSettings({ ...settings, totalDuration: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Randomization Policy */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" /> Anti-Cheating & Randomization
              </h3>
              
              <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded hover:bg-slate-800">
                <span className="text-slate-300">Shuffle Question Order for Each Student</span>
                <input
                  type="checkbox"
                  checked={settings.shuffleQuestions}
                  onChange={(e) => setSettings({ ...settings, shuffleQuestions: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded hover:bg-slate-800">
                <span className="text-slate-300">Shuffle Answer Choices (MCQ Options)</span>
                <input
                  type="checkbox"
                  checked={settings.shuffleOptions}
                  onChange={(e) => setSettings({ ...settings, shuffleOptions: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Feedback & Results */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Scoring & Results
              </h3>
              
              <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded hover:bg-slate-800">
                <span className="text-slate-300">Enable Instant Results on Submission</span>
                <input
                  type="checkbox"
                  checked={settings.enableInstantResult}
                  onChange={(e) => setSettings({ ...settings, enableInstantResult: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded hover:bg-slate-800">
                <span className="text-slate-300">Allow Question Review & AI Explanations</span>
                <input
                  type="checkbox"
                  checked={settings.allowReview}
                  onChange={(e) => setSettings({ ...settings, allowReview: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Passing Score & Marks */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" /> Passing Threshold
              </h3>
              
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Passing Mark Threshold (%)</label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={settings.passingMarks}
                  onChange={(e) => setSettings({ ...settings, passingMarks: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handlePublish}
              className="px-8 py-3 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Publish Test & Generate Share Link</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PUBLISHED SHAREABLE LINK */}
      {step === 5 && (
        <div className="glass-card p-10 rounded-3xl border border-indigo-500/40 text-center space-y-6 glow-indigo">
          <div className="w-16 h-16 rounded-3xl gradient-bg-primary flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/40 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Test Published Successfully
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">{subject} - {topic}</h2>
            <p className="text-sm text-slate-300 mt-1">Your AI test is live! Share the unique student examination URL below.</p>
          </div>

          {/* Share Box */}
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400 text-left flex items-center gap-1.5">
              <Share2 className="w-4 h-4" /> Public Shareable Examination Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publishedUrl}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 text-xs font-mono text-emerald-300 border border-emerald-500/30 focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publishedUrl);
                  alert('Public Shareable URL copied to clipboard!');
                }}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow-md transition-all flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Share Link</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-left">
              💡 Anyone can open this link from any device or network to attempt the exam.
            </p>
          </div>



          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('live-monitor', { testId: publishedTestId })}
              className="px-6 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all flex items-center gap-2"
            >
              <span>Open Live Telemetry Monitor</span>
            </button>

            <button
              onClick={() => onNavigate(`test/${publishedTestId}`)}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-2"
            >
              <span>Preview Exam as Student</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
