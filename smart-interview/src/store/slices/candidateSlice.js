import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    name: '',
    email: '',
    phone: '',
    resumeFile: null,
    resumeText: '',
    extractedData: {}
  },
  onboardingComplete: false,
  currentStep: 'upload', // upload, extract, complete
  errors: []
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setResumeFile: (state, action) => {
      state.profile.resumeFile = action.payload;
    },
    setResumeText: (state, action) => {
      state.profile.resumeText = action.payload;
    },
    setExtractedData: (state, action) => {
      state.profile.extractedData = action.payload;
      // Auto-populate profile with extracted data
      if (action.payload.name) state.profile.name = action.payload.name;
      if (action.payload.email) state.profile.email = action.payload.email;
      if (action.payload.phone) state.profile.phone = action.payload.phone;
    },
    setOnboardingStep: (state, action) => {
      state.currentStep = action.payload;
    },
    completeOnboarding: (state) => {
      state.onboardingComplete = true;
    },
    addError: (state, action) => {
      state.errors.push(action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
    },
    resetCandidate: () => initialState
  }
});

export const {
  setProfile,
  setResumeFile,
  setResumeText,
  setExtractedData,
  setOnboardingStep,
  completeOnboarding,
  addError,
  clearErrors,
  resetCandidate
} = candidateSlice.actions;

export default candidateSlice.reducer;
