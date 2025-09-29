import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  selectedCandidate: null,
  searchTerm: '',
  sortBy: 'score', // score, name, date
  sortOrder: 'desc', // asc, desc
  filterBy: 'all', // all, completed, in-progress
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCandidates: (state, action) => {
      state.candidates = action.payload;
    },
    addCandidate: (state, action) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
      }
    },
    removeCandidate: (state, action) => {
      state.candidates = state.candidates.filter(c => c.id !== action.payload);
    },
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setCandidates,
  addCandidate,
  updateCandidate,
  removeCandidate,
  setSelectedCandidate,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  setFilterBy,
  setLoading,
  setError,
  clearError
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
