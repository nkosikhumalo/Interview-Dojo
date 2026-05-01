<div align="center">

<img src="frontend/public/favicon.png" width="72" alt="FoxVue" style="border-radius:16px" />

# FoxVue

**Practice interviews with AI. Get real feedback. Land the job.**

[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)

</div>

---

Paste a job description → speak your answer → get scored. That's it.

FoxVue generates tailored interview questions using Gemini AI, records your voice, transcribes it, and gives you a full breakdown — STAR rating, clarity score, strengths, weaknesses, and a sample answer.

---

## Screenshots

| Login | Setup | Interview |
|:---:|:---:|:---:|
| ![](frontend/src/assets/1.png) | ![](frontend/src/assets/2.png) | ![](frontend/src/assets/3.png) |

| API Keys | Pricing | Feedback |
|:---:|:---:|:---:|
| ![](frontend/src/assets/4.png) | ![](frontend/src/assets/5.png) | ![](frontend/src/assets/6.png) |

| Voice | AI Response | History |
|:---:|:---:|:---:|
| ![](frontend/src/assets/7.png) | ![](frontend/src/assets/8.png) | ![](frontend/src/assets/9.png) |

---

## Stack

`Go + Gin` · `React 19 + Vite` · `PostgreSQL` · `Gemini AI` · `JWT` · `SMTP` · `Docker` · `Azure` · `Vercel`

---

## Quick Start

```bash
git clone https://github.com/nkosikhumalo/Interview-Dojo.git
cd Interview-Dojo

# Backend
cd backend && cp .env.example .env  # fill in your values
go run main.go

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

> Frontend → `http://localhost:5173` · Backend → `http://localhost:8080`

---

## Features

- 🎤 Voice recording with live waveform visualizer
- 🤖 AI-generated questions tailored to your job description
- 📊 STAR scoring — clarity, technical, communication
- 🔐 Email verification · JWT auth · OAuth (Google + Microsoft)
- 🔑 BYOK — bring your own AI key, AES-256 encrypted at rest
- 📧 Secure password reset via SMTP
- 💳 Free tier (2 sessions) · BYOK users unlimited

---

<div align="center">

Built by **Nkosimphile Khumalo**

</div>
