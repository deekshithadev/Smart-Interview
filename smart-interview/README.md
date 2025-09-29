# 🤖 AI-Powered Smart Interview Assistant

A comprehensive, AI-powered interview management system built with React, Redux, and modern web technologies. This application provides an intelligent, automated interview experience for both candidates and interviewers.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Question Generation** - Dynamic technical questions for Full Stack roles
- **Real-time Chat Interface** - Interactive candidate interview experience
- **Intelligent Answer Evaluation** - AI-driven scoring and feedback system
- **Comprehensive Dashboard** - Advanced candidate management and analytics
- **Resume Processing** - PDF/DOCX parsing with automatic field extraction
- **Data Persistence** - Complete state management with session recovery

### 📊 Interview System
- **6-Question Interview Flow**: 2 Easy → 2 Medium → 2 Hard difficulty progression
- **Dynamic Timing**: 20s (Easy) → 60s (Medium) → 120s (Hard) per question
- **Auto-Submit**: Automatic submission when time expires
- **Real-time Evaluation**: Instant AI feedback after each answer
- **Progress Tracking**: Visual progress indicators and completion status

### 🎨 User Interface
- **Two-Tab Architecture**: Clean separation of candidate and interviewer views
- **Responsive Design**: Mobile-friendly interface with Ant Design components
- **Real-time Updates**: Live progress tracking and status updates
- **Professional UI**: Modern, intuitive design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-interview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### For Candidates

1. **Access the Interviewee Tab**
   - Click on "Interviewee Chat" tab
   - Upload your resume (PDF or DOCX format)
   - Fill in any missing information when prompted

2. **Complete the Interview**
   - Answer 6 AI-generated technical questions
   - Questions progress from Easy → Medium → Hard difficulty
   - Each question has a specific time limit
   - Receive real-time feedback after each answer

3. **View Results**
   - Complete interview generates final score and summary
   - Detailed feedback provided for each question

### For Interviewers

1. **Access the Dashboard**
   - Click on "Interviewer Dashboard" tab
   - View ranked list of all candidates by score

2. **Review Candidates**
   - Use search and sort functionality
   - Click "View Details" on any candidate
   - See complete interview history and AI analysis

3. **Analyze Performance**
   - Review difficulty breakdown for each candidate
   - Examine detailed question-by-question feedback
   - Export results for further analysis

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and concurrent features
- **Redux Toolkit** - State management with advanced patterns
- **Ant Design** - Enterprise-grade UI components
- **Styled Components** - CSS-in-JS styling solution
- **React Router** - Client-side routing

### Key Dependencies
- `react-pdf` - PDF document processing
- `mammoth` - DOCX file parsing
- `redux-persist` - Data persistence and rehydration
- `pdfjs-dist` - Low-level PDF manipulation
- `moment` - Date/time formatting
- `framer-motion` - Smooth animations

### Project Structure
```
smart-interview/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ChatInterface.js    # Main chat component
│   │   ├── InterviewTabs.js    # Tab navigation
│   │   ├── ResumeUpload.js     # File upload component
│   │   └── WelcomeBackModal.js # Session recovery modal
│   ├── pages/              # Page-level components
│   │   ├── CandidateOnboarding.js  # Resume upload page
│   │   ├── Dashboard.js           # Interviewer dashboard
│   │   └── InterviewSession.js     # Interview session page
│   ├── store/              # Redux store configuration
│   │   ├── slices/         # Redux slices
│   │   └── index.js        # Store configuration
│   ├── utils/              # Utility functions
│   │   ├── aiInterview.js  # AI interview engine
│   │   ├── aiService.js    # AI service functions
│   │   └── resumeParser.js # Resume processing
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality. For production deployment, consider configuring:

- API endpoints for AI services
- Database connections for data persistence
- Authentication providers

### Customization

#### Adding New Question Categories
Edit `src/utils/aiInterview.js`:
```javascript
const QUESTION_TEMPLATES = {
  easy: [
    // Add new categories here
  ]
};
```

#### Modifying Difficulty Settings
Update timing and scoring in `src/utils/aiInterview.js`:
```javascript
const DIFFICULTY_CONFIG = {
  easy: { timeLimit: 30, points: 1 },    // Customize here
  medium: { timeLimit: 90, points: 2 },
  hard: { timeLimit: 180, points: 3 }
};
```

## 🎯 API Reference

### AI Interview Engine
```javascript
import { interviewEngine } from './utils/aiInterview';

// Initialize interview
await interviewEngine.initializeInterview(candidateProfile);

// Submit answer and get evaluation
const result = await interviewEngine.submitAnswer(userAnswer);

// Move to next question
const nextQuestion = await interviewEngine.nextQuestion();

// Get final summary
const summary = await interviewEngine.generateFinalSummary();
```

### Resume Parser
```javascript
import { parseResumeFile, extractContactInfo } from './utils/resumeParser';

// Parse resume file
const resumeData = await parseResumeFile(file);

// Extract contact information
const contactInfo = extractContactInfo(resumeText);
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Common Platforms
- **Vercel**: Connect repository and deploy automatically
- **Netlify**: Drag and drop the `build` folder
- **Heroku**: Use Create React App buildpack
- **AWS S3**: Upload `build` folder contents

### Docker Deployment
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TypeScript for new components when possible
- Maintain responsive design principles
- Write clear, concise commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ant Design** for the excellent UI component library
- **React Team** for the powerful framework
- **Redux Toolkit** for simplified state management
- **PDF.js** for PDF processing capabilities

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ for modern interview experiences**
