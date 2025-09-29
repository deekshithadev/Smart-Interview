import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Button,
  Card,
  Typography,
  Space,
  Avatar,
  Progress,
  Tag,
  Alert,
  Spin,
  message
} from 'antd';
import {
  UserOutlined,
  RobotOutlined,
  SendOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const { Text, Title } = Typography;
const { TextArea } = Input;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  max-width: 80%;
  ${props => props.isUser ? 'margin-left: auto; flex-direction: row-reverse;' : ''}
`;

const MessageCard = styled(Card)`
  ${props => props.isUser ? 'background: #1890ff; color: white;' : 'background: white;'}
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  padding: 20px;
  background: white;
  border-top: 1px solid #e8e8e8;
`;

const TimerContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
`;

const ProgressContainer = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChatInterface = ({
  onComplete,
  onQuestionAnswered,
  initialMessages = []
}) => {
  const { profile } = useSelector(state => state.candidate);
  const [messages, setMessages] = useState(initialMessages);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        content: `Welcome to your AI-powered interview, ${profile?.name || 'Candidate'}! 🎉\n\nI'll be conducting your technical interview for a Full Stack Developer position. We'll cover JavaScript, React, and Node.js topics with increasing difficulty.\n\nReady to begin?`,
        timestamp: new Date(),
        isWelcome: true
      };
      setMessages([welcomeMessage]);
    }
  }, [profile, messages.length]);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      // This will be connected to the AI interview engine
      const firstQuestion = {
        id: Date.now(),
        type: 'question',
        content: 'Let\'s start with an easy question:\n\nWhat is the difference between let, const, and var in JavaScript?',
        difficulty: 'easy',
        category: 'JavaScript Basics',
        timestamp: new Date()
      };

      setCurrentQuestion(firstQuestion);
      setTimeLeft(20); // 20 seconds for easy questions
      setQuestionStartTime(Date.now());

      const questionMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: firstQuestion.content,
        timestamp: new Date(),
        metadata: {
          difficulty: firstQuestion.difficulty,
          category: firstQuestion.category,
          timeLimit: 20
        }
      };

      setMessages(prev => [...prev, questionMessage]);
    } catch (error) {
      message.error('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuestion) {
      // Auto-submit when time runs out
      handleSubmitAnswer();
    }
  }, [timeLeft, currentQuestion]);

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      message.warning('Please provide an answer before submitting.');
      return;
    }

    setIsLoading(true);

    // Add user answer to messages
    const answerMessage = {
      id: Date.now(),
      type: 'user',
      content: currentAnswer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, answerMessage]);

    try {
      // Simulate AI evaluation
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

      // Mock evaluation - in real app, this would call the AI service
      const evaluation = {
        score: currentAnswer.length > 50 ? 0.8 : 0.6,
        feedback: currentAnswer.length > 50 ?
          'Good answer with sufficient detail!' :
          'Answer is a bit brief. Try to provide more detailed explanations.',
        strengths: ['Provided a response'],
        improvements: currentAnswer.length <= 50 ? ['Add more detail and examples'] : []
      };

      // Add evaluation to messages
      const evaluationMessage = {
        id: Date.now() + 1,
        type: 'evaluation',
        content: `**Evaluation:** ${evaluation.feedback}\n\n**Score:** ${Math.round(evaluation.score * 100)}%\n\n**Time spent:** ${timeSpent}s`,
        timestamp: new Date(),
        metadata: evaluation
      };

      setMessages(prev => [...prev, evaluationMessage]);

      // Notify parent component
      if (onQuestionAnswered) {
        onQuestionAnswered({
          question: currentQuestion,
          answer: currentAnswer,
          evaluation,
          timeSpent
        });
      }

      // Check if this was the last question
      const isLastQuestion = messages.filter(m => m.type === 'question').length >= 5;

      if (isLastQuestion) {
        // Interview complete
        const completionMessage = {
          id: Date.now() + 2,
          type: 'bot',
          content: '🎉 **Interview Complete!**\n\nThank you for completing the interview. You\'ll receive your final evaluation shortly.',
          timestamp: new Date(),
          isComplete: true
        };
        setMessages(prev => [...prev, completionMessage]);

        if (onComplete) {
          setTimeout(() => onComplete(), 2000);
        }
      } else {
        // Generate next question after delay
        setTimeout(() => {
          generateNextQuestion();
        }, 2000);
      }

    } catch (error) {
      message.error('Failed to evaluate answer. Please try again.');
    } finally {
      setCurrentAnswer('');
      setCurrentQuestion(null);
      setTimeLeft(0);
      setIsLoading(false);
    }
  };

  const generateNextQuestion = () => {
    const difficulties = ['easy', 'medium', 'hard'];
    const currentDifficulty = difficulties[messages.filter(m => m.type === 'question').length % 3];

    const nextQuestion = {
      id: Date.now(),
      type: 'question',
      content: getNextQuestionText(messages.length),
      difficulty: currentDifficulty,
      category: 'Technical Interview',
      timestamp: new Date()
    };

    setCurrentQuestion(nextQuestion);
    setTimeLeft(currentDifficulty === 'easy' ? 20 : currentDifficulty === 'medium' ? 60 : 120);
    setQuestionStartTime(Date.now());

    const questionMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: nextQuestion.content,
      timestamp: new Date(),
      metadata: {
        difficulty: nextQuestion.difficulty,
        category: nextQuestion.category,
        timeLimit: nextQuestion.difficulty === 'easy' ? 20 : nextQuestion.difficulty === 'medium' ? 60 : 120
      }
    };

    setMessages(prev => [...prev, questionMessage]);
  };

  const getNextQuestionText = (questionNumber) => {
    const questions = [
      'What is the difference between let, const, and var in JavaScript?',
      'Explain what closures are in JavaScript with a simple example.',
      'What is JSX and why do we use it in React?',
      'How do you handle asynchronous operations in Node.js?',
      'Explain the React component lifecycle and useEffect dependencies.',
      'Design a simple URL shortener service and explain your approach.'
    ];

    return questions[questionNumber] || 'Tell me about a challenging project you worked on recently.';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#52c41a';
      case 'medium': return '#faad14';
      case 'hard': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  const renderMessage = (message) => {
    if (message.isWelcome) {
      return (
        <MessageWrapper key={message.id}>
          <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <MessageCard isUser={false}>
            <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <Button type="primary" onClick={startInterview} loading={isLoading}>
                Start Interview
              </Button>
            </div>
          </MessageCard>
        </MessageWrapper>
      );
    }

    if (message.type === 'question') {
      return (
        <MessageWrapper key={message.id}>
          <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <MessageCard isUser={false}>
            <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
            {message.metadata && (
              <div style={{ marginTop: 8 }}>
                <Tag color={getDifficultyColor(message.metadata.difficulty)}>
                  {message.metadata.difficulty.toUpperCase()}
                </Tag>
                <Tag>{message.metadata.category}</Tag>
              </div>
            )}
          </MessageCard>
        </MessageWrapper>
      );
    }

    if (message.type === 'evaluation') {
      return (
        <MessageWrapper key={message.id}>
          <Avatar icon={<TrophyOutlined />} style={{ backgroundColor: '#52c41a' }} />
          <MessageCard isUser={false}>
            <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
            {message.metadata && message.metadata.strengths && (
              <div style={{ marginTop: 8 }}>
                <Text strong style={{ color: '#52c41a' }}>Strengths:</Text>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: 20 }}>
                  {message.metadata.strengths.map((strength, i) => (
                    <li key={i} style={{ color: '#52c41a' }}>{strength}</li>
                  ))}
                </ul>
                {message.metadata.improvements && message.metadata.improvements.length > 0 && (
                  <>
                    <Text strong style={{ color: '#faad14', marginTop: 8, display: 'block' }}>
                      Areas for Improvement:
                    </Text>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: 20 }}>
                      {message.metadata.improvements.map((improvement, i) => (
                        <li key={i} style={{ color: '#faad14' }}>{improvement}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </MessageCard>
        </MessageWrapper>
      );
    }

    if (message.type === 'user') {
      return (
        <MessageWrapper key={message.id} isUser>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <MessageCard isUser>
            {message.content}
          </MessageCard>
        </MessageWrapper>
      );
    }

    return null;
  };

  return (
    <ChatContainer>
      {/* Progress Bar */}
      <ProgressContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text strong>Interview Progress</Text>
          <Text type="secondary">
            Question {messages.filter(m => m.type === 'question').length} of 6
          </Text>
        </div>
        <Progress
          percent={(messages.filter(m => m.type === 'question').length / 6) * 100}
          showInfo={false}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
      </ProgressContainer>

      {/* Timer */}
      {timeLeft > 0 && (
        <TimerContainer>
          <ClockCircleOutlined />
          <Text strong>{formatTime(timeLeft)}</Text>
        </TimerContainer>
      )}

      {/* Chat Messages */}
      <ChatMessages>
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </ChatMessages>

      {/* Input Area */}
      {currentQuestion && timeLeft > 0 && (
        <InputContainer>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Type your answer below:</Text>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <TextArea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your detailed answer here..."
              autoSize={{ minRows: 2, maxRows: 6 }}
              style={{ flex: 1 }}
              disabled={isLoading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmitAnswer}
              loading={isLoading}
              disabled={!currentAnswer.trim()}
              style={{ height: 'auto' }}
            >
              Submit Answer
            </Button>
          </div>
          <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
            💡 Tip: Provide detailed explanations with examples for better scores
          </div>
        </InputContainer>
      )}
    </ChatContainer>
  );
};

export default ChatInterface;
