// Resume parsing utility functions
import { pdfjs } from 'react-pdf';
import mammoth from 'mammoth';

// Initialize PDF.js worker for react-pdf v6+
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF file');
  }
};

export const extractTextFromDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
};

export const extractContactInfo = (text) => {
  const contactInfo = {
    name: '',
    email: '',
    phone: ''
  };

  // Extract email using regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails && emails.length > 0) {
    contactInfo.email = emails[0];
  }

  // Extract phone number using regex
  const phoneRegex = /(\+\d{1,3}[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}/g;
  const phones = text.match(phoneRegex);
  if (phones && phones.length > 0) {
    contactInfo.phone = phones[0];
  }

  // Extract name (look for first line or common name patterns)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 0) {
    // Look for the first line that doesn't contain email or phone
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 2 &&
          trimmedLine.length < 100 &&
          !emailRegex.test(trimmedLine) &&
          !phoneRegex.test(trimmedLine) &&
          !trimmedLine.toLowerCase().includes('resume') &&
          !trimmedLine.toLowerCase().includes('cv')) {
        contactInfo.name = trimmedLine;
        break;
      }
    }
  }

  return contactInfo;
};

export const parseResumeFile = async (file) => {
  try {
    let text = '';

    if (file.type === 'application/pdf') {
      text = await extractTextFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               file.type === 'application/msword') {
      text = await extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type');
    }

    const contactInfo = extractContactInfo(text);

    return {
      text,
      contactInfo,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

// Mock AI-powered extraction for better accuracy
export const extractWithAI = async (text) => {
  // In a real implementation, this would call an AI service
  // For now, we'll use enhanced regex patterns and basic NLP

  const contactInfo = extractContactInfo(text);

  // Enhanced name extraction
  if (!contactInfo.name) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    // Look for patterns like "John Doe" or "DOE, JOHN"
    const namePatterns = [
      /^[A-Z][a-z]+ [A-Z][a-z]+$/,
      /^[A-Z]+, [A-Z]+$/,
      /^[A-Z][a-z]+ [A-Z]\.$/
    ];

    for (const line of lines.slice(0, 5)) { // Check first 5 lines
      const trimmedLine = line.trim();
      for (const pattern of namePatterns) {
        if (pattern.test(trimmedLine)) {
          contactInfo.name = trimmedLine;
          break;
        }
      }
      if (contactInfo.name) break;
    }
  }

  return contactInfo;
};
