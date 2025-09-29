import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Steps, Form, Input, Button, Card, Typography, Space, Alert, Divider } from 'antd';
import { UserOutlined, FileTextOutlined, CheckCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ResumeUpload from '../components/ResumeUpload';
import { parseResumeFile, extractWithAI } from '../utils/resumeParser';
import {
  setProfile,
  setResumeFile,
  setResumeText,
  setExtractedData,
  setOnboardingStep,
  completeOnboarding,
  addError,
  clearErrors
} from '../store/slices/candidateSlice';

const { Title, Text } = Typography;
const { Step } = Steps;

const OnboardingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;

  .steps-container {
    margin-bottom: 32px;
  }

  .form-container {
    margin-top: 24px;
  }

  .action-buttons {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
  }
`;

const CandidateOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    profile,
    currentStep,
    errors,
    onboardingComplete
  } = useSelector(state => state.candidate);

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Redirect if onboarding is complete
  useEffect(() => {
    if (onboardingComplete) {
      navigate('/interview');
    }
  }, [onboardingComplete, navigate]);

  const handleFileUpload = (file) => {
    dispatch(setResumeFile(file));
    dispatch(clearErrors());
  };

  const handleExtractData = async (file) => {
    setLoading(true);
    dispatch(clearErrors());

    try {
      const result = await parseResumeFile(file);
      const aiResult = await extractWithAI(result.text);

      dispatch(setResumeText(result.text));
      dispatch(setExtractedData(aiResult));

      // Pre-populate form with extracted data
      form.setFieldsValue({
        name: aiResult.name || '',
        email: aiResult.email || '',
        phone: aiResult.phone || ''
      });

      dispatch(setOnboardingStep('complete'));
    } catch (error) {
      dispatch(addError(error.message || 'Failed to extract information from resume'));
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    dispatch(clearErrors());

    try {
      // Validate required fields
      if (!values.name || !values.email) {
        dispatch(addError('Name and email are required'));
        return;
      }

      // Update profile with form data
      dispatch(setProfile(values));
      dispatch(completeOnboarding());

      // Navigate to interview
      navigate('/interview');
    } catch (error) {
      dispatch(addError('Failed to complete onboarding'));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 'upload') {
      dispatch(setOnboardingStep('complete'));
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'complete') {
      dispatch(setOnboardingStep('upload'));
    }
  };

  const steps = [
    {
      key: 'upload',
      title: 'Upload Resume',
      icon: <FileTextOutlined />
    },
    {
      key: 'complete',
      title: 'Complete Profile',
      icon: <CheckCircleOutlined />
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <OnboardingContainer>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>Welcome to Smart Interview</Title>
        <Text type="secondary">
          Let's get started by uploading your resume and completing your profile
        </Text>
      </div>

      <Card>
        <div className="steps-container">
          <Steps current={currentStepIndex}>
            {steps.map(step => (
              <Step key={step.key} title={step.title} icon={step.icon} />
            ))}
          </Steps>
        </div>

        <Divider />

        {currentStep === 'upload' && (
          <div>
            <ResumeUpload
              onFileUpload={handleFileUpload}
              onExtractData={handleExtractData}
              loading={loading}
              error={errors[0]}
              extractedData={profile.extractedData}
            />

            {profile.extractedData.name && (
              <div className="action-buttons">
                <div></div>
                <Button
                  type="primary"
                  onClick={handleNext}
                  icon={<ArrowRightOutlined />}
                >
                  Continue to Profile
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="form-container">
            <Alert
              message="Review Your Information"
              description="Please review and complete the information below. You can edit any of the extracted data."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              initialValues={{
                name: profile.extractedData.name || '',
                email: profile.extractedData.email || '',
                phone: profile.extractedData.phone || ''
              }}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter your full name' },
                  { min: 2, message: 'Name must be at least 2 characters' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your full name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email address' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your email address"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Phone Number (Optional)"
                name="phone"
                rules={[
                  { pattern: /^\+?[\d\s\-\(\)]+$/, message: 'Please enter a valid phone number' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your phone number"
                  size="large"
                />
              </Form.Item>

              {errors.length > 0 && (
                <Alert
                  message="Error"
                  description={errors.map(error => (
                    <div key={error}>{error}</div>
                  ))}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

              <div className="action-buttons">
                <Button
                  onClick={handlePrevious}
                  icon={<ArrowLeftOutlined />}
                  size="large"
                >
                  Back to Upload
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                  size="large"
                >
                  Start Interview
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Card>
    </OnboardingContainer>
  );
};

export default CandidateOnboarding;
