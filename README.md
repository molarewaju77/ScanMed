# ScanMed - Advanced Health Monitoring & AI Assistant

ScanMed is a comprehensive health management platform that combines AI-powered diagnostics, medication tracking, and intelligent health assistance. It leverages advanced machine learning models for real-time health scans (eyes, teeth, skin) and provides a seamless user experience for managing personal well-being.

## 🚀 Key Features

### 🩺 MedBuddy (Medication Management)
- **Detailed Tracking**: Schedule medications with specific frequencies (1x-3x daily), durations, and precise timings.
- **Smart Reminders**: Automated scheduling logic calculates end dates and manages daily reminders.
- **Adherence Tracking**: Visual weekly adherence charts to monitor medication consistency.
- **History & Trash**: Soft-delete and restore capabilities for medication records.

### 🔍 AI Health Scans
- **Multi-Model Diagnostics**: Uses **TensorFlow.js** (MobileNet, COCO-SSD) and **MediaPipe** for client-side analysis.
- **Scan Types**:
  - **Eye Scan**: Detects redness, irritation, and alignment.
  - **Teeth Scan**: Analyzes dental health with "Open Mouth" guidance.
  - **Skin Scan**: Identifies potential skin conditions.
- **Real-time Feedback**: "OPay-style" UI with circular frame, stability checks, and dynamic instructions (e.g., "Straighten your head", "Lighten up your face").

### 💬 AI Health Assistant
- **Integrated Chat**: Powered by **Groq**, **Gemini**, and **OpenAI**.
- **Context Awareness**: capable of answering health-related queries and providing guidance based on scan results.
- **Voice Integration**: Supports Speech-to-Text and Text-to-Speech interactions.

### 📝 Health Blog & Resources
- **Article Management**: Create, read, and upload health articles.
- **Reading History**: Track articles read and engagement.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [React Query](https://tanstack.com/query/latest)
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **ML/AI**: `@tensorflow/tfjs`, `@mediapipe/tasks-vision`
- **Charts**: Recharts

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Authentication**: JWT (JSON Web Tokens), BCrypt
- **AI Integrations**: Groq SDK, Google Generative AI, OpenAI
- **File Handling**: Multer
- **Scheduling**: Node-Cron

## ⚙️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or Atlas URI)
- **npm** or **yarn**

## 📦 Installation & Setup

### 1. Backend Setup

navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` folder with the following variables:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=your_resend_api_key
# Add other keys as needed (Firebase, etc.)
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd Frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

## 🖥️ Usage

1.  **Register/Login**: Create an account to access features.
2.  **Dashboard**: Overview of health stats and quick actions.
3.  **MedBuddy**: Add medications via the "+" button. Select frequency, time, and duration.
4.  **Scans**: Navigate to the "Scan" tab. Choose Eye, Teeth, or Skin. Follow on-screen instructions (hold steady, center face).
5.  **Chat**: Interact with the AI assistant for health advice.

## 📁 Project Structure

```
ScanMed/
├── backend/                # Node.js/Express Backend
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── seeders/            # Dummy data scripts
│   ├── ml/                 # AI service integration
│   └── index.js            # Entry point
│
├── Frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── medbuddy/   # Medication specific components
│   │   │   ├── ui/         # Shadcn blocks
│   │   ├── pages/          # Main application pages (History, Scan, Chat, etc.)
│   │   ├── lib/            # Utilities & API client
│   │   └── App.tsx         # Main component & Routing
│   └── package.json
└── README.md
```

## 🤝 Contribution

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.
