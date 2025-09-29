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
  DatePicker,
  Input
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

const DashboardContainer = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const StatsCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CandidatesTableCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Dashboard = () => {
  const { profile } = useSelector(state => state.candidate);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app, this would come from API
  const statsData = {
    totalCandidates: 1247,
    completedInterviews: 892,
    pendingReviews: 45,
    avgScore: 7.8
  };

  const candidatesData = [
    {
      key: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Software Engineer',
      status: 'completed',
      score: 8.5,
      interviewDate: '2024-01-15',
      resume: 'john_doe_resume.pdf'
    },
    {
      key: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'Product Manager',
      status: 'in_progress',
      score: null,
      interviewDate: '2024-01-16',
      resume: 'jane_smith_resume.pdf'
    },
    {
      key: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      position: 'Data Scientist',
      status: 'pending',
      score: null,
      interviewDate: '2024-01-17',
      resume: 'mike_johnson_resume.pdf'
    },
    {
      key: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      position: 'UX Designer',
      status: 'completed',
      score: 9.2,
      interviewDate: '2024-01-14',
      resume: 'sarah_wilson_resume.pdf'
    }
  ];

  const columns = [
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
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase()) ||
               record.email.toLowerCase().includes(value.toLowerCase());
      }
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
          completed: { color: 'success', icon: <CheckCircleOutlined /> },
          in_progress: { color: 'processing', icon: <ClockCircleOutlined /> },
          pending: { color: 'warning', icon: <ClockCircleOutlined /> }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <Tag color={config.color} icon={config.icon}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Completed', value: 'completed' },
        { text: 'In Progress', value: 'in_progress' },
        { text: 'Pending', value: 'pending' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) => score ? (
        <Progress
          percent={score * 10}
          size="small"
          format={() => `${score}/10`}
          strokeColor={score >= 8 ? '#52c41a' : score >= 6 ? '#faad14' : '#ff4d4f'}
        />
      ) : '-'
    },
    {
      title: 'Interview Date',
      dataIndex: 'interviewDate',
      key: 'interviewDate',
      render: (date) => moment(date).format('MMM DD, YYYY')
    },
    {
      title: 'Resume',
      dataIndex: 'resume',
      key: 'resume',
      render: (resume) => (
        <Button type="link" icon={<FileTextOutlined />} size="small">
          View
        </Button>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small">
            Review
          </Button>
          <Button size="small">
            Edit
          </Button>
        </Space>
      )
    }
  ];

  const handleDateRangeChange = (dates) => {
    setSelectedDateRange(dates);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const exportData = () => {
    // Mock export functionality
    console.log('Exporting data...');
  };

  return (
    <DashboardContainer>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Interviewer Dashboard
        </Title>
        <Text type="secondary">
          Welcome back, {profile?.name || 'Interviewer'}! Here's your interview overview.
        </Text>
      </div>

      {/* Stats Cards */}
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
              title="Pending Reviews"
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
              prefix={<FileTextOutlined />}
              precision={1}
              suffix="/ 10"
              valueStyle={{ color: '#722ed1' }}
            />
          </StatsCard>
        </Col>
      </Row>

      {/* Filters and Search */}
      <CandidatesTableCard>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} lg={6}>
              <Search
                placeholder="Search candidates..."
                onSearch={handleSearch}
                allowClear
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={8} lg={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Filter by status"
                onChange={handleStatusFilter}
                allowClear
              >
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
                <Select.Option value="in_progress">In Progress</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} lg={6}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
                placeholder={['Start Date', 'End Date']}
              />
            </Col>
            <Col xs={24} sm={24} lg={8} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={exportData}
              >
                Export Data
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={candidatesData}
          pagination={{
            total: candidatesData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} candidates`
          }}
          scroll={{ x: 1200 }}
        />
      </CandidatesTableCard>
    </DashboardContainer>
  );
};

export default Dashboard;
