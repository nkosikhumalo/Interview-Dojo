🥋 Interview Dojo
Master the Art of the Interview with AI

Interview Dojo is a high-performance, AI-powered training ground designed to help students and job-seekers sharpen their interview skills. Using a cutting-edge Go backend and a snappy React frontend, the Dojo provides real-time feedback on your performance, body language, and technical accuracy.

![Interview Dojo logo](frontend/public/favicon.png)

🚀 The Stack

- **Frontend**: React.js + Vite (Fast, modern UI)
- **Backend**: Go (Golang) — Built for speed and concurrency
- **AI Brain**: Integrated via Amazon Bedrock (Claude 3) & Google Gemini API
- **Infrastructure**: AWS S3 for video storage & AWS Lambda for processing
- **Philosophy**: BYOK (Bring Your Own Key) — Scalable and privacy-focused

✨ Features

- **AI Sensei**: Real-time mock interviews with adaptive questions.
- **The "Vibe" Check**: Analysis of filler words (umms, likes) and pace of speech.
- **STAR Method Grading**: The AI checks if your answers follow the Situation, Task, Action, Result framework.
- **Zero-Cost Scaling**: Users can input their own API keys to keep the service free for everyone.

🛠️ Project Structure

```plaintext
interview-dojo/
├── frontend/       # React + Vite (The Dining Area)
└── backend/        # Go (The Kitchen)
```

⚡ Quick Start (Development)

1. **Clone the Dojo**

```bash
git clone https://github.com/yourusername/interview-dojo.git
cd interview-dojo
```

1. **Ignite the Backend (Go)**

```bash
cd backend
go run main.go
```

1. **Launch the Frontend (React)**

In a new terminal, from the project root:

```bash
cd frontend
npm install
npm run dev
```

🛡️ Privacy & Security

We believe in user-owned data. All API keys are stored in your browser's `localStorage` and are never saved to our databases. Your videos are processed and then deleted from our temporary storage immediately.

🎓 Author

Built with ❤️ by Nkosimphile Khumalo
