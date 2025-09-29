import React, { useState, useEffect } from 'react';
import { Tabs, Card, Typography, Space, Avatar, Button, Badge } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  MessageOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import ChatInterface from './ChatInterface';
import Dashboard from '../pages/Dashboard';
import CandidateOnboarding from '../pages/CandidateOnboarding';
import { persistInterview, loadInterview } from '../store/slices/interviewSlice';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const TabsContainer = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
`;

const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  text-align: center;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    font-size: 16px;
    font-weight: 500;
    padding: 12px 24px;
  }

  .ant-tabs-tab-active {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px 8px 0 0;
  }

  .ant-tabs-content {
    padding: 0;
  }
`;

const TabContent = styled.div`
  background: white;
  margin: 0;
  min-height: calc(100vh - 140px);
`;

const InterviewTabs = () => {
  const dispatch = useDispatch();
  const { profile, onboardingComplete } = useSelector(state => state.candidate);
  const { isComplete, answers, currentQuestion } = useSelector(state => state.interview);
  const [activeTab, setActiveTab] = useState('interviewee');
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  // Load persisted interview data on component mount
  useEffect(() => {
    dispatch(loadInterview());
  }, [dispatch]);

  // Persist interview data whenever it changes
  useEffect(() => {
    if (answers.length > 0 || currentQuestion) {
      dispatch(persistInterview({
        answers,
        currentQuestion,
        completedAt: interviewCompleted ? new Date().toISOString() : null
      }));
    }
  }, [answers, currentQuestion, interviewCompleted, dispatch]);

  const handleInterviewComplete = () => {
    setInterviewCompleted(true);
    setActiveTab('interviewer');
  };

  const handleQuestionAnswered = (questionData) => {
    // This will be handled by the Redux store
    console.log('Question answered:', questionData);
  };

  // Determine which tab to show by default
  useEffect(() => {
    if (!onboardingComplete) {
      setActiveTab('onboarding');
    } else if (isComplete || interviewCompleted) {
      setActiveTab('interviewer');
    } else {
      setActiveTab('interviewee');
    }
  }, [onboardingComplete, isComplete, interviewCompleted]);

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'onboarding':
        return (
          <Space>
            <UserOutlined />
            Candidate Setup
          </Space>
        );
      case 'interviewee':
        return (
          <Space>
            <MessageOutlined />
            Interviewee Chat
            {answers.length > 0 && (
              <Badge count={answers.length} size="small" />
            )}
          </Space>
        );
      case 'interviewer':
        return (
          <Space>
            <DashboardOutlined />
            Interviewer Dashboard
          </Space>
        );
      default:
        return 'Tab';
    }
  };

  return (
    <TabsContainer>
      <HeaderContainer>
        <Space direction="vertical" size="small">
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            🤖 AI-Powered Smart Interview
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Intelligent technical interviews for Full Stack developers
          </Text>
          {profile?.name && (
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Welcome back, {profile.name}!
            </Text>
          )}
        </Space>
      </HeaderContainer>

      <StyledTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        size="large"
        style={{ background: 'transparent' }}
      >
        {!onboardingComplete && (
          <TabPane tab={getTabTitle('onboarding')} key="onboarding">
            <TabContent>
              <CandidateOnboarding />
            </TabContent>
          </TabPane>
        )}

        <TabPane tab={getTabTitle('interviewee')} key="interviewee">
          <TabContent>
            <ChatInterface
              onComplete={handleInterviewComplete}
              onQuestionAnswered={handleQuestionAnswered}
            />
          </TabContent>
        </TabPane>

        <TabPane tab={getTabTitle('interviewer')} key="interviewer">
          <TabContent>
            <Dashboard />
          </TabContent>
        </TabPane>
      </StyledTabs>
    </TabsContainer>
  );
};

export default InterviewTabs;
