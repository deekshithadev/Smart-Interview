// AI-powered interview system for Full Stack (React/Node) roles
import { generateQuestion, evaluateAnswer, generateSummary } from './aiService';

// Question templates for different difficulty levels
const QUESTION_TEMPLATES = {
  easy: [
    {
      category: 'JavaScript Basics',
      questions: [
        'What is the difference between let, const, and var in JavaScript?',
        'Explain what closures are in JavaScript.',
        'What is the difference between == and === in JavaScript?',
        'How do you declare a function in JavaScript?',
        'What is an arrow function and how does it differ from regular functions?'
      ]
    },
    {
      category: 'React Basics',
      questions: [
        'What is JSX and why do we use it?',
        'Explain the difference between functional and class components.',
        'What is state in React and how do you update it?',
        'What are props in React?',
        'What is the useEffect hook used for?'
      ]
    },
    {
      category: 'Node.js Basics',
      questions: [
        'What is Node.js and why is it useful?',
        'What is npm and what is it used for?',
        'Explain the difference between require() and import in Node.js.',
        'What is Express.js?',
        'What is middleware in Express.js?'
      ]
    }
  ],
  medium: [
    {
      category: 'React Intermediate',
      questions: [
        'Explain the React component lifecycle and useEffect dependencies.',
        'What is the Virtual DOM and how does React use it?',
        'How do you handle forms in React?',
        'What are React hooks and why are they useful?',
        'Explain the difference between controlled and uncontrolled components.'
      ]
    },
    {
      category: 'Node.js Intermediate',
      questions: [
        'How do you handle asynchronous operations in Node.js?',
        'What is the event loop in Node.js?',
        'How do you work with file system in Node.js?',
        'What are streams in Node.js?',
        'How do you handle errors in Node.js applications?'
      ]
    },
    {
      category: 'Database/API',
      questions: [
        'What is RESTful API design?',
        'How do you connect to a database in Node.js?',
        'What is authentication and authorization?',
        'How do you handle CORS in Node.js?',
        'What are the HTTP status codes and when to use them?'
      ]
    }
  ],
  hard: [
    {
      category: 'Advanced React',
      questions: [
        'Explain React context and when to use it.',
        'What are React portals and why are they useful?',
        'How do you optimize React application performance?',
        'What is React concurrent features?',
        'Explain React server components.'
      ]
    },
    {
      category: 'Advanced Node.js',
      questions: [
        'How do you implement clustering in Node.js?',
        'What is the difference between process.nextTick() and setImmediate()?',
        'How do you handle memory leaks in Node.js?',
        'What are worker threads in Node.js?',
        'How do you implement caching in Node.js applications?'
      ]
    },
    {
      category: 'System Design',
      questions: [
        'Design a URL shortener service.',
        'How would you design a chat application?',
        'Explain load balancing and scaling strategies.',
        'How do you design a real-time notification system?',
        'What are microservices and when to use them?'
      ]
    }
  ]
};

// Difficulty configuration
const DIFFICULTY_CONFIG = {
  easy: { timeLimit: 20, points: 1 },
  medium: { timeLimit: 60, points: 2 },
  hard: { timeLimit: 120, points: 3 }
};

// AI Interview Engine Class
export class AIInterviewEngine {
  constructor() {
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.answers = [];
    this.scores = [];
    this.difficulty = 'easy';
    this.difficultyStep = 0; // 0: easy, 1: medium, 2: hard
    this.isActive = false;
  }

  // Initialize interview with candidate profile
  async initializeInterview(candidateProfile) {
    this.candidateProfile = candidateProfile;
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.scores = [];
    this.isActive = true;

    // Generate first question
    const firstQuestion = await this.generateNextQuestion();
    return firstQuestion;
  }

  // Generate next question based on current difficulty
  async generateNextQuestion() {
    const difficulties = ['easy', 'medium', 'hard'];
    const currentDifficulty = difficulties[this.difficultyStep];

    // Select random category for current difficulty
    const categories = QUESTION_TEMPLATES[currentDifficulty];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Select random question from category
    const randomQuestion = randomCategory.questions[
      Math.floor(Math.random() * randomQuestion.questions.length)
    ];

    const question = {
      id: this.currentQuestionIndex + 1,
      text: randomQuestion,
      category: randomCategory.category,
      difficulty: currentDifficulty,
      timeLimit: DIFFICULTY_CONFIG[currentDifficulty].timeLimit,
      maxPoints: DIFFICULTY_CONFIG[currentDifficulty].points,
      askedAt: new Date().toISOString()
    };

    this.questions.push(question);
    return question;
  }

  // Submit answer and get AI evaluation
  async submitAnswer(answer) {
    const currentQuestion = this.questions[this.currentQuestionIndex];

    try {
      // Get AI evaluation
      const evaluation = await evaluateAnswer(
        currentQuestion.text,
        answer,
        currentQuestion.difficulty,
        this.candidateProfile
      );

      const answerRecord = {
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        answer: answer,
        evaluation: evaluation,
        score: evaluation.score,
        feedback: evaluation.feedback,
        submittedAt: new Date().toISOString(),
        timeSpent: Date.now() - new Date(currentQuestion.askedAt).getTime()
      };

      this.answers.push(answerRecord);
      this.scores.push(evaluation.score);

      return {
        evaluation,
        isCorrect: evaluation.score > 0.5,
        nextQuestion: null
      };

    } catch (error) {
      console.error('Error evaluating answer:', error);
      // Fallback evaluation
      const fallbackScore = answer.length > 50 ? 0.7 : 0.4;
      const fallbackEvaluation = {
        score: fallbackScore,
        feedback: 'Answer received. Evaluation service temporarily unavailable.',
        strengths: ['Provided a response'],
        improvements: ['Consider providing more detailed explanations']
      };

      const answerRecord = {
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        answer: answer,
        evaluation: fallbackEvaluation,
        score: fallbackScore,
        feedback: fallbackEvaluation.feedback,
        submittedAt: new Date().toISOString(),
        timeSpent: Date.now() - new Date(currentQuestion.askedAt).getTime()
      };

      this.answers.push(answerRecord);
      this.scores.push(fallbackScore);

      return {
        evaluation: fallbackEvaluation,
        isCorrect: fallbackScore > 0.5,
        nextQuestion: null
      };
    }
  }

  // Move to next question or difficulty level
  async nextQuestion() {
    this.currentQuestionIndex++;

    // Check if we need to move to next difficulty
    const questionsPerDifficulty = 2;
    if (this.currentQuestionIndex > 0 && this.currentQuestionIndex % questionsPerDifficulty === 0) {
      this.difficultyStep++;
    }

    // Check if interview is complete
    if (this.currentQuestionIndex >= 6) {
      return null; // Interview complete
    }

    // Generate next question
    const nextQuestion = await this.generateNextQuestion();
    return nextQuestion;
  }

  // Get interview progress
  getProgress() {
    return {
      currentQuestion: this.currentQuestionIndex + 1,
      totalQuestions: 6,
      currentDifficulty: ['easy', 'medium', 'hard'][this.difficultyStep],
      completedQuestions: this.answers.length,
      averageScore: this.scores.length > 0 ?
        this.scores.reduce((a, b) => a + b, 0) / this.scores.length : 0
    };
  }

  // Generate final summary
  async generateFinalSummary() {
    try {
      const summary = await generateSummary(
        this.questions,
        this.answers,
        this.candidateProfile
      );

      return {
        totalScore: this.scores.reduce((a, b) => a + b, 0),
        averageScore: this.scores.reduce((a, b) => a + b, 0) / this.scores.length,
        summary: summary,
        completedAt: new Date().toISOString(),
        totalQuestions: this.questions.length,
        difficultyBreakdown: {
          easy: this.scores.slice(0, 2).reduce((a, b) => a + b, 0) / 2,
          medium: this.scores.slice(2, 4).reduce((a, b) => a + b, 0) / 2,
          hard: this.scores.slice(4, 6).reduce((a, b) => a + b, 0) / 2
        }
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      // Fallback summary
      return {
        totalScore: this.scores.reduce((a, b) => a + b, 0),
        averageScore: this.scores.reduce((a, b) => a + b, 0) / this.scores.length,
        summary: 'Interview completed successfully. Detailed analysis and summary generation service temporarily unavailable.',
        completedAt: new Date().toISOString(),
        totalQuestions: this.questions.length,
        difficultyBreakdown: {
          easy: this.scores.slice(0, 2).reduce((a, b) => a + b, 0) / 2 || 0,
          medium: this.scores.slice(2, 4).reduce((a, b) => a + b, 0) / 2 || 0,
          hard: this.scores.slice(4, 6).reduce((a, b) => a + b, 0) / 2 || 0
        }
      };
    }
  }

  // Reset interview
  reset() {
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.answers = [];
    this.scores = [];
    this.difficultyStep = 0;
    this.isActive = false;
  }
}

// Create global interview engine instance
export const interviewEngine = new AIInterviewEngine();
