# Aura Support — AI-Powered Technical Support Agent

> Enterprise-grade IT Service Management platform with conversational AI, predictive diagnostics, and intelligent ticket management.

![Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Stack](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)
![Stack](https://img.shields.io/badge/Gemini-3.5_Flash-4285F4?style=flat-square&logo=google)
![Stack](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss)

---

## Features

- **AI Conversational Troubleshooting** — Gemini 3.5 Flash guides users through 8 IT categories step-by-step
- **Screenshot Error Diagnosis** — Upload a BSOD or error screenshot; Vision AI reads the error code and generates a custom fix
- **Voice Input** — Web Speech API lets users speak their problem; transcribed and processed automatically
- **Live Device Health Telemetry** — Real-time CPU, RAM, temperature and battery monitoring with AI diagnostic reports
- **Intelligent Ticket Management** — Auto-creates prioritised support tickets when AI resolution fails
- **Knowledge Base CMS** — Admin can add/delete solution workflows in real time
- **Multi-Role Access Control** — Employee and IT Admin roles with scoped permissions
- **5-Star Feedback System** — Session ratings feed back into solution quality tracking
- **Offline KB Fallback** — Symptom matching works without a Gemini API key

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Motion/React |
| Backend | Node.js, Express 4, tsx |
| AI | Google Gemini 3.5 Flash (text + vision) |
| Database | JSON file store (upgradeable to PostgreSQL) |
| Fonts | Cormorant Garamond, Plus Jakarta Sans, Fira Code |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) *(optional — falls back to local KB)*

### Installation

```bash
git clone https://github.com/Aadhithyan2006/Aura-Support.git
cd Aura-Support
npm install
```

### Configuration

Copy the example env file and add your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Employee | user@support.com | user123 |
| IT Admin | admin@support.com | admin123 |

> Admin role is automatically assigned to any email containing "admin".

---

## Project Structure

```
├── server.ts              # Express API server + AI workflow
├── src/
│   ├── App.tsx            # Root layout + navigation
│   ├── types.ts           # Shared TypeScript types
│   ├── server_db.ts       # Database abstraction layer
│   └── components/
│       ├── Login.tsx      # Auth (login / register / Google SSO)
│       ├── Dashboard.tsx  # Employee portal + device telemetry
│       ├── ChatInterface.tsx  # AI chat + troubleshooting engine
│       └── AdminPanel.tsx # Admin console (tickets, KB, users, logs)
├── .env.example
└── README.md
```

---

## IT Categories Supported

1. Network Issues
2. Software Issues
3. Hardware Issues
4. Operating System Issues
5. Performance Issues
6. Security Issues
7. Account Issues
8. Printer Issues

---

## License

[Apache 2.0](LICENSE)

---

*Built as a final-year Computer Science project demonstrating enterprise AI architecture, NLP pipelines, and ITSM workflows.*
