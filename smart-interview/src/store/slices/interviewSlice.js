import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuestion: 0,
  questions: [],
  answers: [],
  timeRemaining: 0,
  isActive: false,
  isComplete: false,
  currentSessionId: null,
  questionStartTime: null,
  scores: {
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0
  },
  finalSummary: null,
  chatHistory: []
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startInterview: (state, action) => {
      state.isActive = true;
      state.currentQuestion = 0;
      state.answers = [];
      state.currentSessionId = action.payload.sessionId;
      state.questionStartTime = Date.now();
      state.questions = action.payload.questions;
      state.timeRemaining = action.payload.questions[0]?.timeLimit || 300; // 5 minutes default
    },
    nextQuestion: (state) => {
      if (state.currentQuestion < state.questions.length - 1) {
        state.currentQuestion += 1;
        state.questionStartTime = Date.now();
        state.timeRemaining = state.questions[state.currentQuestion]?.timeLimit || 300;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1;
        state.questionStartTime = Date.now();
        state.timeRemaining = state.questions[state.currentQuestion]?.timeLimit || 300;
      }
    },
    submitAnswer: (state, action) => {
      const { questionIndex, answer, timeSpent } = action.payload;
      state.answers[questionIndex] = {
        answer,
        timeSpent,
        submittedAt: Date.now()
      };
    },
    updateTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    autoSubmitCurrentQuestion: (state) => {
      if (state.currentQuestion < state.questions.length) {
        state.answers[state.currentQuestion] = {
          answer: '',
          timeSpent: (state.questions[state.currentQuestion]?.timeLimit || 300) - state.timeRemaining,
          submittedAt: Date.now(),
          autoSubmitted: true
        };
      }
    },
    completeInterview: (state) => {
      state.isActive = false;
      state.isComplete = true;
    },
    setScores: (state, action) => {
      state.scores = action.payload;
    },
    setFinalSummary: (state, action) => {
      state.finalSummary = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push({
        ...action.payload,
        timestamp: Date.now()
      });
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
    },
    pauseInterview: (state) => {
      state.isActive = false;
    },
    resumeInterview: (state) => {
      state.isActive = true;
      state.questionStartTime = Date.now();
    },
    resetInterview: () => initialState
  }
});

export const {
  startInterview,
  nextQuestion,
  previousQuestion,
  submitAnswer,
  updateTimeRemaining,
  autoSubmitCurrentQuestion,
  completeInterview,
  setScores,
  setFinalSummary,
  addChatMessage,
  clearChatHistory,
  pauseInterview,
  resumeInterview,
  resetInterview
} = interviewSlice.actions;

export default interviewSlice.reducer;
