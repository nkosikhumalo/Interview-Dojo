<div align="center">

<img src="frontend/public/favicon.png" width="64" alt="FoxVue" style="border-radius:16px" />

# FoxVue

**AI-powered interview practice platform**

*Speak your answers. Get instant AI feedback. Land the job.*

<br/>

[![Go](https://img.shields.io/badge/Go_1.25-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-38bdf8?style=for-the-badge)](LICENSE)

</div>

---

## ✨ What is FoxVue?

FoxVue is a full-stack AI interview trainer. You paste a job description, the AI generates 5 tailored interview questions, you record your spoken answer, and the AI evaluates your response — scoring clarity, technical accuracy, and communication, then giving you a sample answer and a follow-up question.

---

## 🖼️ Screenshots

| Login | Setup | History |
|:---:|:---:|:---:|
| ![Login](frontend/src/assets/1.png) | ![Setup](frontend/src/assets/2.png) | ![Interview](frontend/src/assets/3.png) |

| API Keys | Pricing | Interview |
|:---:|:---:|:---:|
| ![Feedback](frontend/src/assets/4.png) | ![History](frontend/src/assets/5.png) | ![Pricing](frontend/src/assets/6.png) |

| Voice Interview | AI Response | AI Response |
|:---:|:---:|:---:|
| ![API Keys](frontend/src/assets/7.png) | ![Reset](frontend/src/assets/8.png) | ![Mobile](frontend/src/assets/9.png) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                   │
│   React 19 + Vite                                                │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│   │  Login   │  │  Setup   │  │Interview │  │   History    │   │
│   │  /signup │  │  /setup  │  │  /room   │  │  /history    │   │
│   └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                                                                   │
│   MediaRecorder API → audio blob → POST /api/transcribe          │
│   JWT stored in localStorage / sessionStorage                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTPS + Bearer JWT
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GO + GIN  :8080                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    MIDDLEWARE                            │    │
│  │  RequireAuth (JWT)  │  RequireInterviewAuth (JWT+UID)   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  PUBLIC ROUTES                  PROTECTED ROUTES                 │
│  ┌──────────────────┐           ┌──────────────────────────┐    │
│  │ POST /auth/signup│           │ POST /interview/generate │    │
│  │ POST /auth/login │           │ POST /interview/evaluate │    │
│  │ POST /auth/forgot│           │ POST /transcribe         │    │
│  │ POST /auth/reset │           │ GET  /interview/sessions │    │
│  │ GET  /auth/:oauth│           │ GET  /api/quota          │    │
│  └──────────────────┘           │ CRUD /api/apikeys        │    │
│                                 └──────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   AI REGISTRY                           │    │
│  │  User BYOK key → first priority                         │    │
│  │  Platform keys → fallback (4 keys, auto-rotate)         │    │
│  │  Provider interface: GenerateQuestions + EvaluateAnswer │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────┬──────────────────────────────────┬───────────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────┐          ┌───────────────────────────────┐
│   PostgreSQL :5432   │          │       GEMINI API              │
│                      │          │                               │
│  users               │          │  gemini-flash-latest          │
│  ├─ id (UUID)        │          │                               │
│  ├─ email            │          │  GenerateQuestions()          │
│  ├─ password_hash    │          │  → 5 tailored questions       │
│  ├─ plan / role      │          │  → skill + category tags      │
│  ├─ reset_token      │          │                               │
│  └─ free_sessions    │          │  EvaluateAnswer()             │
│                      │          │  → score 1-10                 │
│  interview_sessions  │          │  → clarity / technical /      │
│  session_questions   │          │    communication scores       │
│  interview_answers   │          │  → strengths + weaknesses     │
│  user_api_keys       │          │  → sample answer              │
│  └─ AES-256-GCM      │          │  → follow-up question         │
└──────────────────────┘          └───────────────────────────────┘
           │
           ▼
┌──────────────────────┐
│    SMTP (Gmail)      │
│                      │
│  Password reset flow │
│  → crypto/rand token │
│  → SHA-256 hash in DB│
│  → 30 min expiry     │
│  → single-use link   │
└──────────────────────┘
```

---

## 🔑 Key Features

| Feature | Details |
|---|---|
| 🎤 **Voice Recording** | MediaRecorder API — works in Chrome, Firefox, Safari |
| 🤖 **AI Questions** | Gemini generates 5 tailored questions from your job description |
| 📊 **Rich Feedback** | Score, STAR rating, strengths, weaknesses, sample answer, follow-up |
| 🔐 **Secure Auth** | JWT HS256 · bcrypt passwords · OAuth (Google, Microsoft) |
| 🔑 **BYOK** | Bring your own Gemini/OpenAI/Anthropic key — AES-256 encrypted at rest |
| 📧 **Password Reset** | SMTP email · crypto/rand token · SHA-256 hashed · 30 min expiry |
| 💳 **Quota System** | Free: 2 sessions · BYOK users exempt · Admin bypasses all limits |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## ⚡ Quick Start

```bash
# 1 — Clone
git clone https://github.com/yourusername/foxvue.git
cd foxvue

# 2 — Backend
cd backend
cp .env.example .env      # fill in your values
go run main.go            # starts on :8080

# 3 — Frontend (new terminal)
cd frontend
npm install
npm run dev               # starts on :5173
```

Open **http://localhost:5173**

---

## 🔐 Environment Variables

```env
# backend/.env

DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/foxvue?sslmode=disable
JWT_SECRET=your-long-random-secret
GEMINI_API_KEYS=key1,key2,key3          # comma-separated, auto-rotates on quota errors
API_KEY_ENCRYPTION_SECRET=exactly32chars!!!!!!!!!!!!!!  # AES-256 key

# SMTP — use a Gmail App Password (no spaces)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=yourgmailapppassword
SMTP_FROM=you@gmail.com

FRONTEND_URL=http://localhost:5173
OAUTH_REDIRECT_BASE=http://localhost:8080
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
```

---

## 📁 Project Structure

```
foxvue/
├── backend/
│   ├── ai/             Provider interface + Gemini implementation + Registry
│   ├── api/            Gin handlers, middleware, routes
│   ├── db/             PostgreSQL repos + migrations (auto-run on startup)
│   ├── email/          SMTP mailer with STARTTLS
│   ├── models/         Shared Go structs
│   ├── storage/        In-memory session store
│   └── main.go
│
└── frontend/
    └── src/
        ├── Pages/      Login · Setup · Interview · History · Pricing · API Keys
        ├── Components/ Navbar · VoiceVisualizer · shared UI
        ├── hooks/      useMediaRecorder
        ├── services/   Axios API client (auto JWT injection)
        ├── store/      React Context + useReducer
        └── styles/     Per-page CSS with CSS variables
```

---

## 🛡️ Security

- Passwords hashed with **bcrypt** (cost 10)
- Password reset tokens: **crypto/rand** → **SHA-256** stored, raw token in email only
- BYOK API keys: **AES-256-GCM** encrypted, only masked hint returned to frontend
- JWT carries `role` claim — admin role bypasses quota
- CORS restricted to `FRONTEND_URL`
- All AI calls proxied through backend — keys never reach the browser

---

<div align="center">

**Built by Nkosimphile Khumalo**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)

</div>
