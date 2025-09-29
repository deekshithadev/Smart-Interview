import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import candidateReducer from './slices/candidateSlice';
import interviewReducer from './slices/interviewSlice';
import dashboardReducer from './slices/dashboardSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['candidate', 'interview'] // Only persist candidate and interview data
};

const rootReducer = combineReducers({
  candidate: candidateReducer,
  interview: interviewReducer,
  dashboard: dashboardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
