import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  KeyRound,
  FileCheck,
  Users,
  Play,
  Shuffle
} from 'lucide-react';
import { Footer } from '../components/Footer';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onOpenJoinModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenJoinModal }) => {
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const features = [
    {
      icon: Sparkles,
      title: 'AI Question Engine',
      description: 'Generate multi-choice, true/false, fill-in-blanks, and short answer questions tailored to any subject or topic within seconds.'
    },
    {
      icon: Clock,
      title: 'Per-Question Timers',
      description: 'Assign individual time limits to every question. Auto-locks answers and advances when time expires.'
    },
    {
      icon: Shuffle,
      title: 'Randomized Anti-Cheating',
      description: 'Seeded question ordering and option jumbling per student session prevents answer sharing and unauthorized copying.'
    },
    {
      icon: ShieldCheck,
      title: 'Live Admin Telemetry',
      description: 'Monitor students live in real-time as they attempt the exam. Track live question progress and current status.'
    },
    {
      icon: BarChart3,
      title: 'Deep Learning Analytics',
      description: 'Comprehensive analytics graphs detailing score distribution, question difficulty accuracy, and student performance metrics.'
    },
    {
      icon: Zap,
      title: 'Instant Shareable Links',
      description: 'Publish tests instantly and distribute unique shareable links to students without requiring complex student accounts.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Define Subject & Prompt',
      desc: 'Enter subject name, topic details, target difficulty, question count, and custom AI instructions.'
    },
    {
      step: '02',
      title: 'AI Synthesis & Preview',
      desc: 'Watch AI construct high-accuracy questions. Fine-tune prompts, assign per-question timers, or edit options.'
    },
    {
      step: '03',
      title: 'Publish & Share Link',
      desc: 'Generate a unique secure examination URL and share it with your students via email or LMS.'
    },
    {
      step: '04',
      title: 'Real-Time Monitoring & Telemetry',
      desc: 'Watch students join and attempt the exam live while automated real-time analytics score submissions.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/80">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-pulse">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Next-Generation AI Examination & Telemetry Platform</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Create Intelligent Tests in <br />
            <span className="gradient-text">Seconds with AI</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
            Empower your curriculum with automated AI question generation, per-question countdown timers, randomized anti-cheating protocols, and real-time live student telemetry monitoring.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
            <button
              onClick={() => onNavigate('create-test')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 group"
            >
              <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
              <span>Create Test with AI</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenJoinModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base transition-all flex items-center justify-center gap-3"
            >
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <span>Join Test with Code</span>
            </button>
          </div>

          {/* Quick Join Code Input Pill */}
          <div className="max-w-md mx-auto p-2 glass-card rounded-2xl border border-slate-800 flex items-center gap-2 shadow-2xl">
            <input
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              placeholder="Enter Test ID (e.g. test_demo_101)"
              className="w-full px-4 py-2 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => {
                if (joinCodeInput.trim()) {
                  onNavigate(`test/${joinCodeInput.trim()}`);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs whitespace-nowrap transition-all shadow-md"
            >
              Start Exam
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO PREVIEW CARD */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Live System Preview
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">Data Structures & Algorithms - AI Quiz</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Exam Room Active
                </div>
              </div>
            </div>

            {/* Mock Question Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-400">Question 1 of 5 (MCQ)</span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                      Timer: 35s Remaining
                    </span>
                  </div>
                  <p className="text-base font-semibold text-white mb-4">
                    What is the primary time complexity of push and pop operations in a Stack implementation?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'].map((opt, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                          idx === 0 ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' : 'bg-slate-800/50 border-slate-700 text-slate-300'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mock Telemetry Sidebar */}
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Telemetry Monitor</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 rounded bg-slate-800/40">
                      <span className="text-slate-300">Alex Johnson</span>
                      <span className="text-emerald-400 font-medium">Attempting (Q3)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-800/40">
                      <span className="text-slate-300">Maria Garcia</span>
                      <span className="text-indigo-400 font-medium">Completed (86%)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-800/40">
                      <span className="text-slate-300">David Smith</span>
                      <span className="text-amber-400 font-medium">Joined</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Engineered for Modern Ed-Tech Platform Needs
          </h2>
          <p className="text-base text-slate-400">
            From automated AI test generation to live telemetry student monitoring, every feature is tailored for effortless examination management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="glass-card p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">How It Works</h2>
            <p className="text-sm text-slate-400">Four straightforward steps to publish AI-driven tests</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <span className="text-4xl font-extrabold font-mono text-indigo-500/30 mb-2 block">{s.step}</span>
                <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 max-w-5xl mx-auto px-4 text-center">
        <div className="glass-card p-12 rounded-3xl border border-indigo-500/30 glow-indigo">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Generate Your First AI Exam?
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto mb-8">
            Create intelligent tests, customize question timers, and monitor student performance in real time.
          </p>
          <button
            onClick={() => onNavigate('create-test')}
            className="px-8 py-4 rounded-xl gradient-bg-primary hover:opacity-95 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Launch Test Creator</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
