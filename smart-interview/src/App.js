import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Typography, Button, Modal } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

// Pages
import CandidateOnboarding from './pages/CandidateOnboarding';
import InterviewSession from './pages/InterviewSession';
import Dashboard from './pages/Dashboard';
import WelcomeBackModal from './components/WelcomeBackModal';

// Store actions
import { resetCandidate } from './store/slices/candidateSlice';
import { resetInterview } from './store/slices/interviewSlice';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;

  .header {
    background: #fff;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }

  .logo {
    font-size: 20px;
    font-weight: bold;
    color: #1890ff;
  }

  .sider {
    background: #fff;
    box-shadow: 2px 0 8px rgba(0, 21, 41, 0.08);
  }

  .content {
    margin: 24px;
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    min-height: 600px;
  }
`;

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { profile, onboardingComplete } = useSelector(state => state.candidate);
  const { isComplete } = useSelector(state => state.interview);

  // Show welcome back modal if user has incomplete interview
  useEffect(() => {
    const hasIncompleteInterview = localStorage.getItem('incompleteInterview');
    if (hasIncompleteInterview && location.pathname !== '/interview') {
      Modal.info({
        title: 'Welcome Back!',
        content: (
          <WelcomeBackModal
            onContinueInterview={() => navigate('/interview')}
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
  }, [location.pathname, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(resetCandidate());
    dispatch(resetInterview());
    localStorage.removeItem('incompleteInterview');
    navigate('/');
  };

  const getMenuItems = () => {
    const items = [
      {
        key: '/',
        icon: <UserOutlined />,
        label: 'Candidate Portal',
      },
    ];

    // Show dashboard only for interviewers or if interview is complete
    if (isComplete || location.pathname.includes('dashboard')) {
      items.push({
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Interviewer Dashboard',
      });
    }

    return items;
  };

  return (
    <StyledLayout>
      <Header className="header">
        <div className="logo">Smart Interview</div>
        <div>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Header>

      <Layout>
        <Sider
          className="sider"
          width={200}
          collapsible
          theme="light"
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={getMenuItems()}
            onClick={(e) => navigate(e.key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Content className="content">
            <Routes>
              <Route path="/" element={<CandidateOnboarding />} />
              <Route path="/interview" element={<InterviewSession />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </StyledLayout>
  );
};

export default App;
