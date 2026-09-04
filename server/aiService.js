export async function generateAIQuestions(options) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      return await generateWithGeminiAPI(options, apiKey);
    } catch (err) {
      console.warn('Gemini API call failed, using Smart AI Generator engine:', err);
    }
  }

  return generateSmartFallbackQuestions(options);
}

async function generateWithGeminiAPI(options, apiKey) {
  const prompt = `
You are an expert educational test author. Generate ${options.count} high-quality examination questions.

Subject: ${options.subject}
Topic: ${options.topic}
Topic Details: ${options.description}
Special Instructions: ${options.instructions}
Target Difficulty: ${options.difficulty}
Allowed Question Types: ${options.questionTypes.join(', ')}

Strictly return a valid JSON array of objects without markdown formatting or code blocks:
[
  {
    "id": "q1",
    "question": "Question text here...",
    "questionType": "mcq" | "true_false" | "short_answer" | "fill_in_blanks",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact string of correct option or answer",
    "explanation": "Detailed explanation of why this answer is correct",
    "difficulty": "easy" | "medium" | "hard",
    "marks": 2,
    "timeLimit": 45
  }
]
`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Invalid Gemini API response');

  const questions = JSON.parse(text);
  return questions.map((q, idx) => ({
    ...q,
    id: `q_${Date.now()}_${idx + 1}`,
    marks: q.marks || (q.difficulty === 'hard' ? 4 : q.difficulty === 'medium' ? 3 : 2),
    timeLimit: q.timeLimit || (q.difficulty === 'hard' ? 90 : q.difficulty === 'medium' ? 60 : 45)
  }));
}

function generateSmartFallbackQuestions(options) {
  const { subject, topic, description, instructions, count, difficulty, questionTypes } = options;
  const questions = [];

  const effectiveTypes = questionTypes && questionTypes.length > 0 ? questionTypes : ['mcq', 'true_false', 'short_answer', 'fill_in_blanks'];
  
  const sampleBank = {
    'data structures': [
      {
        question: `What is the primary time complexity of push and pop operations in an array-based Stack implementation?`,
        type: 'mcq',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        answer: 'O(1)',
        explanation: 'Stack operations occur at the top pointer only, requiring constant time O(1) without shifting array elements.',
        difficulty: 'easy',
        timeLimit: 30
      },
      {
        question: `In a Queue data structure, elements are removed according to which policy?`,
        type: 'mcq',
        options: ['FIFO (First In First Out)', 'LIFO (Last In First Out)', 'Random Access', 'Priority Based'],
        answer: 'FIFO (First In First Out)',
        explanation: 'Queues process items in the order they arrive (First In First Out), similar to a line at a ticket counter.',
        difficulty: 'easy',
        timeLimit: 30
      },
      {
        question: `True or False: A Queue can be efficiently implemented using two Stacks.`,
        type: 'true_false',
        options: ['True', 'False'],
        answer: 'True',
        explanation: 'By transferring elements between an inbox stack and an outbox stack, enqueue and dequeue operations can be amortized to O(1).',
        difficulty: 'medium',
        timeLimit: 45
      },
      {
        question: `A stack overflow condition occurs when an operation attempts to push an item onto a stack that is _____.`,
        type: 'fill_in_blanks',
        answer: 'full',
        explanation: 'When the allocated array size or memory limit for the stack is exceeded, pushing causes a stack overflow error.',
        difficulty: 'medium',
        timeLimit: 45
      },
      {
        question: `Briefly describe how a Circular Queue avoids memory wasting compared to a simple Linear Queue.`,
        type: 'short_answer',
        answer: 'By wrapping the rear pointer to index 0 when it reaches capacity, reusing dequeued slots.',
        explanation: 'Circular queues use modular arithmetic (rear = (rear + 1) % size) to reuse empty slots created by previous dequeue operations.',
        difficulty: 'hard',
        timeLimit: 90
      }
    ],
    'default': [
      {
        question: `Which fundamental principle governs the core operation of ${topic} in ${subject}?`,
        type: 'mcq',
        options: [
          `Optimized systematic processing of ${topic}`,
          `Random non-deterministic iteration`,
          `Unstructured data traversal`,
          `Linear memory allocation only`
        ],
        answer: `Optimized systematic processing of ${topic}`,
        explanation: `In ${subject}, ${topic} relies on structured, algorithmic execution for predictable results.`,
        difficulty: 'easy',
        timeLimit: 40
      },
      {
        question: `True or False: ${topic} requires explicit verification of initial constraints before state mutation.`,
        type: 'true_false',
        options: ['True', 'False'],
        answer: 'True',
        explanation: `Validating pre-conditions guarantees system integrity and prevents boundary errors during ${topic} execution.`,
        difficulty: 'medium',
        timeLimit: 45
      },
      {
        question: `The main purpose of applying ${topic} within ${subject} is to enhance _____.`,
        type: 'fill_in_blanks',
        answer: 'performance',
        explanation: `Applying core ${topic} methodologies maximizes efficiency, accuracy, and operational throughput in ${subject}.`,
        difficulty: 'medium',
        timeLimit: 50
      },
      {
        question: `Explain the key trade-offs when implementing ${topic} under resource-constrained conditions.`,
        type: 'short_answer',
        answer: 'Balancing execution speed against memory footprint and implementation complexity.',
        explanation: `Optimizing for execution speed often increases memory utilization, requiring careful design choices depending on system constraints.`,
        difficulty: 'hard',
        timeLimit: 90
      }
    ]
  };

  const topicKey = (subject || '').toLowerCase().includes('data structure') || (topic || '').toLowerCase().includes('stack') ? 'data structures' : 'default';
  const templates = sampleBank[topicKey];

  for (let i = 0; i < count; i++) {
    const qType = effectiveTypes[i % effectiveTypes.length];
    const template = templates[i % templates.length];
    const itemDiff = difficulty === 'mixed' 
      ? (i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard') 
      : difficulty;

    if (qType === 'mcq' && template.type !== 'mcq') {
      questions.push({
        id: `q_${Date.now()}_${i + 1}`,
        question: `What is a fundamental characteristic of ${topic} regarding ${description || 'core concepts'}?`,
        questionType: 'mcq',
        options: [
          `Primary implementation mechanism of ${topic}`,
          `Legacy secondary pattern in ${subject}`,
          `Alternative non-standard approach`,
          `Deprecated legacy protocol`
        ],
        correctAnswer: `Primary implementation mechanism of ${topic}`,
        explanation: `The primary mechanism is specifically engineered for optimal handling of ${topic} in ${subject}.`,
        difficulty: itemDiff,
        marks: itemDiff === 'hard' ? 4 : itemDiff === 'medium' ? 3 : 2,
        timeLimit: itemDiff === 'hard' ? 90 : itemDiff === 'medium' ? 60 : 45
      });
    } else if (qType === 'true_false') {
      questions.push({
        id: `q_${Date.now()}_${i + 1}`,
        question: `True or False: In ${subject}, ${topic} guarantees deterministic behavior when given identical inputs.`,
        questionType: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: `Deterministic algorithms produce consistent outputs for uniform inputs under standard execution conditions.`,
        difficulty: itemDiff,
        marks: 2,
        timeLimit: 30
      });
    } else if (qType === 'fill_in_blanks') {
      questions.push({
        id: `q_${Date.now()}_${i + 1}`,
        question: `In ${subject}, the primary structure used to manage ${topic} is known as a _____.`,
        questionType: 'fill_in_blanks',
        correctAnswer: (topic || 'framework').split(' ')[0],
        explanation: `The component directly handles memory and logic operations for ${topic}.`,
        difficulty: itemDiff,
        marks: 3,
        timeLimit: 45
      });
    } else if (qType === 'short_answer') {
      questions.push({
        id: `q_${Date.now()}_${i + 1}`,
        question: `In 2-3 sentences, explain why ${topic} is essential when building scaleable applications in ${subject}.`,
        questionType: 'short_answer',
        correctAnswer: `It provides standardized structure, improves code readability, and ensures optimal resource management.`,
        explanation: `Clear architectural design in ${topic} prevents performance bottlenecks as data volume expands.`,
        difficulty: itemDiff,
        marks: 5,
        timeLimit: 120
      });
    } else {
      questions.push({
        id: `q_${Date.now()}_${i + 1}`,
        question: template.question,
        questionType: template.type,
        options: template.options,
        correctAnswer: template.answer,
        explanation: template.explanation,
        difficulty: itemDiff,
        marks: itemDiff === 'hard' ? 4 : itemDiff === 'medium' ? 3 : 2,
        timeLimit: template.timeLimit || 60
      });
    }
  }

  return questions;
}
