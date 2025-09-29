import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Space, Avatar, Progress, Row, Col, message } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

const { Title, Text } = Typography;

const InterviewContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const QuestionCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProgressContainer = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const InterviewSession = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.candidate);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [isRecording, setIsRecording] = useState(false);

  // Mock interview questions - in real app, these would come from API
  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and weaknesses?",
    "Why do you want to work for our company?",
    "Describe a challenging situation you faced at work and how you handled it.",
    "Where do you see yourself in 5 years?"
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(300);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(300);
    }
  };

  const submitInterview = () => {
    message.success('Interview submitted successfully!');
    // In real app, would dispatch action to save interview data
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <InterviewContainer>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space>
                <Avatar size="large" icon={<UserOutlined />} />
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    Welcome back, {profile?.name || 'Candidate'}!
                  </Title>
                  <Text type="secondary">Interview in Progress</Text>
                </div>
              </Space>
              <Space>
                <ClockCircleOutlined />
                <Text strong>{formatTime(timeLeft)}</Text>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <ProgressContainer>
            <Progress
              percent={progress}
              showInfo={false}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              size={80}
              type="circle"
            />
            <div style={{ marginTop: 16 }}>
              <Text strong>
                Question {currentQuestion + 1} of {questions.length}
              </Text>
            </div>
          </ProgressContainer>
        </Col>

        <Col span={24}>
          <QuestionCard>
            <Title level={3} style={{ marginBottom: 16 }}>
              {questions[currentQuestion]}
            </Title>

            <div style={{ marginBottom: 24 }}>
              <Text type="secondary">
                Please provide your detailed response below. You can type your answer or record an audio response.
              </Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <textarea
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Type your answer here..."
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
            </div>

            <Space>
              <Button
                type="primary"
                icon={isRecording ? <CheckCircleOutlined /> : <UserOutlined />}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            </Space>
          </QuestionCard>
        </Col>

        <Col span={24}>
          <Card>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button
                disabled={currentQuestion === 0}
                onClick={prevQuestion}
              >
                Previous
              </Button>

              <div>
                {Object.keys(answers).length === questions.length ? (
                  <Button type="primary" onClick={submitInterview}>
                    Submit Interview
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    disabled={currentQuestion === questions.length - 1}
                    onClick={nextQuestion}
                  >
                    Next
                  </Button>
                )}
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </InterviewContainer>
  );
};

export default InterviewSession;
