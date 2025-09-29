import React from 'react';
import { Button, Space, Typography, Alert } from 'antd';
import { Clock, RotateCcw, Play } from 'lucide-react';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;

const ModalContent = styled.div`
  text-align: center;
  padding: 20px 0;

  .icon-container {
    margin-bottom: 16px;
  }

  .welcome-icon {
    width: 64px;
    height: 64px;
    color: #1890ff;
  }

  .button-container {
    margin-top: 24px;
  }
`;

const WelcomeBackModal = ({ onContinueInterview, onStartNew }) => {
  return (
    <ModalContent>
      <div className="icon-container">
        <Clock className="welcome-icon" />
      </div>

      <Alert
        message="Interview in Progress"
        description="You have an incomplete interview session. Would you like to continue where you left off or start fresh?"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Paragraph>
        Your progress has been automatically saved. You can continue your interview or start a new session.
      </Paragraph>

      <div className="button-container">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={<Play />}
            onClick={onContinueInterview}
            block
            size="large"
          >
            Continue Interview
          </Button>

          <Button
            icon={<RotateCcw />}
            onClick={onStartNew}
            block
            size="large"
          >
            Start New Interview
          </Button>
        </Space>
      </div>
    </ModalContent>
  );
};

export default WelcomeBackModal;
