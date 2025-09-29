import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Space,
  Avatar,
  Tag,
  Progress,
  Select,
  Input,
  Modal,
  Descriptions,
  Divider,
  List,
  Badge,
  Tooltip,
  Collapse,
  Rate,
  Timeline,
  Alert
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  TrophyOutlined,
  MessageOutlined,
  BarChartOutlined,
  RobotOutlined,
  StarOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Panel } = Collapse;

const DashboardContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const StatsCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CandidatesTableCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CandidateDetailModal = styled(Modal)`
  .ant-modal-body {
    max-height: 70vh;
    overflow-y: auto;
  }
`;

const QuestionCard = styled(Card)`
  margin-bottom: 12px;
  border-left: 4px solid ${props => {
    switch (props.difficulty) {
      case 'easy': return '#52c41a';
      case 'medium': return '#faad14';
      case 'hard': return '#ff4d4f';
      default: return '#1890ff';
    }
  }};
`;

const ScoreBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 12px;
    height: 12px;
  }
`;

const Dashboard = () => {
  const { profile } = useSelector(state => state.candidate);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Mock candidates data with detailed interview information
  const [candidatesData, setCandidatesData] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      position: 'Full Stack Developer',
      status: 'completed',
      finalScore: 8.5,
      interviewDate: '2024-01-15',
      completedAt: '2024-01-15T14:30:00Z',
      summary: 'John demonstrated excellent technical knowledge and problem-solving skills throughout the interview. He showed strong proficiency in both frontend and backend technologies with particular strengths in React and Node.js. His systematic approach to complex problems and clear communication style make him a strong candidate for senior-level positions.',
      profile: {
        experience: '5+ years',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
        education: 'Computer Science, BS'
      },
      interviewDetails: {
        questions: [
          {
            id: 1,
            question: 'What is the difference between let, const, and var in JavaScript?',
            difficulty: 'easy',
            category: 'JavaScript Basics',
            answer: 'Let and const were introduced in ES6 as block-scoped variables, while var is function-scoped. Const cannot be reassigned, let can be reassigned but not redeclared, and var can be both reassigned and redeclared. Let and const are not hoisted to the top of their scope like var.',
            score: 0.9,
            maxScore: 1,
            timeSpent: 45,
            evaluation: {
              feedback: 'Excellent understanding of variable declarations and scope.',
              strengths: ['Clear explanation', 'Technical accuracy', 'Good examples'],
              improvements: ['Could mention hoisting behavior']
            }
          },
          {
            id: 2,
            question: 'Explain what closures are in JavaScript with a simple example.',
            difficulty: 'easy',
            category: 'JavaScript Basics',
            answer: 'A closure is when a function remembers its lexical scope even when executed outside that scope. For example: function outer() { let x = 10; return function inner() { return x; } } const getX = outer(); getX(); // returns 10',
            score: 0.95,
            maxScore: 1,
            timeSpent: 52,
            evaluation: {
              feedback: 'Outstanding explanation with practical example.',
              strengths: ['Perfect example', 'Clear concept explanation'],
              improvements: []
            }
          },
          {
            id: 3,
            question: 'What is JSX and why do we use it in React?',
            difficulty: 'medium',
            category: 'React Intermediate',
            answer: 'JSX is a syntax extension for JavaScript that looks similar to HTML. It allows us to write HTML-like code in React components. JSX is compiled to React.createElement() calls. We use it because it makes React code more readable and easier to write.',
            score: 0.85,
            maxScore: 2,
            timeSpent: 78,
            evaluation: {
              feedback: 'Good understanding of JSX fundamentals.',
              strengths: ['Clear definition', 'Mentioned compilation'],
              improvements: ['Could discuss performance benefits']
            }
          },
          {
            id: 4,
            question: 'How do you handle asynchronous operations in Node.js?',
            difficulty: 'medium',
            category: 'Node.js Intermediate',
            answer: 'Node.js handles async operations using callbacks, promises, and async/await. Callbacks are the traditional way but can lead to callback hell. Promises provide better error handling, and async/await makes async code look synchronous.',
            score: 1.8,
            maxScore: 2,
            timeSpent: 95,
            evaluation: {
              feedback: 'Comprehensive understanding of async patterns.',
              strengths: ['Covered multiple approaches', 'Mentioned pros/cons'],
              improvements: ['Could discuss event loops']
            }
          },
          {
            id: 5,
            question: 'Explain the React component lifecycle and useEffect dependencies.',
            difficulty: 'hard',
            category: 'Advanced React',
            answer: 'React components have mounting, updating, and unmounting phases. useEffect runs after render and can replicate lifecycle methods. Dependencies array controls when effect runs - empty array means run once, no array means run every render, specific dependencies mean run when they change.',
            score: 2.4,
            maxScore: 3,
            timeSpent: 145,
            evaluation: {
              feedback: 'Excellent understanding of React lifecycle concepts.',
              strengths: ['Comprehensive coverage', 'Technical depth'],
              improvements: ['Could mention cleanup functions']
            }
          },
          {
            id: 6,
            question: 'Design a simple URL shortener service and explain your approach.',
            difficulty: 'hard',
            category: 'System Design',
            answer: 'I would design a URL shortener with a hash table for mapping short to long URLs, a database for persistence, and caching layer. Generate short IDs using base62 encoding of auto-incrementing IDs. Include rate limiting, analytics tracking, and expiration dates for short URLs.',
            score: 2.35,
            maxScore: 3,
            timeSpent: 165,
            evaluation: {
              feedback: 'Strong system design thinking with practical considerations.',
              strengths: ['Comprehensive architecture', 'Performance considerations'],
              improvements: ['Could discuss scaling strategies']
            }
          }
        ],
        difficultyBreakdown: {
          easy: 0.925,
          medium: 0.875,
          hard: 0.783
        }
      }
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0456',
      position: 'Frontend Developer',
      status: 'completed',
      finalScore: 7.8,
      interviewDate: '2024-01-16',
      completedAt: '2024-01-16T11:20:00Z',
      summary: 'Jane showed solid understanding of frontend technologies with good React knowledge. She has strong fundamentals but would benefit from more experience with advanced patterns and performance optimization.',
      profile: {
        experience: '3+ years',
        skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Vue.js'],
        education: 'Web Development, Certificate'
      },
      interviewDetails: {
        questions: [
          {
            id: 1,
            question: 'What is the difference between let, const, and var in JavaScript?',
            difficulty: 'easy',
            category: 'JavaScript Basics',
            answer: 'Let and const are block-scoped while var is function-scoped. Const cannot be reassigned.',
            score: 0.7,
            maxScore: 1,
            timeSpent: 35,
            evaluation: {
              feedback: 'Correct but could be more detailed.',
              strengths: ['Accurate information'],
              improvements: ['Provide more detail and examples']
            }
          },
          {
            id: 2,
            question: 'What is JSX and why do we use it in React?',
            difficulty: 'medium',
            category: 'React Intermediate',
            answer: 'JSX is like HTML in JavaScript. It makes React code easier to read and write.',
            score: 1.4,
            maxScore: 2,
            timeSpent: 55,
            evaluation: {
              feedback: 'Basic understanding but lacks depth.',
              strengths: ['Correct basic concept'],
              improvements: ['Explain compilation and benefits']
            }
          }
        ],
        difficultyBreakdown: {
          easy: 0.7,
          medium: 0.7,
          hard: 0
        }
      }
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1-555-0789',
      position: 'Backend Developer',
      status: 'in_progress',
      finalScore: null,
      interviewDate: '2024-01-17',
      completedAt: null,
      summary: null,
      profile: {
        experience: '4+ years',
        skills: ['Node.js', 'Python', 'MongoDB', 'Docker', 'AWS'],
        education: 'Software Engineering, BS'
      },
      interviewDetails: {
        questions: [
          {
            id: 1,
            question: 'What is Node.js and why is it useful for web development?',
            difficulty: 'easy',
            category: 'Node.js Basics',
            answer: 'Node.js is a JavaScript runtime that allows running JS on the server. It\'s useful for building scalable web applications.',
            score: 0.8,
            maxScore: 1,
            timeSpent: 42,
            evaluation: {
              feedback: 'Good basic understanding.',
              strengths: ['Correct definition'],
              improvements: ['Could elaborate on scalability benefits']
            }
          }
        ],
        difficultyBreakdown: {
          easy: 0.8,
          medium: 0,
          hard: 0
        }
      }
    }
  ]);

  // Calculate statistics from real data
  const statsData = React.useMemo(() => {
    const completed = candidatesData.filter(c => c.status === 'completed').length;
    const inProgress = candidatesData.filter(c => c.status === 'in_progress').length;
    const avgScore = candidatesData
      .filter(c => c.finalScore)
      .reduce((sum, c) => sum + c.finalScore, 0) / Math.max(completed, 1);

    return {
      totalCandidates: candidatesData.length,
      completedInterviews: completed,
      pendingReviews: inProgress,
      avgScore: Math.round(avgScore * 10) / 10
    };
  }, [candidatesData]);

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setDetailModalVisible(true);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#52c41a';
    if (score >= 6) return '#faad14';
    return '#ff4d4f';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#52c41a';
      case 'medium': return '#faad14';
      case 'hard': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  const filteredCandidates = candidatesData
    .filter(candidate => {
      if (!searchText) return true;
      return (
        candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchText.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchText.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return (a.finalScore || 0) - (b.finalScore || 0);
      }
      return (b.finalScore || 0) - (a.finalScore || 0);
    });

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <Text strong style={{ color: '#1890ff' }}>
          #{index + 1}
        </Text>
      )
    },
    {
      title: 'Candidate',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          completed: { color: 'success', text: 'Completed' },
          in_progress: { color: 'processing', text: 'In Progress' },
          pending: { color: 'warning', text: 'Pending' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge status={config.color} text={config.text} />;
      }
    },
    {
      title: 'Final Score',
      dataIndex: 'finalScore',
      key: 'score',
      render: (score) => score ? (
        <Space>
          <Progress
            percent={score * 10}
            size="small"
            format={() => `${score}/10`}
            strokeColor={getScoreColor(score)}
            style={{ width: 80 }}
          />
        </Space>
      ) : (
        <Text type="secondary">-</Text>
      ),
      sorter: true,
      sortOrder: sortOrder === 'desc' ? 'descend' : 'ascend'
    },
    {
      title: 'Completed',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => date ? moment(date).format('MMM DD, YYYY') : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewCandidate(record)}
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <DashboardContainer>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <BarChartOutlined /> Interviewer Dashboard
        </Title>
        <Text type="secondary">
          AI-powered candidate evaluation and detailed interview analytics
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title="Total Candidates"
              value={statsData.totalCandidates}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title="Completed Interviews"
              value={statsData.completedInterviews}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title="In Progress"
              value={statsData.pendingReviews}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title="Average Score"
              value={statsData.avgScore}
              prefix={<TrophyOutlined />}
              precision={1}
              suffix="/ 10"
              valueStyle={{ color: '#722ed1' }}
            />
          </StatsCard>
        </Col>
      </Row>

      {/* Search and Filters */}
      <CandidatesTableCard>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <Search
                placeholder="Search candidates by name, email, or position..."
                onSearch={handleSearch}
                allowClear
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Sort by score"
                value={sortOrder}
                onChange={setSortOrder}
              >
                <Select.Option value="desc">
                  <SortDescendingOutlined /> Highest Score First
                </Select.Option>
                <Select.Option value="asc">
                  <SortAscendingOutlined /> Lowest Score First
                </Select.Option>
              </Select>
            </Col>
            <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => console.log('Export data')}
              >
                Export Results
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCandidates}
          pagination={{
            total: filteredCandidates.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} candidates`
          }}
          scroll={{ x: 1000 }}
          rowKey="id"
        />
      </CandidatesTableCard>

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        title={
          <Space>
            <Avatar icon={<UserOutlined />} />
            {selectedCandidate?.name} - Interview Details
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedCandidate && (
          <div>
            {/* Candidate Profile */}
            <Descriptions title="Candidate Information" bordered column={2}>
              <Descriptions.Item label="Name">{selectedCandidate.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedCandidate.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedCandidate.phone}</Descriptions.Item>
              <Descriptions.Item label="Position">{selectedCandidate.position}</Descriptions.Item>
              <Descriptions.Item label="Experience">{selectedCandidate.profile.experience}</Descriptions.Item>
              <Descriptions.Item label="Education">{selectedCandidate.profile.education}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Interview Summary */}
            {selectedCandidate.summary && (
              <>
                <Title level={4}>AI Interview Summary</Title>
                <Alert
                  message="Final Evaluation"
                  description={selectedCandidate.summary}
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Divider />
              </>
            )}

            {/* Score Breakdown */}
            {selectedCandidate.finalScore && (
              <>
                <Title level={4}>Performance Breakdown</Title>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Final Score"
                        value={selectedCandidate.finalScore}
                        suffix="/ 10"
                        valueStyle={{ color: getScoreColor(selectedCandidate.finalScore) }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Easy Questions"
                        value={Math.round(selectedCandidate.interviewDetails.difficultyBreakdown.easy * 100)}
                        suffix="%"
                        valueStyle={{ color: getDifficultyColor('easy') }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Medium Questions"
                        value={Math.round(selectedCandidate.interviewDetails.difficultyBreakdown.medium * 100)}
                        suffix="%"
                        valueStyle={{ color: getDifficultyColor('medium') }}
                      />
                    </Card>
                  </Col>
                </Row>
                <Divider />
              </>
            )}

            {/* Questions and Answers */}
            <Title level={4}>Interview Questions & Answers</Title>
            <Collapse>
              {selectedCandidate.interviewDetails.questions.map((q, index) => (
                <Panel
                  key={q.id}
                  header={
                    <Space>
                      <Text strong>Question {index + 1}</Text>
                      <Tag color={getDifficultyColor(q.difficulty)}>
                        {q.difficulty.toUpperCase()}
                      </Tag>
                      <Tag>{q.category}</Tag>
                      <Text type="secondary">
                        Score: {q.score}/{q.maxScore}
                      </Text>
                    </Space>
                  }
                >
                  <QuestionCard difficulty={q.difficulty}>
                    <Paragraph strong style={{ marginBottom: 12 }}>
                      {q.question}
                    </Paragraph>

                    <Paragraph>
                      <Text strong>Answer:</Text>
                      <div style={{ marginTop: 8, padding: 12, background: '#f6f8fa', borderRadius: 4 }}>
                        {q.answer || 'No answer provided'}
                      </div>
                    </Paragraph>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Text strong style={{ color: '#52c41a' }}>Strengths:</Text>
                        <ul style={{ margin: '4px 0 0 0', paddingLeft: 20 }}>
                          {q.evaluation.strengths.map((strength, i) => (
                            <li key={i} style={{ color: '#52c41a' }}>{strength}</li>
                          ))}
                        </ul>
                      </Col>
                      <Col span={12}>
                        <Text strong style={{ color: '#faad14' }}>Areas for Improvement:</Text>
                        <ul style={{ margin: '4px 0 0 0', paddingLeft: 20 }}>
                          {q.evaluation.improvements.map((improvement, i) => (
                            <li key={i} style={{ color: '#faad14' }}>{improvement}</li>
                          ))}
                        </ul>
                      </Col>
                    </Row>

                    <div style={{ marginTop: 12, fontSize: '12px', color: '#666' }}>
                      Time spent: {q.timeSpent}s | {q.evaluation.feedback}
                    </div>
                  </QuestionCard>
                </Panel>
              ))}
            </Collapse>
          </div>
        )}
      </CandidateDetailModal>
    </DashboardContainer>
  );
};

export default Dashboard;
