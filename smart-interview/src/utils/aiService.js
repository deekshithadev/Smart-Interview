// AI Service for interview question generation and answer evaluation
// This is a mock AI service - in production, this would connect to actual AI APIs

// Mock AI question generation
export async function generateQuestion(difficulty, category, previousQuestions = []) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const questions = {
    easy: {
      'JavaScript Basics': [
        'What is the difference between let, const, and var in JavaScript?',
        'Explain what closures are in JavaScript with a simple example.',
        'What is the difference between == and === in JavaScript?',
        'How do you declare a function in JavaScript?',
        'What is an arrow function and how does it differ from regular functions?'
      ],
      'React Basics': [
        'What is JSX and why do we use it in React?',
        'Explain the difference between functional and class components.',
        'What is state in React and how do you update it?',
        'What are props in React and how are they used?',
        'What is the useEffect hook used for in React?'
      ],
      'Node.js Basics': [
        'What is Node.js and why is it useful for web development?',
        'What is npm and what is it used for?',
        'Explain the difference between require() and import in Node.js.',
        'What is Express.js and why would you use it?',
        'What is middleware in Express.js applications?'
      ]
    },
    medium: {
      'React Intermediate': [
        'Explain the React component lifecycle and useEffect dependencies.',
        'What is the Virtual DOM and how does React use it for performance?',
        'How do you handle forms in React applications?',
        'What are React hooks and why are they useful?',
        'Explain the difference between controlled and uncontrolled components.'
      ],
      'Node.js Intermediate': [
        'How do you handle asynchronous operations in Node.js?',
        'What is the event loop in Node.js and how does it work?',
        'How do you work with the file system in Node.js?',
        'What are streams in Node.js and when would you use them?',
        'How do you handle errors in Node.js applications?'
      ],
      'Database/API': [
        'What is RESTful API design and what are its principles?',
        'How do you connect to a database in Node.js applications?',
        'What is authentication and authorization in web applications?',
        'How do you handle CORS in Node.js/Express applications?',
        'What are the different HTTP status codes and when should you use them?'
      ]
    },
    hard: {
      'Advanced React': [
        'Explain React context and when to use it over props drilling.',
        'What are React portals and why are they useful?',
        'How do you optimize React application performance?',
        'What are React concurrent features and how do they work?',
        'Explain React server components and their benefits.'
      ],
      'Advanced Node.js': [
        'How do you implement clustering in Node.js for better performance?',
        'What is the difference between process.nextTick() and setImmediate()?',
        'How do you handle memory leaks in Node.js applications?',
        'What are worker threads in Node.js and when would you use them?',
        'How do you implement caching strategies in Node.js applications?'
      ],
      'System Design': [
        'Design a URL shortener service like bit.ly.',
        'How would you design a real-time chat application?',
        'Explain load balancing and scaling strategies for web applications.',
        'How do you design a real-time notification system?',
        'What are microservices and when should you use them over monoliths?'
      ]
    }
  };

  const availableQuestions = questions[difficulty]?.[category] || questions[difficulty]['JavaScript Basics'] || [];

  // Filter out previously asked questions
  const unusedQuestions = availableQuestions.filter(q =>
    !previousQuestions.some(pq => pq.text === q)
  );

  // If all questions used, pick randomly from all available
  const questionPool = unusedQuestions.length > 0 ? unusedQuestions : availableQuestions;

  const selectedQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

  return {
    text: selectedQuestion,
    category: category,
    difficulty: difficulty,
    expectedTopics: extractKeyTopics(selectedQuestion),
    timeLimit: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120
  };
}

// Mock AI answer evaluation
export async function evaluateAnswer(question, answer, difficulty, candidateProfile) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const answerText = answer.toLowerCase();
  const questionText = question.toLowerCase();

  // Simple keyword-based evaluation (in production, use NLP/AI)
  const evaluationCriteria = {
    easy: {
      minLength: 30,
      keywords: extractKeyTopics(question),
      weight: 0.6
    },
    medium: {
      minLength: 80,
      keywords: extractKeyTopics(question),
      weight: 0.7
    },
    hard: {
      minLength: 150,
      keywords: extractKeyTopics(question),
      weight: 0.8
    }
  };

  const criteria = evaluationCriteria[difficulty];
  let score = 0;

  // Length score (20% of total)
  const lengthScore = Math.min(answer.length / criteria.minLength, 2) * 0.2;
  score += lengthScore;

  // Keyword relevance score (60% of total)
  const keywordMatches = criteria.keywords.filter(keyword =>
    answerText.includes(keyword.toLowerCase())
  ).length;

  const keywordScore = (keywordMatches / criteria.keywords.length) * criteria.weight;
  score += keywordScore;

  // Structure and clarity score (20% of total)
  const structureScore = assessAnswerStructure(answer) * 0.2;
  score += structureScore;

  // Ensure score is between 0 and 1
  score = Math.max(0, Math.min(1, score));

  // Generate feedback based on score
  const feedback = generateFeedback(score, keywordMatches, criteria.keywords.length, answer.length, criteria.minLength);

  return {
    score: Math.round(score * 100) / 100,
    feedback: feedback.summary,
    strengths: feedback.strengths,
    improvements: feedback.improvements,
    detailedAnalysis: {
      lengthScore: Math.round(lengthScore * 100),
      keywordScore: Math.round(keywordScore * 100),
      structureScore: Math.round(structureScore * 100),
      keywordMatches: keywordMatches,
      totalKeywords: criteria.keywords.length
    }
  };
}

// Mock AI summary generation
export async function generateSummary(questions, answers, candidateProfile) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const totalQuestions = questions.length;
  const scores = answers.map(a => a.score);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Analyze performance by difficulty
  const easyQuestions = answers.filter((a, i) => questions[i].difficulty === 'easy');
  const mediumQuestions = answers.filter((a, i) => questions[i].difficulty === 'medium');
  const hardQuestions = answers.filter((a, i) => questions[i].difficulty === 'hard');

  const easyAvg = easyQuestions.length > 0 ?
    easyQuestions.reduce((sum, a) => sum + a.score, 0) / easyQuestions.length : 0;
  const mediumAvg = mediumQuestions.length > 0 ?
    mediumQuestions.reduce((sum, a) => sum + a.score, 0) / mediumQuestions.length : 0;
  const hardAvg = hardQuestions.length > 0 ?
    hardQuestions.reduce((sum, a) => sum + a.score, 0) / hardQuestions.length : 0;

  // Generate summary based on performance
  let summary = '';

  if (averageScore >= 0.8) {
    summary = `${candidateProfile.name} demonstrated excellent technical knowledge and problem-solving skills throughout the interview. `;
  } else if (averageScore >= 0.6) {
    summary = `${candidateProfile.name} showed solid understanding of the core concepts with room for improvement in advanced topics. `;
  } else {
    summary = `${candidateProfile.name} has foundational knowledge but would benefit from additional study and practice. `;
  }

  summary += `Performance breakdown: Easy (${Math.round(easyAvg * 100)}%), Medium (${Math.round(mediumAvg * 100)}%), Hard (${Math.round(hardAvg * 100)}%). `;

  // Add specific recommendations
  if (hardAvg < 0.6) {
    summary += 'Recommend focusing on advanced topics and system design concepts. ';
  }
  if (easyAvg < 0.7) {
    summary += 'Suggest strengthening fundamental concepts before advancing to complex topics. ';
  }

  summary += `Overall, ${candidateProfile.name} appears to be a ${getCandidateLevel(averageScore)} candidate for a full-stack development role.`;

  return {
    summary,
    averageScore: Math.round(averageScore * 100) / 100,
    difficultyBreakdown: {
      easy: Math.round(easyAvg * 100) / 100,
      medium: Math.round(mediumAvg * 100) / 100,
      hard: Math.round(hardAvg * 100) / 100
    },
    recommendations: generateRecommendations(averageScore, easyAvg, mediumAvg, hardAvg),
    strengths: identifyStrengths(answers, questions),
    areasForImprovement: identifyImprovements(answers, questions)
  };
}

// Helper functions
function extractKeyTopics(question) {
  // Simple keyword extraction - in production, use NLP
  const commonKeywords = {
    'let const var': ['let', 'const', 'var', 'variable', 'declaration'],
    'closures': ['closure', 'scope', 'lexical', 'function', 'context'],
    'jsx': ['jsx', 'javascript', 'xml', 'syntax', 'react'],
    'state': ['state', 'setstate', 'update', 'component', 'data'],
    'props': ['props', 'properties', 'attributes', 'passing', 'data'],
    'nodejs': ['node.js', 'server', 'runtime', 'javascript', 'backend'],
    'express': ['express', 'framework', 'middleware', 'routing', 'server'],
    'react': ['react', 'component', 'virtual dom', 'lifecycle', 'hooks'],
    'database': ['database', 'sql', 'nosql', 'connection', 'query'],
    'api': ['api', 'rest', 'endpoint', 'http', 'request', 'response']
  };

  const questionLower = question.toLowerCase();

  for (const [key, keywords] of Object.entries(commonKeywords)) {
    if (questionLower.includes(key)) {
      return keywords;
    }
  }

  // Default keywords if no match found
  return ['technical', 'development', 'programming', 'software'];
}

function assessAnswerStructure(answer) {
  let structureScore = 0;

  // Check for code examples (if applicable)
  if (answer.includes('function') || answer.includes('=>') || answer.includes('const') || answer.includes('let')) {
    structureScore += 0.3;
  }

  // Check for proper explanation structure
  if (answer.length > 100 && (answer.includes('.') || answer.includes('because') || answer.includes('therefore'))) {
    structureScore += 0.4;
  }

  // Check for examples or analogies
  if (answer.includes('example') || answer.includes('like') || answer.includes('such as')) {
    structureScore += 0.3;
  }

  return Math.min(structureScore, 1);
}

function generateFeedback(score, keywordMatches, totalKeywords, answerLength, minLength) {
  const strengths = [];
  const improvements = [];

  if (score >= 0.8) {
    strengths.push('Excellent understanding of the topic');
    strengths.push('Comprehensive and well-structured answer');
    if (keywordMatches >= totalKeywords * 0.7) {
      strengths.push('Covered all key concepts');
    }
  } else if (score >= 0.6) {
    strengths.push('Good grasp of fundamental concepts');
    if (answerLength >= minLength) {
      strengths.push('Provided sufficient detail');
    }
  } else {
    if (answerLength < minLength * 0.5) {
      improvements.push('Provide more detailed explanations');
    }
    if (keywordMatches < totalKeywords * 0.3) {
      improvements.push('Address more of the key concepts mentioned in the question');
    }
    improvements.push('Consider including examples to illustrate your points');
  }

  if (keywordMatches < totalKeywords * 0.5) {
    improvements.push('Try to cover more of the technical terms and concepts');
  }

  return {
    summary: `Score: ${Math.round(score * 100)}%. ${strengths[0] || 'Answer received'}.`,
    strengths,
    improvements
  };
}

function getCandidateLevel(score) {
  if (score >= 0.8) return 'strong';
  if (score >= 0.6) return 'promising';
  return 'developing';
}

function generateRecommendations(avgScore, easyAvg, mediumAvg, hardAvg) {
  const recommendations = [];

  if (hardAvg < 0.6) {
    recommendations.push('Focus on advanced topics and system design concepts');
  }
  if (mediumAvg < 0.6) {
    recommendations.push('Strengthen intermediate-level technical knowledge');
  }
  if (easyAvg < 0.7) {
    recommendations.push('Review fundamental concepts and basics');
  }
  if (avgScore >= 0.8) {
    recommendations.push('Ready for senior-level positions');
  }

  return recommendations;
}

function identifyStrengths(answers, questions) {
  const strengths = [];
  const goodAnswers = answers.filter(a => a.score >= 0.7);

  if (goodAnswers.length >= answers.length * 0.6) {
    strengths.push('Consistent performance across different topics');
  }

  const easyAnswers = answers.filter((a, i) => questions[i].difficulty === 'easy');
  if (easyAnswers.every(a => a.score >= 0.8)) {
    strengths.push('Strong foundation in basic concepts');
  }

  return strengths;
}

function identifyImprovements(answers, questions) {
  const improvements = [];
  const weakAnswers = answers.filter(a => a.score < 0.5);

  if (weakAnswers.length > 0) {
    const weakTopics = weakAnswers.map((a, i) => questions[answers.indexOf(a)].category);
    const commonTopics = weakTopics.filter((topic, index) => weakTopics.indexOf(topic) !== index);

    if (commonTopics.length > 0) {
      improvements.push(`Focus on ${commonTopics[0]} concepts`);
    }
  }

  return improvements;
}
