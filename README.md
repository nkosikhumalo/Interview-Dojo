# 🥋 Interview Dojo

<p>
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="Frontend React + Vite" />
  <img src="https://img.shields.io/badge/Backend-Go%20%2B%20Gin-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Backend Go + Gin" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%7C%20BYOK-7C3AED?style=for-the-badge" alt="Gemini and BYOK" />
</p>

## Master the Art of the Interview with AI

Interview Dojo is a full-stack AI interview trainer that helps users prepare for technical and behavioral interviews through realistic mock sessions.  
It supports job-specific question generation, voice-based answers, transcript analysis, and actionable feedback (including STAR structure and filler-word metrics).

![Interview Dojo logo](frontend/public/favicon.png)

---

## ✨ What You Can Do

- Generate interview questions based on **job title + job description**
- Speak your answers and convert audio to text through backend transcription
- Get AI evaluation with:
  - score and summary
  - clarity / communication / technical depth breakdown
  - STAR framework guidance
  - filler-word analysis
- View session history and track interview progress over time
- Sign in with email/password or OAuth (Google / Microsoft)
- Use BYOK API keys and manage provider preferences

---

## 🧱 Tech Stack

### Frontend
- React 19 + Vite
- React Router for route guards and page flow
- Axios with auth token handling
- Custom hooks for media recording and speech handling

### Backend
- Go + Gin HTTP server
- JWT auth + OAuth2 login
- PostgreSQL via `sqlx`
- WebSocket endpoint scaffold for real-time interview interaction

### AI and Evaluation
- Provider registry pattern for AI backends
- Gemini integration active
- BYOK key management (encrypted at rest)

---

## 🗂️ Project Structure

```plaintext
Interview-Dojo/
├── frontend/
│   ├── src/
│   │   ├── Pages/          # Login, setup, interview, history, pricing, OAuth callback
│   │   ├── Components/     # UI building blocks + interview-specific components
│   │   ├── hooks/          # Media recorder + speech hooks
│   │   ├── services/       # API client and websocket helpers
│   │   └── store/          # Global interview state
│   └── public/
├── backend/
│   ├── api/                # Gin handlers + route registration + middleware
│   ├── ai/                 # Provider registry and AI integrations
│   ├── db/                 # DB connection + repositories + migrations
│   ├── models/             # Shared request/response/data models
│   ├── storage/            # In-memory runtime session store
│   └── main.go
└── README.md
```

---

## 🔌 API Overview

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### OAuth
- `GET /auth/:provider`
- `GET /auth/:provider/callback`

### Interview
- `POST /api/interview/generate-questions`
- `POST /api/interview/evaluate-answer`
- `GET /api/interview/sessions`
- `GET /api/interview/history?sessionId=...`

### Voice + Realtime
- `POST /api/transcribe`
- `GET /api/ws`

### BYOK + Quota
- `GET /api/quota`
- `POST /api/apikeys`
- `GET /api/apikeys`
- `POST /api/apikeys/:id/test`
- `POST /api/apikeys/:id/activate`
- `DELETE /api/apikeys/:id`

---

## ⚡ Quick Start

### 1) Clone
```bash
git clone https://github.com/yourusername/interview-dojo.git
cd interview-dojo
```

### 2) Start Backend
```bash
cd backend
go mod tidy
go run main.go
```

Backend default: `http://localhost:8080`

### 3) Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend default: `http://localhost:5173`

---

## 🔐 Environment Variables

Create `backend/.env` (or export these values):

```bash
PORT=8080
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgres://user:password@localhost:5432/interview_dojo?sslmode=disable
JWT_SECRET=change-me

# AI
GEMINI_API_KEY=your_key_here
# optional multi-key config:
# GEMINI_API_KEYS=key1,key2,key3

# BYOK key encryption
API_KEY_ENCRYPTION_SECRET=32_byte_minimum_secret_here

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT=common
OAUTH_REDIRECT_BASE=http://localhost:8080
```

Optional frontend env (`frontend/.env`):

```bash
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🔁 Interview Flow

1. User signs in (or guest flow) and enters job context.
2. Frontend requests generated questions from backend.
3. User records answer (audio).
4. Audio is transcribed and submitted with question/session data.
5. Backend evaluates answer and returns structured feedback.
6. Session history is saved and viewable later.

---

## 🛡️ Security Notes

- JWT-protected APIs for authenticated routes
- Password hashing with bcrypt
- API keys encrypted at rest (AES-GCM in repository layer)
- CORS restricted via `FRONTEND_URL`

---

## 🚀 Roadmap Ideas

- Live interview mode over WebSockets
- More provider switching at runtime (Gemini/OpenAI/Anthropic/AWS)
- Team dashboards and recruiter review mode
- Better analytics for speaking pace and confidence trends

---

## 👨‍💻 Author

Built with focus and consistency by **Nkosimphile Khumalo**.
