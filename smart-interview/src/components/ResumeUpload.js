import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, Button, Typography, Alert, Space, Progress } from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

const UploadContainer = styled.div`
  .dropzone {
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fafafa;

    &:hover {
      border-color: #1890ff;
      background: #f0f8ff;
    }

    &.active {
      border-color: #1890ff;
      background: #e6f7ff;
    }
  }

  .file-info {
    margin-top: 16px;
  }

  .upload-icon {
    font-size: 48px;
    color: #1890ff;
    margin-bottom: 16px;
  }

  .error-text {
    color: #ff4d4f;
    margin-top: 8px;
  }

  .success-text {
    color: #52c41a;
    margin-top: 8px;
  }
`;

const ResumeUpload = ({
  onFileUpload,
  onExtractData,
  loading = false,
  error = null,
  extractedData = {}
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            onFileUpload(file);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleExtractData = () => {
    if (uploadedFile) {
      onExtractData(uploadedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <UploadContainer>
      <Card title="Upload Resume" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              <Upload className="upload-icon" />
              {isDragActive ? (
                <Text>Drop your resume here...</Text>
              ) : (
                <div>
                  <Text strong>Click to upload or drag and drop</Text>
                  <br />
                  <Text type="secondary">
                    Supports PDF, DOC, DOCX files (max 10MB)
                  </Text>
                </div>
              )}
            </div>
          ) : (
            <div className="file-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FileText size={24} color="#1890ff" />
                <div style={{ flex: 1 }}>
                  <Text strong>{uploadedFile.name}</Text>
                  <br />
                  <Text type="secondary" size="small">
                    {formatFileSize(uploadedFile.size)}
                  </Text>
                </div>
                <CheckCircle size={20} color="#52c41a" />
              </div>

              {uploadProgress < 100 && (
                <div style={{ marginTop: 16 }}>
                  <Text>Uploading...</Text>
                  <Progress percent={uploadProgress} size="small" />
                </div>
              )}

              {uploadProgress === 100 && (
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    onClick={handleExtractData}
                    loading={loading}
                    block
                  >
                    Extract Information
                  </Button>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert
              message="Upload Error"
              description={error}
              type="error"
              icon={<AlertCircle />}
              showIcon
            />
          )}

          {extractedData.name && (
            <Alert
              message="Information Extracted Successfully"
              description={
                <div>
                  <Text><strong>Name:</strong> {extractedData.name}</Text>
                  <br />
                  <Text><strong>Email:</strong> {extractedData.email}</Text>
                  <br />
                  <Text><strong>Phone:</strong> {extractedData.phone}</Text>
                </div>
              }
              type="success"
              icon={<CheckCircle />}
              showIcon
            />
          )}
        </Space>
      </Card>
    </UploadContainer>
  );
};

export default ResumeUpload;
