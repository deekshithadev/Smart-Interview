import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd';
import styled from 'styled-components';

// Components
import InterviewTabs from './components/InterviewTabs';
import WelcomeBackModal from './components/WelcomeBackModal';

// Store actions
import { resetCandidate } from './store/slices/candidateSlice';
import { resetInterview } from './store/slices/interviewSlice';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
`;

const App = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.candidate);
  const { isComplete, answers } = useSelector(state => state.interview);

  // Show welcome back modal if user has incomplete interview
  useEffect(() => {
    const hasIncompleteInterview = localStorage.getItem('incompleteInterview');
    if (hasIncompleteInterview && answers.length === 0) {
      Modal.info({
        title: 'Welcome Back!',
        content: (
          <WelcomeBackModal
            onContinueInterview={() => {
              // Interview will resume from where it left off
              localStorage.removeItem('incompleteInterview');
            }}
            onStartNew={() => {
              dispatch(resetInterview());
              localStorage.removeItem('incompleteInterview');
            }}
          />
        ),
        footer: null,
        maskClosable: false
      });
    }
  }, [answers.length, dispatch]);

  const handleLogout = () => {
    dispatch(resetCandidate());
    dispatch(resetInterview());
    localStorage.removeItem('incompleteInterview');
  };

  return (
    <AppContainer>
      <InterviewTabs />
    </AppContainer>
  );
};

export default App;
