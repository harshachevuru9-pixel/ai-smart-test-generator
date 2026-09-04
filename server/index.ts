import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAIQuestions } from './aiService.js';
import { Test, Question, StudentAttempt, TestAnalytics, AdminUser } from '../src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// In-Memory Data Store with Persistence File
const DATA_FILE = path.join(__dirname, 'data_store.json');

interface LocalDB {
  admins: AdminUser[];
  tests: Record<string, Test>;
  attempts: Record<string, StudentAttempt>;
}

let db: LocalDB = {
  admins: [
    { id: 'admin_1', name: 'Dr. Sarah Connor', email: 'admin@test.com', role: 'admin' }
  ],
  tests: {},
  attempts: {}
};

// Seed initial sample test if empty
function loadDB() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      db = JSON.parse(data);
    } else {
      seedInitialSampleData();
    }
  } catch (err) {
    console.error('Error reading data store, using fresh seed:', err);
    seedInitialSampleData();
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error writing data store:', err);
  }
}

function seedInitialSampleData() {
  const sampleTestId = 'test_demo_101';
  db.tests[sampleTestId] = {
    id: sampleTestId,
    title: 'Data Structures & Algorithms Mastery Test',
    subject: 'Computer Science',
    topic: 'Stacks, Queues and Trees',
    description: 'Comprehensive evaluation covering stack/queue operations, circular queues, binary tree traversals, and time complexities.',
    instructions: 'Please ensure a stable internet connection. Each question has an individual timer. Once time expires, the answer is locked and auto-advanced.',
    createdAt: new Date().toISOString(),
    status: 'published',
    adminId: 'admin_1',
    viewCount: 14,
    uniqueLink: sampleTestId,
    settings: {
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
    },
    questions: [
      {
        id: 'q1',
        question: 'What is the primary time complexity of push and pop operations in a Stack?',
        questionType: 'mcq',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctAnswer: 'O(1)',
        explanation: 'Stack operates on LIFO principle, accessing top element directly in O(1) constant time.',
        difficulty: 'easy',
        marks: 2,
        timeLimit: 35
      },
      {
        id: 'q2',
        question: 'True or False: In a Queue, elements are inserted at the front and deleted from the rear.',
        questionType: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'In a Queue, elements are ENQUEUED at the rear and DEQUEUED from the front (FIFO).',
        difficulty: 'medium',
        marks: 2,
        timeLimit: 30
      },
      {
        id: 'q3',
        question: 'Which tree traversal visits the root node BEFORE its child subtrees?',
        questionType: 'mcq',
        options: ['Pre-order Traversal', 'In-order Traversal', 'Post-order Traversal', 'Level-order Traversal'],
        correctAnswer: 'Pre-order Traversal',
        explanation: 'Pre-order visits (Root -> Left -> Right). In-order visits (Left -> Root -> Right). Post-order visits (Left -> Right -> Root).',
        difficulty: 'medium',
        marks: 3,
        timeLimit: 45
      },
      {
        id: 'q4',
        question: 'A queue condition where rear reaches maximum size while front > 0 is fixed by using a _____ queue.',
        questionType: 'fill_in_blanks',
        correctAnswer: 'circular',
        explanation: 'Circular queues reuse dequeued spaces by wrapping pointers modulo array length.',
        difficulty: 'medium',
        marks: 3,
        timeLimit: 45
      },
      {
        id: 'q5',
        question: 'Explain why binary search tree lookup degrades to O(n) worst-case time complexity.',
        questionType: 'short_answer',
        correctAnswer: 'When the tree becomes completely unbalanced/skewed, behaving like a linked list.',
        explanation: 'If elements are inserted in sorted order, the BST becomes a single chain of height n.',
        difficulty: 'hard',
        marks: 5,
        timeLimit: 90
      }
    ]
  };

  // Seed sample student attempts
  const sampleAttempts = [
    {
      id: 'att_1',
      testId: sampleTestId,
      studentName: 'Alex Johnson',
      rollNumber: 'CS2024-001',
      email: 'alex@univ.edu',
      status: 'completed' as const,
      currentQuestionIndex: 4,
      answeredCount: 5,
      remainingSeconds: 0,
      score: 13,
      totalMarks: 15,
      percentage: 86.6,
      passed: true,
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      submittedAt: new Date(Date.now() - 3000000).toISOString(),
      answers: {
        'q1': { questionId: 'q1', selectedAnswer: 'O(1)', isCorrect: true, timeTaken: 12 },
        'q2': { questionId: 'q2', selectedAnswer: 'False', isCorrect: true, timeTaken: 18 },
        'q3': { questionId: 'q3', selectedAnswer: 'Pre-order Traversal', isCorrect: true, timeTaken: 25 },
        'q4': { questionId: 'q4', selectedAnswer: 'circular', isCorrect: true, timeTaken: 20 },
        'q5': { questionId: 'q5', selectedAnswer: 'Skews into linked list', isCorrect: true, timeTaken: 65 }
      }
    },
    {
      id: 'att_2',
      testId: sampleTestId,
      studentName: 'Maria Garcia',
      rollNumber: 'CS2024-042',
      email: 'maria@univ.edu',
      status: 'completed' as const,
      currentQuestionIndex: 4,
      answeredCount: 5,
      remainingSeconds: 0,
      score: 10,
      totalMarks: 15,
      percentage: 66.6,
      passed: true,
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      submittedAt: new Date(Date.now() - 1200000).toISOString(),
      answers: {
        'q1': { questionId: 'q1', selectedAnswer: 'O(1)', isCorrect: true, timeTaken: 10 },
        'q2': { questionId: 'q2', selectedAnswer: 'True', isCorrect: false, timeTaken: 22 },
        'q3': { questionId: 'q3', selectedAnswer: 'Pre-order Traversal', isCorrect: true, timeTaken: 30 },
        'q4': { questionId: 'q4', selectedAnswer: 'circular', isCorrect: true, timeTaken: 35 },
        'q5': { questionId: 'q5', selectedAnswer: 'When elements are small', isCorrect: false, timeTaken: 40 }
      }
    },
    {
      id: 'att_3',
      testId: sampleTestId,
      studentName: 'David Smith',
      rollNumber: 'CS2024-089',
      email: 'david@univ.edu',
      status: 'attempting' as const,
      currentQuestionIndex: 2,
      answeredCount: 2,
      remainingSeconds: 25,
      score: 5,
      totalMarks: 15,
      percentage: 33.3,
      startedAt: new Date(Date.now() - 300000).toISOString(),
      answers: {
        'q1': { questionId: 'q1', selectedAnswer: 'O(1)', isCorrect: true, timeTaken: 15 },
        'q2': { questionId: 'q2', selectedAnswer: 'False', isCorrect: true, timeTaken: 20 }
      }
    }
  ];

  sampleAttempts.forEach(att => {
    db.attempts[att.id] = att;
  });

  saveDB();
}

loadDB();

// Helper for shuffling arrays
function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// REST API ROUTES

// Admin Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const admin = db.admins.find(a => a.email === email);
  if (admin || email === 'admin@test.com' || password === 'admin123') {
    res.json({
      success: true,
      user: admin || { id: 'admin_1', name: 'Admin Instructor', email, role: 'admin' },
      token: 'jwt_token_admin_demo'
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  const existing = db.admins.find(a => a.email === email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  const newAdmin: AdminUser = {
    id: `admin_${Date.now()}`,
    name,
    email,
    role: 'admin'
  };
  db.admins.push(newAdmin);
  saveDB();
  res.json({ success: true, user: newAdmin, token: 'jwt_token_admin_demo' });
});

// AI Question Generation
app.post('/api/tests/generate-ai', async (req, res) => {
  try {
    const { subject, topic, description, instructions, count, difficulty, questionTypes } = req.body;
    const questions = await generateAIQuestions({
      subject: subject || 'General Knowledge',
      topic: topic || 'Overview',
      description: description || '',
      instructions: instructions || '',
      count: Number(count) || 5,
      difficulty: difficulty || 'mixed',
      questionTypes: questionTypes || ['mcq', 'true_false']
    });
    res.json({ success: true, questions });
  } catch (err: any) {
    console.error('Error generating AI questions:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to generate questions' });
  }
});

// Create/Publish Test
app.post('/api/tests', (req, res) => {
  const { title, subject, topic, description, instructions, questions, settings, adminId } = req.body;
  const testId = `test_${Date.now()}`;
  const uniqueLink = testId;

  const newTest: Test = {
    id: testId,
    title: title || `${subject} - ${topic}`,
    subject,
    topic,
    description,
    instructions,
    questions: questions || [],
    settings: settings || {
      useQuestionTimers: true,
      shuffleQuestions: true,
      shuffleOptions: true,
      allowNavigation: true,
      allowReview: true,
      enableInstantResult: true,
      passingMarks: 60,
      negativeMarking: 0,
      attemptsAllowed: 1
    },
    createdAt: new Date().toISOString(),
    status: 'published',
    adminId: adminId || 'admin_1',
    viewCount: 0,
    uniqueLink
  };

  db.tests[testId] = newTest;
  saveDB();
  res.json({ success: true, test: newTest });
});

// List Admin Tests
app.get('/api/tests', (req, res) => {
  const tests = Object.values(db.tests).map(t => {
    const attempts = Object.values(db.attempts).filter(a => a.testId === t.id);
    return {
      ...t,
      studentCount: attempts.length,
      activeCount: attempts.filter(a => a.status === 'attempting').length,
      completedCount: attempts.filter(a => a.status === 'completed').length
    };
  });
  res.json({ success: true, tests });
});

// Get Single Test by ID or Link
app.get('/api/tests/:id', (req, res) => {
  const { id } = req.params;
  const test = db.tests[id] || Object.values(db.tests).find(t => t.uniqueLink === id);

  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found' });
  }

  // Increment view count
  test.viewCount = (test.viewCount || 0) + 1;
  saveDB();

  res.json({ success: true, test });
});

// Update Test (status, settings, questions)
app.put('/api/tests/:id', (req, res) => {
  const { id } = req.params;
  const test = db.tests[id];

  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found' });
  }

  db.tests[id] = {
    ...test,
    ...req.body,
    settings: { ...test.settings, ...req.body.settings }
  };

  saveDB();
  res.json({ success: true, test: db.tests[id] });
});

// Delete Test
app.delete('/api/tests/:id', (req, res) => {
  const { id } = req.params;
  if (db.tests[id]) {
    delete db.tests[id];
    // clean up associated attempts
    Object.keys(db.attempts).forEach(attId => {
      if (db.attempts[attId].testId === id) {
        delete db.attempts[attId];
      }
    });
    saveDB();
    res.json({ success: true, message: 'Test deleted' });
  } else {
    res.status(404).json({ success: false, message: 'Test not found' });
  }
});

// Start Student Attempt
app.post('/api/attempts/start', (req, res) => {
  const { testId, studentName, rollNumber, email } = req.body;
  const test = db.tests[testId];

  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found or inactive' });
  }

  if (test.status !== 'published') {
    return res.status(403).json({ success: false, message: 'This test is currently disabled by administrator' });
  }

  // Generate randomized questions and options for this student session
  let questions = [...test.questions];
  let shuffledQuestionIds = questions.map(q => q.id);

  if (test.settings.shuffleQuestions) {
    questions = shuffleArray(questions);
    shuffledQuestionIds = questions.map(q => q.id);
  }

  const shuffledOptionsMap: Record<string, string[]> = {};
  if (test.settings.shuffleOptions) {
    questions.forEach(q => {
      if (q.options && q.options.length > 0) {
        shuffledOptionsMap[q.id] = shuffleArray(q.options);
      }
    });
  }

  const attemptId = `att_${Date.now()}_${Math.floor(Math.random()*1000)}`;
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

  const newAttempt: StudentAttempt = {
    id: attemptId,
    testId,
    studentName,
    rollNumber,
    email: email || '',
    status: 'attempting',
    currentQuestionIndex: 0,
    answeredCount: 0,
    remainingSeconds: questions[0]?.timeLimit || 60,
    score: 0,
    totalMarks,
    percentage: 0,
    startedAt: new Date().toISOString(),
    answers: {},
    shuffledQuestionIds,
    shuffledOptionsMap
  };

  db.attempts[attemptId] = newAttempt;
  saveDB();

  // Notify socket room
  io.to(`test_${testId}`).emit('live_monitor_update', {
    type: 'student_joined',
    attempt: newAttempt
  });

  res.json({ success: true, attempt: newAttempt, test });
});

// Save Answer In Real-Time
app.post('/api/attempts/:id/answer', (req, res) => {
  const { id } = req.params;
  const { questionId, selectedAnswer, timeTaken, currentQuestionIndex } = req.body;
  const attempt = db.attempts[id];

  if (!attempt) {
    return res.status(404).json({ success: false, message: 'Attempt not found' });
  }

  const test = db.tests[attempt.testId];
  const question = test?.questions.find(q => q.id === questionId);

  let isCorrect = false;
  if (question) {
    isCorrect = selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  }

  attempt.answers[questionId] = {
    questionId,
    selectedAnswer,
    isCorrect,
    timeTaken: timeTaken || 0
  };

  attempt.answeredCount = Object.keys(attempt.answers).length;
  if (typeof currentQuestionIndex === 'number') {
    attempt.currentQuestionIndex = currentQuestionIndex;
  }

  saveDB();

  // Socket notification to live admin monitor
  io.to(`test_${attempt.testId}`).emit('live_monitor_update', {
    type: 'student_progress',
    attemptId: id,
    studentName: attempt.studentName,
    rollNumber: attempt.rollNumber,
    currentQuestionIndex: attempt.currentQuestionIndex,
    answeredCount: attempt.answeredCount,
    status: attempt.status
  });

  res.json({ success: true, answeredCount: attempt.answeredCount });
});

// Submit Test Attempt
app.post('/api/attempts/:id/submit', (req, res) => {
  const { id } = req.params;
  const attempt = db.attempts[id];

  if (!attempt) {
    return res.status(404).json({ success: false, message: 'Attempt not found' });
  }

  const test = db.tests[attempt.testId];
  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found' });
  }

  let totalEarned = 0;
  let totalPossible = 0;

  test.questions.forEach(q => {
    const marks = q.marks || 1;
    totalPossible += marks;
    const ans = attempt.answers[q.id];

    if (ans && ans.selectedAnswer) {
      const isCorrect = ans.selectedAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      ans.isCorrect = isCorrect;
      if (isCorrect) {
        totalEarned += marks;
      } else if (test.settings.negativeMarking > 0) {
        totalEarned -= test.settings.negativeMarking;
      }
    }
  });

  totalEarned = Math.max(0, totalEarned);
  const percentage = Math.round((totalEarned / (totalPossible || 1)) * 100);
  const passed = percentage >= (test.settings.passingMarks || 50);

  attempt.status = 'completed';
  attempt.score = totalEarned;
  attempt.totalMarks = totalPossible;
  attempt.percentage = percentage;
  attempt.passed = passed;
  attempt.submittedAt = new Date().toISOString();

  saveDB();

  // Socket notification to live admin monitor
  io.to(`test_${attempt.testId}`).emit('live_monitor_update', {
    type: 'student_submitted',
    attempt
  });

  res.json({
    success: true,
    attempt,
    enableInstantResult: test.settings.enableInstantResult,
    allowReview: test.settings.allowReview
  });
});

// Live Admin Monitor Endpoint
app.get('/api/tests/:id/live', (req, res) => {
  const { id } = req.params;
  const attempts = Object.values(db.attempts).filter(a => a.testId === id);
  res.json({
    success: true,
    attempts,
    summary: {
      totalJoined: attempts.length,
      attempting: attempts.filter(a => a.status === 'attempting').length,
      completed: attempts.filter(a => a.status === 'completed').length,
      joinedNotStarted: attempts.filter(a => a.status === 'joined').length
    }
  });
});

// Analytics Dashboard Endpoint
app.get('/api/tests/:id/analytics', (req, res) => {
  const { id } = req.params;
  const test = db.tests[id];

  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found' });
  }

  const attempts = Object.values(db.attempts).filter(a => a.testId === id);
  const completedAttempts = attempts.filter(a => a.status === 'completed');

  const totalStudents = attempts.length;
  const activeCount = attempts.filter(a => a.status === 'attempting').length;
  const completedCount = completedAttempts.length;
  const joinedCount = attempts.filter(a => a.status === 'joined').length;

  const scores = completedAttempts.map(a => a.score);
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10 : 0;

  const passedCount = completedAttempts.filter(a => a.passed).length;
  const passPercentage = completedAttempts.length > 0 ? Math.round((passedCount / completedAttempts.length) * 100) : 0;

  // Score distribution buckets: 0-20, 21-40, 41-60, 61-80, 81-100
  const distribution = [
    { range: '0-20%', count: 0 },
    { range: '21-40%', count: 0 },
    { range: '41-60%', count: 0 },
    { range: '61-80%', count: 0 },
    { range: '81-100%', count: 0 }
  ];

  completedAttempts.forEach(att => {
    const p = att.percentage;
    if (p <= 20) distribution[0].count++;
    else if (p <= 40) distribution[1].count++;
    else if (p <= 60) distribution[2].count++;
    else if (p <= 80) distribution[3].count++;
    else distribution[4].count++;
  });

  // Question stats breakdown
  const questionStats = test.questions.map(q => {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    let totalTime = 0;
    let answeredTimeCount = 0;

    completedAttempts.forEach(att => {
      const ans = att.answers[q.id];
      if (!ans || !ans.selectedAnswer) {
        unansweredCount++;
      } else if (ans.isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      if (ans && ans.timeTaken) {
        totalTime += ans.timeTaken;
        answeredTimeCount++;
      }
    });

    return {
      questionId: q.id,
      questionText: q.question,
      questionType: q.questionType,
      correctCount,
      wrongCount,
      unansweredCount,
      avgTimeSec: answeredTimeCount > 0 ? Math.round(totalTime / answeredTimeCount) : 0,
      difficulty: q.difficulty
    };
  });

  const analytics: TestAnalytics = {
    totalStudents,
    activeCount,
    completedCount,
    joinedCount,
    notStartedCount: totalStudents - activeCount - completedCount,
    highestScore,
    lowestScore,
    averageScore,
    passPercentage,
    scoreDistribution: distribution,
    questionStats
  };

  res.json({ success: true, analytics, test, studentAttempts: attempts });
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  socket.on('join_test_room', (testId: string) => {
    socket.join(`test_${testId}`);
  });

  socket.on('leave_test_room', (testId: string) => {
    socket.leave(`test_${testId}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`AI Smart Test Generator Backend running on http://localhost:${PORT}`);
});
