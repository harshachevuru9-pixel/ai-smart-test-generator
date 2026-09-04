import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Modal } from './components/Modal';
import { LandingPage } from './pages/LandingPage';
import { AdminLogin } from './pages/Auth/AdminLogin';
import { AdminSignup } from './pages/Auth/AdminSignup';
import { Dashboard } from './pages/Admin/Dashboard';
import { CreateTest } from './pages/Admin/CreateTest';
import { MyTests } from './pages/Admin/MyTests';
import { LiveMonitor } from './pages/Admin/LiveMonitor';
import { ResultsAnalytics } from './pages/Admin/ResultsAnalytics';
import { Students } from './pages/Admin/Students';
import { Settings } from './pages/Admin/Settings';
import { StudentAccess } from './pages/Student/StudentAccess';
import { TestInterface } from './pages/Student/TestInterface';
import { StudentResult } from './pages/Student/StudentResult';
import { StudentAttempt, Test } from './types';
import { KeyRound } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  
  // Page Routing State
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [routeParams, setRouteParams] = useState<any>({});

  // Student Examination Flow State
  const [activeStudentAttempt, setActiveStudentAttempt] = useState<StudentAttempt | null>(null);
  const [activeStudentTest, setActiveStudentTest] = useState<Test | null>(null);
  const [examResultData, setExamResultData] = useState<{ attempt: StudentAttempt; enableInstantResult: boolean; allowReview: boolean } | null>(null);

  // Student Quick Join Modal State
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [testCodeInput, setTestCodeInput] = useState('');

  // Handle direct URL path e.g. /test/test_demo_101
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/test/')) {
      const id = path.replace('/test/', '').trim();
      if (id) {
        navigate(`test/${id}`);
      }
    }
  }, []);

  const navigate = (page: string, params?: any) => {
    setActiveTab(page);
    setRouteParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = (attempt: StudentAttempt, test: Test) => {
    setActiveStudentAttempt(attempt);
    setActiveStudentTest(test);
    setActiveTab('exam-room');
  };

  const handleExamSubmitted = (resultData: { attempt: StudentAttempt; enableInstantResult: boolean; allowReview: boolean }) => {
    setExamResultData(resultData);
    setActiveTab('exam-results');
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (testCodeInput.trim()) {
      const id = testCodeInput.trim();
      setIsJoinModalOpen(false);
      setTestCodeInput('');
      navigate(`test/${id}`);
    }
  };

  // Render Student Direct Access Test Page
  if (activeTab.startsWith('test/')) {
    const testId = activeTab.replace('test/', '');
    return (
      <StudentAccess 
        testId={testId}
        onStartExam={handleStartExam}
        onNavigateHome={() => navigate('landing')}
      />
    );
  }

  // Render Active Student Exam Room
  if (activeTab === 'exam-room' && activeStudentAttempt && activeStudentTest) {
    return (
      <TestInterface 
        initialAttempt={activeStudentAttempt}
        test={activeStudentTest}
        onSubmitted={handleExamSubmitted}
      />
    );
  }

  // Render Student Exam Score Results Page
  if (activeTab === 'exam-results' && examResultData) {
    return (
      <StudentResult
        attempt={examResultData.attempt}
        test={activeStudentTest || undefined}
        enableInstantResult={examResultData.enableInstantResult}
        allowReview={examResultData.allowReview}
        onNavigateHome={() => navigate('landing')}
      />
    );
  }

  const isAdminTab = ['dashboard', 'create-test', 'my-tests', 'live-monitor', 'results-analytics', 'students', 'settings'].includes(activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={navigate} 
        onOpenJoinModal={() => setIsJoinModalOpen(true)} 
      />

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Sidebar for Admin Navigation */}
        {user && isAdminTab && (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={navigate} 
            activeTestCount={1}
          />
        )}

        {/* Dynamic Page Component View */}
        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'landing' && (
            <LandingPage 
              onNavigate={navigate} 
              onOpenJoinModal={() => setIsJoinModalOpen(true)} 
            />
          )}

          {activeTab === 'login' && <AdminLogin onNavigate={navigate} />}
          {activeTab === 'signup' && <AdminSignup onNavigate={navigate} />}

          {/* Admin Protected Views */}
          {activeTab === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {activeTab === 'create-test' && <CreateTest onNavigate={navigate} />}
          {activeTab === 'my-tests' && <MyTests onNavigate={navigate} />}
          {activeTab === 'live-monitor' && (
            <LiveMonitor 
              initialTestId={routeParams.testId} 
              onNavigate={navigate} 
            />
          )}
          {activeTab === 'results-analytics' && (
            <ResultsAnalytics 
              initialTestId={routeParams.testId} 
              onNavigate={navigate} 
            />
          )}
          {activeTab === 'students' && <Students />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>

      {/* Student Join Code Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Enter Shared Examination Code"
      >
        <form onSubmit={handleJoinByCode} className="space-y-4">
          <p className="text-xs text-slate-300">
            Please enter the unique examination ID provided by your instructor or teacher to access your test room.
          </p>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Test Code / ID
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={testCodeInput}
                onChange={(e) => setTestCodeInput(e.target.value)}
                placeholder="e.g. test_demo_101"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-md"
            >
              Enter Exam Room
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
