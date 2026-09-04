import { Test, Question, StudentAttempt, TestAnalytics, AdminUser } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';



export async function adminLogin(email: string, password: string): Promise<{ user: AdminUser; token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Login failed');
  return data;
}

export async function adminSignup(name: string, email: string, password: string): Promise<{ user: AdminUser; token: string }> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Signup failed');
  return data;
}

export async function generateAIQuestions(params: {
  subject: string;
  topic: string;
  description: string;
  instructions: string;
  count: number;
  difficulty: string;
  questionTypes: string[];
}): Promise<Question[]> {
  const res = await fetch(`${API_BASE}/tests/generate-ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'AI generation failed');
  return data.questions;
}

export async function createTest(testData: Partial<Test>): Promise<Test> {
  const res = await fetch(`${API_BASE}/tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to publish test');
  return data.test;
}

export async function getAdminTests(): Promise<Test[]> {
  const res = await fetch(`${API_BASE}/tests`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch tests');
  return data.tests;
}

export async function getTestById(testId: string): Promise<Test> {
  const res = await fetch(`${API_BASE}/tests/${testId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Test not found');
  return data.test;
}

export async function updateTest(testId: string, updates: Partial<Test>): Promise<Test> {
  const res = await fetch(`${API_BASE}/tests/${testId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update test');
  return data.test;
}

export async function deleteTest(testId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tests/${testId}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to delete test');
}

export async function startStudentAttempt(params: {
  testId: string;
  studentName: string;
  rollNumber: string;
  email?: string;
}): Promise<{ attempt: StudentAttempt; test: Test }> {
  const res = await fetch(`${API_BASE}/attempts/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to start test');
  return data;
}

export async function saveStudentAnswer(params: {
  attemptId: string;
  questionId: string;
  selectedAnswer: string;
  timeTaken: number;
  currentQuestionIndex: number;
}): Promise<void> {
  await fetch(`${API_BASE}/attempts/${params.attemptId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}

export async function submitStudentTest(attemptId: string): Promise<{
  attempt: StudentAttempt;
  enableInstantResult: boolean;
  allowReview: boolean;
}> {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to submit test');
  return data;
}

export async function getLiveMonitorData(testId: string): Promise<{
  attempts: StudentAttempt[];
  summary: { totalJoined: number; attempting: number; completed: number; joinedNotStarted: number };
}> {
  const res = await fetch(`${API_BASE}/tests/${testId}/live`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch live monitoring data');
  return data;
}

export async function getTestAnalytics(testId: string): Promise<{
  analytics: TestAnalytics;
  test: Test;
  studentAttempts: StudentAttempt[];
}> {
  const res = await fetch(`${API_BASE}/tests/${testId}/analytics`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch test analytics');
  return data;
}

export async function getNetworkInfo(): Promise<{ localIp: string; frontendUrl: string; backendUrl: string }> {
  try {
    const res = await fetch(`${API_BASE}/network-info`);
    const data = await res.json();
    if (data.success) return data;
  } catch (e) {}
  const origin = window.location.origin;
  return {
    localIp: window.location.hostname,
    frontendUrl: origin,
    backendUrl: origin
  };
}



