# AI-Powered Technical Support Agent
## Software Requirements Specification (SRS)
### Version 2.0 | Enterprise Edition

---

## 1. EXECUTIVE SUMMARY

**Project Name:** AI-Powered Technical Support Agent with Intelligent Ticket Management and Predictive IT Support
**Codename:** Aura ITSM Enterprise
**Version:** 2.0
**Date:** July 2026
**Classification:** Final Year CS Project | Enterprise Implementation Ready

This document defines the complete Software Requirements Specification for an enterprise-grade
AI-Powered IT Service Management (ITSM) system. The platform combines a conversational AI support
agent, NLP-based issue classification, predictive ticket management, SLA tracking, device health
monitoring, and a multi-role management console — comparable to industry solutions from
ServiceNow, Zendesk, Freshservice, and Zoho Desk.

The system is built on a React 19 + TypeScript frontend, Express.js backend, Google Gemini AI
(gemini-3.5-flash), and a file-based JSON persistence layer (upgradeable to PostgreSQL/MongoDB).
It is designed to be cloud-deployable on AWS or Azure with Docker containerization and CI/CD
pipeline support.

---

## 2. PROBLEM STATEMENT

Modern enterprises face a growing crisis in IT support operations:

- **Volume Overload:** IT helpdesks receive 100s–1000s of tickets daily; human agents cannot
  scale without exponential cost increases.
- **Slow Resolution:** Average ticket resolution time in manual systems is 24–72 hours, causing
  employee productivity loss.
- **No Intelligence:** Traditional ticketing tools (Jira, Freshdesk) lack AI-driven root cause
  analysis or predictive capabilities.
- **Inconsistent Triage:** Manual priority assignment leads to critical issues being overlooked
  and low-priority tickets being escalated unnecessarily.
- **Knowledge Silos:** Solutions to recurring problems are trapped in engineer minds rather than
  systematically captured and reused.
- **No Proactive Monitoring:** Devices fail reactively; there is no system to predict hardware
  or performance degradation before it causes downtime.
- **Poor Employee Experience:** Users must navigate complex portals, fill long forms, and wait
  in queues — reducing adoption and satisfaction.

**Quantified Business Impact (industry averages):**
- Cost per manual ticket: $15–$22 USD
- AI-deflected ticket cost: $1–$3 USD
- Employee downtime per ticket: 2.4 hours average
- First-call resolution rate (manual): ~45% vs AI-assisted: ~78%

---

## 3. EXISTING SYSTEM

Current IT support systems used by enterprises include:

| System        | Type                  | Key Features                        | Limitations                        |
|---------------|-----------------------|-------------------------------------|------------------------------------|
| ServiceNow    | Enterprise ITSM       | ITIL workflows, CMDB, SLA tracking  | Expensive ($100+/user/mo), complex |
| Freshservice  | Cloud ITSM            | Ticket management, asset tracking   | No deep AI, limited NLP            |
| Zendesk       | Customer Support      | Chat, email, ticketing              | Not IT-focused, no device health   |
| Jira Service  | Dev-oriented ITSM     | Issue tracking, SLA                 | Complex UI, no AI chat             |
| Zoho Desk     | SMB Helpdesk          | Multi-channel, basic AI             | Limited enterprise scalability     |
| Manual Email  | Ad hoc                | Simple, zero cost                   | No tracking, no SLA, no analytics  |

**Common characteristics of existing systems:**
- Rule-based ticket routing (not AI-driven)
- No real-time device health monitoring
- No screenshot-based error diagnosis
- No voice input for ticket creation
- No predictive maintenance or failure forecasting
- Separate tools for chat, tickets, KB — not unified

---

## 4. LIMITATIONS OF EXISTING SYSTEM

1. **No Conversational AI:** Most systems use static forms, not natural language conversations.
2. **No Image/Screenshot Analysis:** Cannot diagnose errors from uploaded error screenshots.
3. **No Voice Input:** Users cannot speak their problem; must type long descriptions.
4. **No Device Telemetry:** No live CPU/RAM/temperature monitoring integrated with support.
5. **No Predictive Priority:** Priority is set manually — often incorrectly.
6. **Knowledge Base is Static:** Cannot be updated in real-time; solutions are outdated.
7. **No Feedback Loop:** User satisfaction data is not fed back into solution improvement.
8. **No Auto-Escalation:** Tickets must be manually escalated; no SLA breach automation.
9. **High Cost:** Enterprise solutions cost $50–$200/user/month.
10. **Poor Mobile UX:** Most ITSM tools are desktop-first; poor responsive design.
11. **No Unified Dashboard:** Engineers must switch between multiple tools.
12. **No Offline Fallback:** If AI/cloud is down, system stops working entirely.

---

## 5. PROPOSED SYSTEM

**Aura ITSM Enterprise** is a unified, AI-first IT Service Management platform that addresses
every limitation above through the following innovations:

### Core Innovations:
- **Conversational AI Agent** (Gemini 3.5 Flash) — handles natural language troubleshooting
- **Vision-Based Error Diagnosis** — screenshot uploaded → OCR + AI identifies error codes
- **Web Speech API Voice Input** — speak your problem, AI transcribes and processes it
- **Live Device Health Telemetry** — real-time CPU, RAM, temperature, battery monitoring
- **AI Diagnostic Reports** — Gemini generates full device health analysis on demand
- **Intelligent Issue Classification** — 8-category NLP classifier with fallback KB matching
- **Automated Ticket Generation** — tickets auto-created when AI cannot resolve the issue
- **Priority Prediction Engine** — keyword-based priority scoring (High/Medium/Low)
- **Engineer Assignment System** — admin can assign tickets to specialists
- **Knowledge Base CMS** — admin can add/delete solution workflows in real time
- **Multi-Role Access Control** — Employee (User) and Admin roles with scoped permissions
- **Feedback & Rating System** — 5-star session rating feeds into solution quality tracking
- **Offline KB Fallback** — symptom matching works even without Gemini API key
- **Step-by-Step Troubleshooting Progress Bar** — visual progress through solution steps

---

## 6. OBJECTIVES

### Primary Objectives:
1. Reduce average ticket resolution time from 24–72 hours to under 10 minutes via AI
2. Achieve 75%+ first-contact resolution rate through guided troubleshooting
3. Auto-classify 100% of incoming issues into defined IT categories without manual triage
4. Generate support tickets automatically when AI resolution fails
5. Provide real-time device health monitoring with AI-generated diagnostic reports
6. Enable voice-based issue reporting using Web Speech API
7. Support screenshot-based error diagnosis using Gemini Vision multimodal AI
8. Deliver a unified admin console for ticket, KB, and user management
9. Implement zero-downtime KB fallback for offline/no-API operation

### Secondary Objectives:
1. Collect and store user feedback ratings for continuous solution improvement
2. Provide admin analytics on ticket volume, resolution rates, and category distribution
3. Support Google OAuth simulation for enterprise SSO patterns
4. Enable custom port configuration for enterprise network environments
5. Maintain full audit trail of all chat sessions and ticket state changes

---

## 7. SCOPE OF THE PROJECT

### In Scope:
- User authentication (register, login, Google OAuth simulation)
- Profile management (name, email, user ID editing)
- AI-powered conversational troubleshooting (8 IT categories)
- Screenshot upload and Vision AI diagnosis
- Voice input via Web Speech API
- Live device telemetry dashboard (CPU, RAM, temperature, battery, ping)
- AI device health diagnostic report generation
- Automatic ticket creation on AI resolution failure
- Manual ticket creation by users
- Ticket management by admin (assign, close, reopen, priority)
- Knowledge base management (create, read, delete articles)
- Admin console: tickets, KB, users, chat log audit
- 5-star session feedback and rating
- Troubleshooting progress bar with step tracking
- Responsive dark-theme UI (Tailwind CSS)

### Out of Scope (Future Enhancements):
- Real-time push notifications (WebSocket/SSE)
- SLA breach auto-alerting
- CMDB (Configuration Management Database)
- Active Directory / LDAP integration
- Remote desktop support (RDP/VNC)
- Mobile native app (iOS/Android)
- Multi-language NLP support
- PostgreSQL/MongoDB production database (currently JSON file)
- Email notification system
- Billing and licensing module

---

## 8. FUNCTIONAL REQUIREMENTS

### FR-01: Authentication Module
- FR-01.1: System shall allow users to register with name, email, password (min 6 chars)
- FR-01.2: System shall validate email format using regex on both client and server
- FR-01.3: System shall prevent duplicate email registration
- FR-01.4: System shall assign ADMIN role if email contains "admin" keyword
- FR-01.5: System shall authenticate via email+password login
- FR-01.6: System shall support Google OAuth simulation with pre-set and custom accounts
- FR-01.7: System shall use Bearer token auth (user ID) for all protected API endpoints
- FR-01.8: System shall allow profile updates (name, email, user ID)
- FR-01.9: System shall persist sessions client-side via React state

### FR-02: Chat / AI Troubleshooting Module
- FR-02.1: Users shall be able to start new diagnostic chat sessions from dashboard
- FR-02.2: First message shall trigger NLP classification into one of 8 IT categories
- FR-02.3: If screenshot is attached, Vision AI shall analyze the image for error codes
- FR-02.4: System shall retrieve matching KB solution steps after classification
- FR-02.5: System shall present troubleshooting steps one at a time, awaiting user feedback
- FR-02.6: User can respond Yes/No (quick buttons or typed) to each step
- FR-02.7: On "Yes", session shall be marked "solved" and feedback prompt shown
- FR-02.8: On "No", system shall advance to next KB step
- FR-02.9: When all KB steps exhausted without resolution, system shall auto-create ticket
- FR-02.10: Ticket shall be auto-assigned priority (High/Medium/Low) based on keyword scoring
- FR-02.11: Voice input (Web Speech API) shall populate the chat input field
- FR-02.12: TTS (Text-to-Speech) speaker button shall read AI messages aloud
- FR-02.13: Progress bar shall visualize current step position within solution workflow
- FR-02.14: Session status shall transition: active → solved | escalated

### FR-03: Ticket Management Module
- FR-03.1: Tickets shall be auto-created by AI on escalation with category, priority, issue
- FR-03.2: Users shall be able to view their own tickets on dashboard
- FR-03.3: Admin shall see all tickets across all users
- FR-03.4: Admin shall be able to update ticket status (Open ↔ Closed)
- FR-03.5: Admin shall be able to assign tickets to named engineers
- FR-03.6: Admin shall be able to update ticket priority
- FR-03.7: Ticket IDs shall be generated in format tick-NNNN (4-digit numeric suffix)
- FR-03.8: Each ticket shall store: ID, userId, userName, issue, category, priority, status,
           assignedTo, createdAt

### FR-04: Knowledge Base Module
- FR-04.1: System shall ship with 6 default KB articles covering all 8 major IT categories
- FR-04.2: KB articles shall contain: category, title, symptoms[], solutionSteps[]
- FR-04.3: Admin shall be able to create new KB articles via modal form
- FR-04.4: Admin shall be able to delete existing KB articles
- FR-04.5: KB shall be accessible publicly (no auth) for FAQ display on dashboard
- FR-04.6: KB search shall filter by title, category, and symptoms simultaneously
- FR-04.7: KB matching shall use symptom keyword overlap scoring for best article selection

### FR-05: Device Health Monitoring Module
- FR-05.1: Dashboard shall display live CPU usage, RAM usage, CPU temperature, battery level
- FR-05.2: Telemetry values shall auto-refresh every 4 seconds with realistic simulation
- FR-05.3: Real hardware values shall be used where browser APIs support them
           (navigator.hardwareConcurrency, navigator.deviceMemory, Battery API)
- FR-05.4: System shall display alert banner when CPU > 85%, temp > 75°C, or RAM > 85%
- FR-05.5: "Run AI Diagnostics" button shall send metrics to Gemini for analysis
- FR-05.6: AI shall return a formatted Markdown diagnostic report with status, analysis,
           and optimization recommendations
- FR-05.7: Report shall display in a modal overlay with proper Markdown rendering

### FR-06: Admin Console Module
- FR-06.1: Admin-only console shall be accessible via header button or dashboard link
- FR-06.2: Console shall have 4 tabs: Support Tickets, Knowledge Base, User Directory,
           Troubleshoot Logs
- FR-06.3: Tickets tab shall show full table with assign/resolve/reopen actions
- FR-06.4: KB tab shall show all articles with delete and add-new functionality
- FR-06.5: Users tab shall show all registered users with role and access level
- FR-06.6: Logs tab shall show all chat sessions with outcome, message count, category
- FR-06.7: All admin actions shall be protected by role check (403 if non-admin)

### FR-07: Feedback Module
- FR-07.1: After session marked "solved", user shall be shown 1–5 star rating prompt
- FR-07.2: Selected rating shall be saved to the chat session record via API
- FR-07.3: Rating confirmation message shall display after submission
- FR-07.4: Admin logs tab shall display session rating where available

---

## 9. NON-FUNCTIONAL REQUIREMENTS

### Performance
- NFR-01: AI response latency shall be < 3 seconds for standard text classification
- NFR-02: Dashboard shall load all data (chats, tickets, KB) within 2 seconds
- NFR-03: Device telemetry shall update without page reload (polling interval: 4s)
- NFR-04: Application shall handle 50+ concurrent users without degradation (single server)

### Security
- NFR-05: All API endpoints (except /api/auth/* and /api/kb GET) shall require Bearer auth
- NFR-06: Admin-only endpoints shall return HTTP 403 for non-admin tokens
- NFR-07: Passwords shall not be returned in any API response
- NFR-08: Image uploads shall be validated for type (image/*) and size (< 2MB)
- NFR-09: Email format shall be validated server-side with regex before DB write
- NFR-10: Duplicate email and user ID checks shall prevent data integrity issues

### Reliability
- NFR-11: System shall fall back to local KB symptom matching if Gemini API is unavailable
- NFR-12: AI diagnostic reports shall return a simulated offline report if API key missing
- NFR-13: Database (db.json) shall be written atomically to prevent corruption
- NFR-14: Server startup shall succeed even without GEMINI_API_KEY (graceful degradation)

### Usability
- NFR-15: Application shall be fully responsive on screens from 320px to 2560px wide
- NFR-16: All interactive elements shall have hover states and focus rings
- NFR-17: Color contrast ratio shall meet WCAG AA (4.5:1) for all text/background pairs
- NFR-18: Quick Yes/No answer buttons shall appear when system awaits step feedback
- NFR-19: All error states shall display user-friendly messages (no raw stack traces)

### Maintainability
- NFR-20: All API routes shall follow RESTful conventions
- NFR-21: TypeScript strict types shall be used across all frontend and backend code
- NFR-22: DB schema shall support migration to PostgreSQL without logic changes
- NFR-23: KB articles shall be configurable without code changes (admin UI or db.json)

### Scalability
- NFR-24: Backend architecture shall be stateless and horizontally scalable
- NFR-25: DB layer shall be abstracted behind a ServerDatabase class for easy swap
- NFR-26: Docker containerization shall enable deployment on any cloud provider

---

## 10. USER ROLES

### Role 1: Employee (User)
**Description:** Any employee in the organization who needs IT support.
**Access Level:** Standard
**Permissions:**
- Register and login to the system
- Edit own profile (name, email, user ID)
- Start new troubleshooting chat sessions
- Upload screenshots for AI diagnosis
- Use voice input for problem description
- View own chat history and session status
- View own support tickets
- Submit feedback/rating after resolution
- Browse Knowledge Base FAQ (read-only)
- View live device health telemetry

**Cannot:**
- View other users' tickets or chats
- Access admin console
- Create/delete KB articles
- Assign tickets to engineers
- View all users list

### Role 2: IT Admin (Admin)
**Description:** IT Support Team Lead or System Administrator.
**Access Level:** Full
**Permissions:** Everything the Employee can do, PLUS:
- Access the full Admin Console
- View ALL tickets from ALL users
- Update ticket status (Open/Closed)
- Assign tickets to named engineers
- Update ticket priority
- Create new Knowledge Base articles
- Delete Knowledge Base articles
- View complete User Directory
- Audit all troubleshooting session logs
- View system version information

**Admin Detection:** Email containing "admin" keyword automatically receives Admin role.
**Default Admin Account:** admin@support.com / admin123

### Role 3: Support Engineer (Planned — Future Enhancement)
**Description:** Specialist assigned to handle escalated tickets.
**Planned Permissions:**
- View assigned tickets only
- Update ticket status and add resolution notes
- Access relevant KB articles
- Internal messaging with ticket reporter

### Role 4: Team Lead (Planned — Future Enhancement)
**Description:** Manages a team of support engineers.
**Planned Permissions:**
- All engineer permissions
- Reassign tickets between engineers
- View team SLA performance dashboard
- Approve KB article publications

---

## 11. COMPLETE SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AURA ITSM ENTERPRISE ARCHITECTURE               │
└─────────────────────────────────────────────────────────────────────┘

  CLIENT LAYER (Browser)
  ┌──────────────────────────────────────────────────────────┐
  │  React 19 + TypeScript + Tailwind CSS + Motion/React     │
  │  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐  │
  │  │  Login   │ │ Dashboard │ │  Chat    │ │  Admin   │  │
  │  │Component │ │Component  │ │Interface │ │  Panel   │  │
  │  └──────────┘ └───────────┘ └──────────┘ └──────────┘  │
  │  ┌────────────────────────────────────────────────────┐  │
  │  │  Browser APIs: SpeechRecognition, SpeechSynthesis, │  │
  │  │  Battery API, navigator.hardwareConcurrency,       │  │
  │  │  FileReader (image → base64)                       │  │
  │  └────────────────────────────────────────────────────┘  │
  └──────────────────────────┬───────────────────────────────┘
                             │ HTTP/REST (Bearer Auth)
  ┌──────────────────────────▼───────────────────────────────┐
  │            APPLICATION LAYER (Node.js / Express)         │
  │                                                          │
  │  ┌─────────────────────────────────────────────────┐    │
  │  │              REST API Router                    │    │
  │  │  /api/auth/*  /api/chats/*  /api/tickets/*      │    │
  │  │  /api/kb/*    /api/admin/*  /api/diagnose-health│    │
  │  └──────────────────┬──────────────────────────────┘    │
  │                     │                                    │
  │  ┌──────────────────▼──────────────────────────────┐    │
  │  │              Business Logic Layer               │    │
  │  │  ┌───────────┐ ┌──────────┐ ┌───────────────┐  │    │
  │  │  │   Auth    │ │  Chat/AI │ │  Ticket/KB    │  │    │
  │  │  │  Service  │ │ Workflow │ │   Manager     │  │    │
  │  │  └───────────┘ └────┬─────┘ └───────────────┘  │    │
  │  └───────────────────── │ ──────────────────────────┘   │
  │                         │                               │
  │  ┌──────────────────────▼──────────────────────────┐   │
  │  │           AI/NLP Integration Layer              │   │
  │  │  ┌──────────────────┐  ┌─────────────────────┐  │   │
  │  │  │ Gemini 3.5 Flash │  │  Local KB Fallback  │  │   │
  │  │  │ (Text + Vision)  │  │  Symptom Matcher    │  │   │
  │  │  └──────────────────┘  └─────────────────────┘  │   │
  │  └─────────────────────────────────────────────────┘   │
  └──────────────────────────┬───────────────────────────────┘
                             │
  ┌──────────────────────────▼───────────────────────────────┐
  │              PERSISTENCE LAYER                           │
  │  ┌────────────────────────────────────────────────────┐  │
  │  │  ServerDatabase Class (db.json)                    │  │
  │  │  Collections: users | chats | kb | tickets         │  │
  │  └────────────────────────────────────────────────────┘  │
  │  (Swappable with PostgreSQL/MongoDB via same interface)  │
  └──────────────────────────────────────────────────────────┘

  EXTERNAL SERVICES
  ┌──────────────────────────────────────────────────────────┐
  │  Google Gemini API (gemini-3.5-flash)                    │
  │  - Text generation (classification, troubleshooting)     │
  │  - Vision/multimodal (screenshot error analysis)         │
  │  - Device health report generation                       │
  └──────────────────────────────────────────────────────────┘
```

---

## 12. ENTERPRISE WORKFLOW DIAGRAM

```
EMPLOYEE                    AI AGENT                    ADMIN/ENGINEER
    │                           │                              │
    │──── Login / Register ────►│                              │
    │◄─── Auth Token ───────────│                              │
    │                           │                              │
    │──── Describe Problem ────►│                              │
    │    (text/voice/image)      │                              │
    │                           │── NLP Classification ──►    │
    │                           │   (Gemini / KB fallback)    │
    │                           │                              │
    │                           │── Retrieve KB Steps ──►     │
    │◄─── Step 1 Presented ─────│                              │
    │                           │                              │
    │──── "No, still broken" ──►│                              │
    │◄─── Step 2 Presented ─────│                              │
    │                           │                              │
    │──── "Yes, fixed!" ────────►│                              │
    │◄─── Session = SOLVED ─────│                              │
    │◄─── Rating Prompt ────────│                              │
    │──── 5 Stars ─────────────►│                              │
    │                           │                              │
    │  OR (if all steps fail):  │                              │
    │                           │── Auto-Create Ticket ──────►│
    │◄─── Ticket ID Created ────│   (priority scored)          │
    │                           │                              │
    │                           │                ┌─────────────│
    │                           │                │ Assign Eng  │
    │                           │                │ Update KB   │
    │                           │                │ Close Ticket│
    │◄─────────────────── Ticket Resolved ───────┘             │
    │                           │                              │
    │──── Run AI Diagnostics ──►│                              │
    │   (send device metrics)   │── Gemini Health Analysis ──►│
    │◄─── Markdown Report ──────│                              │
```

---

## 13. AI WORKFLOW

```
USER INPUT (text | voice | image)
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                 INTENT DETECTION LAYER                  │
│                                                         │
│  Is this the first message in session?                  │
│  YES → Trigger Classification Pipeline                  │
│  NO  → Trigger Feedback Parsing Pipeline                │
└────────────────┬──────────────────┬────────────────────┘
                 │                  │
       FIRST MSG │                  │ FOLLOW-UP MSG
                 ▼                  ▼
  ┌──────────────────┐    ┌──────────────────────────────┐
  │ IMAGE ATTACHED?  │    │  FEEDBACK CLASSIFICATION     │
  │                  │    │                              │
  │  YES → Vision AI │    │  Gemini: "yes/no/unclear"    │
  │  (gemini-3.5)    │    │  OR Local keyword parser:    │
  │  OCR + Analysis  │    │  yes-words[] / no-words[]    │
  │                  │    │                              │
  │  NO → Text NLP   │    │  Result: "yes" | "no"        │
  │  Classification  │    └─────────────┬────────────────┘
  └──────────┬───────┘                  │
             │                          │
             ▼                    ┌─────▼────────────────┐
  ┌────────────────────────┐      │  YES → Mark SOLVED   │
  │  CATEGORY OUTPUT       │      │  NO  → Next Step     │
  │  (one of 8 categories) │      │  ALL STEPS DONE →    │
  │  + symptoms[]          │      │  Auto-Create Ticket  │
  │  + solutionSteps[]     │      │  (Priority Scored)   │
  └──────────┬─────────────┘      └──────────────────────┘
             │
             ▼
  ┌────────────────────────┐
  │  KB MATCHING ENGINE    │
  │  1. Category match     │
  │  2. Symptom overlap    │
  │  3. Best article score │
  │  4. Extract steps[]    │
  └──────────┬─────────────┘
             │
             ▼
  ┌────────────────────────┐
  │  RESPONSE GENERATION   │
  │  Present Step N        │
  │  "Did this work? Y/N"  │
  └────────────────────────┘
```

### AI Models Used:
| Task                         | Model               | Input Type    | Output         |
|------------------------------|---------------------|---------------|----------------|
| Issue Classification         | gemini-3.5-flash    | Text          | JSON: category |
| Screenshot Diagnosis         | gemini-3.5-flash    | Image + Text  | JSON: steps    |
| Feedback Interpretation      | gemini-3.5-flash    | Text          | yes/no/unclear |
| Device Health Report         | gemini-3.5-flash    | Text (metrics)| Markdown       |
| Local Fallback Classification| Keyword Overlap     | Text          | Category       |
| Local Fallback Feedback      | Regex/Word List     | Text          | yes/no         |

---

## 14. USER JOURNEY

### Journey 1: Successful Self-Service Resolution
```
1. Employee opens browser → http://localhost:3000
2. Sees Login screen → enters user@support.com / user123
3. Lands on Dashboard → sees welcome message, live telemetry, ticket list
4. Clicks "Start Diagnostic Chat"
5. Chat opens with bot greeting
6. Types: "My laptop is overheating and fan making loud noise"
7. AI classifies → Hardware Issues → loads overheating KB steps
8. Bot: "Step 1: Place laptop on flat surface..."
9. User clicks [No, still not working]
10. Bot: "Step 2: Clear dust from vents..."
11. User clicks [Yes, that worked!]
12. Session marked SOLVED → 5-star rating prompt appears
13. User selects 4 stars → confirmation shown
14. User returns to Dashboard → session shows "solved" status
```

### Journey 2: Escalation to Human Engineer
```
1-7. Same as above
8-10. User clicks NO through all 5 steps without resolution
11. AI creates Support Ticket automatically
    → Ticket ID: #tick-5823 | Category: Hardware | Priority: Medium
12. Bot: "I've created ticket #tick-5823. An engineer will contact you."
13. User returns to Dashboard → ticket visible in "Support Tickets" section
14. Admin logs in → admin@support.com / admin123
15. Goes to Admin Console → Tickets tab
16. Sees ticket, assigns to "Hardware Engineer"
17. Updates priority to "High"
18. Marks ticket "Closed" after resolution
19. User refreshes dashboard → ticket shows Closed
```

### Journey 3: Screenshot-Based Diagnosis
```
1. User starts new chat
2. Clicks the paperclip icon (screenshot upload)
3. Selects image of BSOD (Blue Screen of Death)
4. Types: "My computer crashed with this error"
5. Vision AI analyzes image → reads error code (e.g., DRIVER_IRQL_NOT_LESS_OR_EQUAL)
6. AI generates custom step-by-step fix specific to that BSOD code
7. Title becomes "Screen-Diagnosed: Operating System Issues"
8. User follows steps → resolves with step 3
```

### Journey 4: Voice Input Flow
```
1. User starts chat
2. Clicks microphone icon
3. Speaks: "Internet not working, WiFi shows connected but no pages load"
4. Speech recognized → text populated in input field
5. User clicks Send
6. AI classifies as Network Issues → loads WiFi troubleshooting
7. User proceeds through steps
```

### Journey 5: Admin Knowledge Base Update
```
1. Admin logs in → goes to Admin Console
2. Clicks "Knowledge Base Solutions" tab
3. Clicks "New Solution Article"
4. Fills: Category=Software Issues, Title="Fix Microsoft Teams crashes"
5. Symptoms: "teams, crash, freeze, call drop"
6. Steps: (line-by-line solution steps)
7. Clicks "Publish Solution"
8. New article immediately appears in KB grid
9. Next user mentioning "teams crash" will get matched to this new article
```

---

## 15. COMPLETE MODULE DESCRIPTIONS

### MODULE 1: Authentication

**Purpose:** Secures system access, manages user identity, and enforces role-based access.

**Inputs:** name, email, password (register) | email, password (login) | googleId, name, email (Google)

**Outputs:** User object {id, name, email, role} | Error messages

**Internal Working:**
1. Registration: validate inputs → check duplicate email → assign role → store in db.users
2. Login: find user by email → compare passwordHash → return user object (no hash)
3. Google: find or create user by email → return user object
4. All subsequent requests: extract userId from Authorization header → db.getUser(userId)
5. Admin check: req.user.role === UserRole.ADMIN

**Database Table: users**
```
Field         Type      Description
────────────────────────────────────────────────────
id            string    Unique user ID (usr-xxxxxxx)
name          string    Full name
email         string    Email address (unique)
role          enum      "admin" | "user"
passwordHash  string    Plaintext in demo; bcrypt in prod
```

**Security Notes:**
- In production: use bcrypt for password hashing
- In production: issue JWT tokens instead of raw user ID as Bearer token
- In production: implement HTTPS, rate limiting, CSRF protection

---

### MODULE 2: Employee Portal / Dashboard

**Purpose:** Central hub for employees to access all support features and view their status.

**Inputs:** User object, API responses (chats, tickets, kb), browser device APIs

**Outputs:** Rendered UI with live data, actions that trigger API calls

**Internal Working:**
1. On mount: parallel fetch of /api/chats, /api/tickets, /api/kb
2. Device telemetry: reads navigator.hardwareConcurrency, navigator.deviceMemory, Battery API
3. Simulates CPU/RAM/temp/ping with setInterval(4000ms) random walk within realistic ranges
4. Alert banner: computed from current metric values crossing thresholds
5. Profile edit: POST /api/auth/profile with updated fields
6. New chat: POST /api/chats → navigates to ChatInterface with new chatId

**Sections:**
- Welcome hero (name, role badge, actions)
- Profile card (user info, edit form, diagnostic port setting)
- Previous Chat History (sorted by date, filterable by status)
- Support Tickets (own tickets only, priority/status badges)
- Live Telemetry panel (CPU, RAM, temp, battery, ping, AI diagnostics button)
- Knowledge Base FAQ (searchable, expandable, all 8 categories)

---

### MODULE 3: AI Chatbot Interface

**Purpose:** Conversational interface for guided troubleshooting; primary value driver.

**Inputs:** User text, optional base64 image, chat session state

**Outputs:** AI/KB response messages, updated session status, auto-created tickets

**Internal Working:**
1. User sends message → POST /api/chats/:id/messages {text, image}
2. Server checks chat.category:
   - If null → trigger classification pipeline (Module 4)
   - If set → trigger feedback pipeline (Module 6)
3. Append user message to chat.messages[]
4. Generate AI reply and append to chat.messages[]
5. Save updated chat to db
6. Return {chat, mode} where mode = "ai" | "fallback"

**UI Components:**
- Top header: title, status indicator, category, chat ID, mode badge
- Progress bar: current step / total steps
- Message list: bot (gold avatar, left) vs user (user avatar, right)
- Image preview in message bubble (if screenshot sent)
- TTS speaker button on each bot message
- Yes/No quick reply buttons when awaiting step feedback
- Screenshot upload button (Paperclip icon)
- Microphone button with live listening indicator
- Status zones: Solved (green), Escalated (red ticket banner)
- 5-star rating widget (post-solve only)

---

### MODULE 4: NLP Engine & Intent Detection

**Purpose:** Understands natural language input and classifies into actionable IT category.

**Inputs:** User's first message text + optional screenshot image

**Outputs:** {category, symptoms[], reason, solutionSteps[]}

**Internal Working (with Gemini API):**
```
Prompt → "Classify this IT issue into one of 8 categories.
          Extract symptom keywords.
          Return JSON: {category, symptoms[], reason}"
Gemini Response → parsed JSON → stored in chat.category, chat.symptoms
```

**Internal Working (without Gemini / fallback):**
```
For each KB article:
  count = symptoms that appear in user text
  track max-overlap article
Best match category → assigned to chat.category
```

**The 8 IT Categories:**
1. Network Issues
2. Software Issues
3. Hardware Issues
4. Operating System Issues
5. Performance Issues
6. Security Issues
7. Account Issues
8. Printer Issues

---

### MODULE 5: Knowledge Base

**Purpose:** Structured repository of IT solutions; powers AI troubleshooting engine.

**Inputs:** Admin CRUD operations, NLP classification results (for lookup)

**Outputs:** Matching KnowledgeBaseItem with solutionSteps[]

**Internal Working:**
1. All KB articles stored in db.kb as Record<string, KnowledgeBaseItem>
2. Lookup: find article where category matches OR symptoms overlap with user text
3. Return solutionSteps[] → assigned to chat.troubleshootingSteps[]
4. Admin can add/delete articles live (no restart required)

**Database Table: kb**
```
Field          Type       Description
──────────────────────────────────────────────────────
id             string     KB item ID (kb-xxxxxxx)
category       string     One of 8 IT categories
title          string     Human-readable article title
symptoms       string[]   Keyword triggers for matching
solutionSteps  string[]   Ordered array of fix steps
```

---

### MODULE 6: Troubleshooting Engine

**Purpose:** Drives the step-by-step interactive resolution workflow.

**Inputs:** Chat session (category, steps, currentStepIndex), user feedback text

**Outputs:** Next step message OR solve confirmation OR ticket creation

**Internal Working:**
```
LOOP:
  Present steps[currentStepIndex] to user
  Await user response
  Parse response (AI or local keyword list)

  IF "yes":
    chat.status = "solved"
    return congratulation message + rating prompt

  IF "no":
    currentStepIndex++
    IF currentStepIndex < steps.length:
      Present next step
    ELSE:
      chat.status = "escalated"
      createTicket(userId, category, priority, issue)
      return escalation message with ticket ID
```

---

### MODULE 7: Ticket Management

**Purpose:** Formal tracking system for unresolved IT issues requiring human intervention.

**Inputs:** Escalated chat context (auto) or manual creation (future)

**Outputs:** Ticket object with ID, status, assignments

**Priority Scoring Logic:**
```
keywords in (category + message):
  "crash", "blue screen", "bsod", "security", "virus"  → HIGH
  "offline", "internet", "wifi", "network"              → MEDIUM
  (default)                                              → LOW
```

**Database Table: tickets**
```
Field       Type                  Description
──────────────────────────────────────────────────────────────
id          string                Format: tick-NNNN
userId      string                Owner user ID
userName    string                Owner display name
issue       string                Problem description
category    string                IT category
priority    "Low"|"Medium"|"High" Auto-scored priority
status      "Open"|"Closed"       Lifecycle status
assignedTo  string (optional)     Engineer name
createdAt   ISO timestamp         Creation time
```

---

### MODULE 8: Device Health Monitoring

**Purpose:** Real-time visibility into device performance to proactively identify issues.

**Inputs:** Browser device APIs (hardwareConcurrency, deviceMemory, getBattery)

**Outputs:** Live metric display, threshold alerts, AI diagnostic report

**Metrics Tracked:**
- CPU Core Count (navigator.hardwareConcurrency)
- Device Memory GB (navigator.deviceMemory)
- CPU Usage % (simulated with realistic random walk)
- RAM Usage % (simulated with realistic random walk)
- CPU Temperature °C (simulated, escalates with high CPU)
- Battery Level % (Battery API if supported, else simulated)
- Network Ping ms (simulated)
- Disk Health (string: "Optimal" | "Warning" | "Critical")

**Alert Thresholds:**
- CPU Usage > 85% → Warning Banner
- CPU Temp > 75°C → Warning Banner
- RAM Usage > 85% → Warning Banner

**AI Diagnostic Report Sections:**
1. System Health Status Overview (EXCELLENT / WARNING / CRITICAL rating)
2. Detailed Resource Analysis (explain each metric in plain English)
3. Proactive Optimization Guidelines (actionable steps based on current values)

---

### MODULE 9: Analytics Dashboard (Admin)

**Purpose:** Operational visibility for IT management and performance tracking.

**Current Implementation (v1):** Admin Console tabs provide:
- Ticket volume, status, category breakdown (visual table)
- Chat session outcomes (solved %, escalated %, active %)
- User directory (total users, role distribution)
- Session message counts (engagement proxy)

**Planned v2 Enhancements:**
- Bar chart: tickets by category
- Line chart: daily ticket volume trend
- Pie chart: resolution outcomes (solved vs escalated)
- SLA compliance gauge
- Average resolution time metric
- Top recurring issues word cloud

---

### MODULE 10: Security Module

**Purpose:** Protects data integrity, prevents unauthorized access, maintains audit trail.

**Current Implementation:**
- Bearer token authentication (userId as token)
- Role-based access control (ADMIN vs USER)
- Server-side email format validation
- Server-side password length validation
- Image upload size validation (< 2MB)
- HTTP 401/403 responses for unauthorized requests
- Admin role check on all admin-scoped endpoints
- No password in API responses

**Production Security Requirements (Future):**
- Bcrypt password hashing (cost factor 12+)
- JWT tokens with expiry (15min access + 7day refresh)
- HTTPS/TLS (Let's Encrypt)
- Rate limiting (express-rate-limit)
- Helmet.js security headers
- CORS whitelist
- Input sanitization (DOMPurify for XSS)
- SQL injection prevention (parameterized queries)
- Audit log table (all writes with userId + timestamp)
- Session invalidation on logout

---

## 16. COMPLETE DATABASE DESIGN (20+ Tables)

### Current Implementation (JSON / db.json)

#### Table 1: users
```sql
CREATE TABLE users (
  id            VARCHAR(50)  PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  role          ENUM('admin','user') DEFAULT 'user',
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Table 2: chat_sessions
```sql
CREATE TABLE chat_sessions (
  id                    VARCHAR(50)  PRIMARY KEY,
  user_id               VARCHAR(50)  NOT NULL REFERENCES users(id),
  title                 VARCHAR(500) NOT NULL,
  category              VARCHAR(100),
  status                ENUM('active','solved','escalated') DEFAULT 'active',
  ticket_id             VARCHAR(50)  REFERENCES tickets(id),
  current_step_index    INTEGER      DEFAULT 0,
  symptoms              TEXT,
  rating                SMALLINT     CHECK (rating BETWEEN 1 AND 5),
  created_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Table 3: chat_messages
```sql
CREATE TABLE chat_messages (
  id              VARCHAR(50)  PRIMARY KEY,
  chat_session_id VARCHAR(50)  NOT NULL REFERENCES chat_sessions(id),
  sender          ENUM('user','assistant') NOT NULL,
  message_text    TEXT         NOT NULL,
  image_base64    LONGTEXT,
  sent_at         TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 4: tickets
```sql
CREATE TABLE tickets (
  id            VARCHAR(50)   PRIMARY KEY,
  user_id       VARCHAR(50)   NOT NULL REFERENCES users(id),
  user_name     VARCHAR(200)  NOT NULL,
  issue         TEXT          NOT NULL,
  category      VARCHAR(100)  NOT NULL,
  priority      ENUM('Low','Medium','High') DEFAULT 'Low',
  status        ENUM('Open','Closed') DEFAULT 'Open',
  assigned_to   VARCHAR(200),
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Table 5: knowledge_base
```sql
CREATE TABLE knowledge_base (
  id          VARCHAR(50)  PRIMARY KEY,
  category    VARCHAR(100) NOT NULL,
  title       VARCHAR(500) NOT NULL,
  created_by  VARCHAR(50)  REFERENCES users(id),
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  is_active   BOOLEAN      DEFAULT TRUE
);
```

#### Table 6: kb_symptoms
```sql
CREATE TABLE kb_symptoms (
  id      INTEGER     PRIMARY KEY AUTO_INCREMENT,
  kb_id   VARCHAR(50) NOT NULL REFERENCES knowledge_base(id),
  keyword VARCHAR(200) NOT NULL
);
```

#### Table 7: kb_solution_steps
```sql
CREATE TABLE kb_solution_steps (
  id          INTEGER     PRIMARY KEY AUTO_INCREMENT,
  kb_id       VARCHAR(50) NOT NULL REFERENCES knowledge_base(id),
  step_order  INTEGER     NOT NULL,
  step_text   TEXT        NOT NULL
);
```

#### Table 8: chat_troubleshooting_steps
```sql
CREATE TABLE chat_troubleshooting_steps (
  id          INTEGER     PRIMARY KEY AUTO_INCREMENT,
  chat_id     VARCHAR(50) NOT NULL REFERENCES chat_sessions(id),
  step_order  INTEGER     NOT NULL,
  step_text   TEXT        NOT NULL
);
```

#### Table 9: device_telemetry_snapshots
```sql
CREATE TABLE device_telemetry_snapshots (
  id             INTEGER     PRIMARY KEY AUTO_INCREMENT,
  user_id        VARCHAR(50) NOT NULL REFERENCES users(id),
  cpu_usage      FLOAT,
  ram_usage      FLOAT,
  cpu_temp       FLOAT,
  battery_level  FLOAT,
  ping_ms        INTEGER,
  disk_health    VARCHAR(50),
  cpu_cores      INTEGER,
  device_memory  FLOAT,
  captured_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 10: diagnostic_reports
```sql
CREATE TABLE diagnostic_reports (
  id           INTEGER     PRIMARY KEY AUTO_INCREMENT,
  user_id      VARCHAR(50) NOT NULL REFERENCES users(id),
  snapshot_id  INTEGER     REFERENCES device_telemetry_snapshots(id),
  report_text  LONGTEXT    NOT NULL,
  generated_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  ai_model     VARCHAR(100) DEFAULT 'gemini-3.5-flash'
);
```

#### Table 11: user_sessions (future JWT)
```sql
CREATE TABLE user_sessions (
  id             VARCHAR(100) PRIMARY KEY,
  user_id        VARCHAR(50)  NOT NULL REFERENCES users(id),
  refresh_token  TEXT         NOT NULL,
  ip_address     VARCHAR(45),
  user_agent     TEXT,
  expires_at     TIMESTAMP    NOT NULL,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  revoked_at     TIMESTAMP
);
```

#### Table 12: audit_logs
```sql
CREATE TABLE audit_logs (
  id          INTEGER     PRIMARY KEY AUTO_INCREMENT,
  user_id     VARCHAR(50) REFERENCES users(id),
  action      VARCHAR(200) NOT NULL,
  entity_type VARCHAR(100),
  entity_id   VARCHAR(100),
  old_value   JSON,
  new_value   JSON,
  ip_address  VARCHAR(45),
  created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 13: engineers
```sql
CREATE TABLE engineers (
  id           VARCHAR(50)  PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  speciality   VARCHAR(200),
  is_available BOOLEAN      DEFAULT TRUE,
  max_tickets  INTEGER      DEFAULT 10,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 14: ticket_assignments
```sql
CREATE TABLE ticket_assignments (
  id            INTEGER     PRIMARY KEY AUTO_INCREMENT,
  ticket_id     VARCHAR(50) NOT NULL REFERENCES tickets(id),
  engineer_id   VARCHAR(50) REFERENCES engineers(id),
  engineer_name VARCHAR(200),
  assigned_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  assigned_by   VARCHAR(50) REFERENCES users(id)
);
```

#### Table 15: sla_policies
```sql
CREATE TABLE sla_policies (
  id                   INTEGER     PRIMARY KEY AUTO_INCREMENT,
  name                 VARCHAR(200) NOT NULL,
  priority             ENUM('Low','Medium','High') NOT NULL,
  response_time_hours  INTEGER     NOT NULL,
  resolution_time_hours INTEGER    NOT NULL,
  escalation_hours     INTEGER     NOT NULL,
  is_active            BOOLEAN     DEFAULT TRUE
);
```

#### Table 16: notifications
```sql
CREATE TABLE notifications (
  id           INTEGER     PRIMARY KEY AUTO_INCREMENT,
  user_id      VARCHAR(50) NOT NULL REFERENCES users(id),
  type         VARCHAR(100) NOT NULL,
  title        VARCHAR(500) NOT NULL,
  body         TEXT,
  is_read      BOOLEAN      DEFAULT FALSE,
  entity_type  VARCHAR(100),
  entity_id    VARCHAR(100),
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 17: categories
```sql
CREATE TABLE categories (
  id          INTEGER     PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(200) UNIQUE NOT NULL,
  icon        VARCHAR(100),
  description TEXT,
  is_active   BOOLEAN     DEFAULT TRUE
);
```

#### Table 18: feedback_surveys
```sql
CREATE TABLE feedback_surveys (
  id              INTEGER     PRIMARY KEY AUTO_INCREMENT,
  chat_session_id VARCHAR(50) UNIQUE REFERENCES chat_sessions(id),
  rating          SMALLINT    CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  submitted_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 19: ai_classification_logs
```sql
CREATE TABLE ai_classification_logs (
  id             INTEGER      PRIMARY KEY AUTO_INCREMENT,
  chat_id        VARCHAR(50)  NOT NULL REFERENCES chat_sessions(id),
  input_text     TEXT         NOT NULL,
  has_image      BOOLEAN      DEFAULT FALSE,
  output_category VARCHAR(100),
  output_symptoms JSON,
  ai_model       VARCHAR(100),
  latency_ms     INTEGER,
  fallback_used  BOOLEAN      DEFAULT FALSE,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 20: predictive_alerts
```sql
CREATE TABLE predictive_alerts (
  id             INTEGER      PRIMARY KEY AUTO_INCREMENT,
  user_id        VARCHAR(50)  NOT NULL REFERENCES users(id),
  alert_type     VARCHAR(200) NOT NULL,
  severity       ENUM('info','warning','critical') DEFAULT 'info',
  metric_name    VARCHAR(100),
  metric_value   FLOAT,
  threshold      FLOAT,
  message        TEXT,
  is_resolved    BOOLEAN      DEFAULT FALSE,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  resolved_at    TIMESTAMP
);
```

#### Table 21: knowledge_base_versions
```sql
CREATE TABLE knowledge_base_versions (
  id           INTEGER     PRIMARY KEY AUTO_INCREMENT,
  kb_id        VARCHAR(50) NOT NULL REFERENCES knowledge_base(id),
  version      INTEGER     NOT NULL,
  changed_by   VARCHAR(50) REFERENCES users(id),
  change_notes TEXT,
  snapshot     JSON        NOT NULL,
  created_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 22: system_settings
```sql
CREATE TABLE system_settings (
  key         VARCHAR(200) PRIMARY KEY,
  value       TEXT         NOT NULL,
  data_type   VARCHAR(50)  DEFAULT 'string',
  description TEXT,
  updated_by  VARCHAR(50)  REFERENCES users(id),
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 17. ER DIAGRAM

```
┌─────────┐       ┌──────────────┐       ┌─────────────┐
│  users  │──────<│ chat_sessions│──────<│chat_messages│
│─────────│  1:N  │──────────────│  1:N  │─────────────│
│ id (PK) │       │ id (PK)      │       │ id (PK)     │
│ name    │       │ user_id (FK) │       │ session_id  │
│ email   │       │ title        │       │ sender      │
│ role    │       │ category     │       │ message_text│
│ pwd_hash│       │ status       │       │ image_b64   │
└─────────┘       │ ticket_id(FK)│       │ sent_at     │
    │             │ rating       │       └─────────────┘
    │ 1:N         └──────────────┘
    │                    │ 1:1
    │             ┌──────▼──────┐
    │             │   tickets   │
    │ 1:N         │─────────────│
    ▼             │ id (PK)     │
┌──────────────┐  │ user_id(FK) │
│device_teleme.│  │ issue       │
│─────────────-│  │ category    │
│ id (PK)      │  │ priority    │
│ user_id (FK) │  │ status      │
│ cpu_usage    │  │ assigned_to │
│ ram_usage    │  └─────────────┘
│ cpu_temp     │
│ battery      │       ┌──────────────────┐
│ captured_at  │       │  knowledge_base  │
└──────────────┘       │──────────────────│
    │ 1:N              │ id (PK)          │
    ▼                  │ category         │
┌──────────────┐       │ title            │
│  diagnostic  │       └────────┬─────────┘
│  _reports    │                │ 1:N
│─────────────-│       ┌────────▼─────────┐
│ id (PK)      │       │   kb_symptoms    │
│ user_id (FK) │       │──────────────────│
│ report_text  │       │ id (PK)          │
│ generated_at │       │ kb_id (FK)       │
└──────────────┘       │ keyword          │
                       └──────────────────┘
                       ┌──────────────────┐
                       │ kb_solution_steps│
                       │──────────────────│
                       │ id (PK)          │
                       │ kb_id (FK)       │
                       │ step_order       │
                       │ step_text        │
                       └──────────────────┘
```

---

## 18. DATA FLOW DIAGRAMS

### Level 0 — Context DFD
```
                    ┌────────────┐
  EMPLOYEE ────────►│            │────────► TICKET RECORD
                    │   AURA     │
  ADMIN ───────────►│   ITSM     │────────► KB ARTICLE
                    │  SYSTEM    │
  GEMINI API ───────►│            │────────► DIAGNOSTIC REPORT
                    └────────────┘
                         │
                    db.json / DB
```

### Level 1 — Main Processes
```
┌──────────┐         ┌────────────────────┐         ┌──────────────┐
│          │─register►│ 1.0 AUTHENTICATION │─user──► │              │
│ EMPLOYEE │─login──►│     MODULE         │         │   USERS DB   │
│          │◄─token──│                    │◄─lookup─│              │
└──────────┘         └────────────────────┘         └──────────────┘

┌──────────┐         ┌────────────────────┐         ┌──────────────┐
│          │─message►│  2.0 CHAT / NLP    │─query──►│   KB DB      │
│ EMPLOYEE │         │    PIPELINE        │─write──►│   CHAT DB    │
│          │◄─reply──│                    │         └──────────────┘
└──────────┘         │                    │─call───►┌──────────────┐
                     └────────────────────┘         │  GEMINI API  │
                                                    └──────────────┘

┌──────────┐         ┌────────────────────┐         ┌──────────────┐
│ AI AGENT │─create─►│  3.0 TICKET        │─write──►│  TICKETS DB  │
│          │         │    MANAGEMENT      │         └──────────────┘
└──────────┘         └────────────────────┘
┌──────────┐              ▲
│  ADMIN   │─update────────┘
└──────────┘

┌──────────┐         ┌────────────────────┐         ┌──────────────┐
│ BROWSER  │─metrics►│  4.0 DEVICE HEALTH │─call───►│  GEMINI API  │
│ APIS     │         │    DIAGNOSTICS     │◄─report─│              │
└──────────┘         └────────────────────┘         └──────────────┘
```

### Level 2 — Chat/NLP Pipeline Expanded
```
USER MESSAGE
     │
     ▼
┌─────────────────┐
│ 2.1 Validate    │──── check chat status (active/solved/escalated)
│     Session     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2.2 Check       │──── is chat.category null?
│     Category    │
└────┬────────────┘
     │ YES (first msg)        │ NO (follow-up)
     ▼                        ▼
┌────────────────┐    ┌────────────────────┐
│ 2.3 IMAGE      │    │ 2.5 FEEDBACK       │
│ PRESENT?       │    │ CLASSIFICATION     │
│                │    │ (AI or keyword)    │
│ YES → Vision   │    └─────────┬──────────┘
│ NO  → Text NLP │              │
└───────┬────────┘         yes  │  no
        │               ┌───────┘   └────────────┐
        ▼               ▼                        ▼
┌───────────────┐  ┌──────────┐         ┌────────────────┐
│ 2.4 GEMINI    │  │ Mark     │         │ Next Step OR   │
│ CLASSIFY      │  │ SOLVED   │         │ Auto Escalate  │
│ → JSON out    │  └──────────┘         └────────────────┘
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ 2.6 KB MATCH  │──── category + symptom overlap
│ SELECT STEPS  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ 2.7 COMPOSE   │
│ STEP 1 REPLY  │
└───────────────┘
```

---

## 19. UML DIAGRAMS

### Use Case Diagram
```
                    ┌──────────────────────────────────────────────────┐
                    │              AURA ITSM SYSTEM                    │
                    │                                                  │
EMPLOYEE ──────────►│  (Register/Login)    (View Tickets)              │
                    │  (Start Chat)        (View Chat History)         │
                    │  (Voice Input)       (Rate Session)              │
                    │  (Upload Screenshot) (View Device Health)        │
                    │  (Run AI Diagnostics)(Browse Knowledge Base)     │
                    │  (Edit Profile)                                  │
                    │                                                  │
ADMIN ─────────────►│  <<extends EMPLOYEE>>                            │
                    │  (Manage All Tickets)(Assign Engineers)          │
                    │  (Close/Reopen Tickets)(Create KB Article)       │
                    │  (Delete KB Article) (View All Users)            │
                    │  (Audit Chat Logs)   (View Admin Console)        │
                    │                                                  │
GEMINI API ────────►│  (Classify Issues)   (Analyze Screenshots)       │
                    │  (Parse Feedback)    (Generate Health Report)    │
                    └──────────────────────────────────────────────────┘
```

### Class Diagram
```
┌─────────────────────────┐
│         User            │
│─────────────────────────│
│ - id: string            │
│ - name: string          │
│ - email: string         │
│ - role: UserRole        │
│─────────────────────────│
│ + login(): void         │
│ + logout(): void        │
│ + updateProfile(): void │
└────────────┬────────────┘
             │ creates
             │
┌────────────▼────────────┐        ┌────────────────────────┐
│      ChatSession        │◄──────►│     ChatMessage        │
│─────────────────────────│ 1:N    │────────────────────────│
│ - id: string            │        │ - id: string           │
│ - userId: string        │        │ - sender: SenderType   │
│ - title: string         │        │ - text: string         │
│ - category?: string     │        │ - timestamp: string    │
│ - status: SessionStatus │        │ - image?: string       │
│ - messages: Msg[]       │        └────────────────────────┘
│ - troubleshootingSteps  │
│ - currentStepIndex      │        ┌────────────────────────┐
│ - symptoms?: string     │        │   KnowledgeBaseItem    │
│ - ticketId?: string     │        │────────────────────────│
│ - rating?: number       │        │ - id: string           │
│─────────────────────────│        │ - category: string     │
│ + addMessage(): void    │        │ - title: string        │
│ + nextStep(): void      │        │ - symptoms: string[]   │
│ + markSolved(): void    │        │ - solutionSteps: str[] │
│ + escalate(): void      │        └────────────────────────┘
└────────────┬────────────┘
             │ creates
             ▼
┌─────────────────────────┐
│         Ticket          │
│─────────────────────────│
│ - id: string            │
│ - userId: string        │
│ - userName: string      │
│ - issue: string         │
│ - category: string      │
│ - priority: Priority    │
│ - status: TicketStatus  │
│ - assignedTo?: string   │
│ - createdAt: string     │
│─────────────────────────│
│ + close(): void         │
│ + reopen(): void        │
│ + assign(eng): void     │
└─────────────────────────┘
```

### Activity Diagram — Full Troubleshooting Session
```
[START]
   │
   ▼
[User Login]──fail──►[Show Error]──►[END]
   │ success
   ▼
[Dashboard Loaded]
   │
   ▼
[Click "Start Diagnostic Chat"]
   │
   ▼
[Create New Chat Session]
   │
   ▼
[Type / Speak / Upload Screenshot]
   │
   ▼
[Send First Message]
   │
   ▼
[AI: Classify Issue] ──fallback──► [KB: Symptom Match]
   │ category found
   ▼
[Load KB Solution Steps]
   │
   ▼
[Present Step 1]
   │
   ▼
[User Responds Yes/No]
   │
   ├── YES ──► [Mark Session SOLVED] ──► [Show Rating] ──► [END]
   │
   └── NO ──► [currentStepIndex++]
                │
                ├── more steps? ──YES──► [Present Next Step] ──► (loop back)
                │
                └── NO ──► [Create Support Ticket] ──► [Notify User] ──► [END]
```

### Sequence Diagram — AI Classification
```
User      Browser      Express     GeminiAPI     DB
 │           │             │            │          │
 │──send────►│             │            │          │
 │           │──POST /msg─►│            │          │
 │           │             │──classify─►│          │
 │           │             │◄──JSON─────│          │
 │           │             │──getKB─────────────── ►│
 │           │             │◄──kb[]────────────────│
 │           │             │──matchSteps()          │
 │           │             │──saveChat──────────── ►│
 │           │             │◄──saved───────────────│
 │           │◄──{chat,mode}│            │          │
 │◄──render──│             │            │          │
 │           │             │            │          │
```

---

## 20. REST API DESIGN

### Authentication Endpoints

#### POST /api/auth/register
```json
Request:
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "secure123"
}

Response 201:
{
  "user": { "id": "usr-abc123", "name": "John Doe", "email": "john@company.com", "role": "user" }
}

Response 400:
{ "error": "An account with this email already exists" }
```

#### POST /api/auth/login
```json
Request:
{ "email": "john@company.com", "password": "secure123" }

Response 200:
{ "user": { "id": "usr-abc123", "name": "John Doe", "email": "john@company.com", "role": "user" } }

Response 401:
{ "error": "Invalid email or password" }
```

#### POST /api/auth/profile  [AUTH REQUIRED]
```json
Headers: { "Authorization": "Bearer usr-abc123" }
Request:
{ "name": "John D.", "email": "john.d@company.com", "newId": "usr-abc123" }

Response 200:
{ "user": { "id": "usr-abc123", "name": "John D.", "email": "john.d@company.com", "role": "user" } }
```

### Chat Endpoints

#### GET /api/chats  [AUTH REQUIRED]
```json
Response 200:
{
  "chats": [
    {
      "id": "chat-xyz",
      "userId": "usr-abc123",
      "title": "Network Issues Troubleshooting",
      "category": "Network Issues",
      "status": "solved",
      "messages": [...],
      "createdAt": "2026-07-05T10:30:00Z",
      "rating": 5
    }
  ]
}
```

#### POST /api/chats  [AUTH REQUIRED]
```json
Request: { "title": "New Diagnostic Session" }
Response 201: { "chat": { "id": "chat-new1", "status": "active", "messages": [], ... } }
```

#### POST /api/chats/:id/messages  [AUTH REQUIRED]
```json
Request:
{
  "text": "My WiFi is not working",
  "image": "data:image/png;base64,iVBOR..." // optional
}

Response 200:
{
  "chat": { ...updated chat with new messages... },
  "mode": "ai"  // or "fallback"
}
```

#### POST /api/chats/:id/rating  [AUTH REQUIRED]
```json
Request: { "rating": 5 }
Response 200: { "success": true, "chat": { ...updated chat with rating... } }
```

### Ticket Endpoints

#### GET /api/tickets  [AUTH REQUIRED]
```json
Response 200:
{
  "tickets": [
    {
      "id": "tick-1001",
      "userId": "usr-abc123",
      "userName": "John Doe",
      "issue": "Printer offline error",
      "category": "Printer Issues",
      "priority": "Low",
      "status": "Open",
      "assignedTo": null,
      "createdAt": "2026-07-05T08:00:00Z"
    }
  ]
}
```

#### POST /api/tickets  [AUTH REQUIRED]
```json
Request:
{ "issue": "Cannot print", "category": "Printer Issues", "priority": "Low" }

Response 201:
{ "ticket": { "id": "tick-2345", "status": "Open", ... } }
```

#### PATCH /api/tickets/:id  [ADMIN ONLY]
```json
Request (partial update):
{ "status": "Closed", "assignedTo": "Hardware Engineer", "priority": "High" }

Response 200:
{ "ticket": { ...updated ticket... } }
```

### Knowledge Base Endpoints

#### GET /api/kb  [PUBLIC]
```json
Response 200:
{
  "kb": [
    {
      "id": "kb-wifi",
      "category": "Network Issues",
      "title": "Troubleshooting Wi-Fi Connectivity",
      "symptoms": ["wifi", "internet", "router"],
      "solutionSteps": ["Step 1...", "Step 2..."]
    }
  ]
}
```

#### POST /api/kb  [ADMIN ONLY]
```json
Request:
{
  "category": "Software Issues",
  "title": "Fix Microsoft Teams Crashes",
  "symptoms": ["teams", "crash", "freeze"],
  "solutionSteps": ["Clear Teams cache...", "Reinstall..."]
}
Response 201: { "item": { "id": "kb-new1", ... } }
```

#### DELETE /api/kb/:id  [ADMIN ONLY]
```json
Response 200: { "success": true }
Response 404: { "error": "KB item not found" }
```

### Device Health Endpoint

#### POST /api/diagnose-health  [AUTH REQUIRED]
```json
Request:
{
  "metrics": {
    "cpuCores": 8,
    "deviceMemory": 16,
    "cpuUsage": 78,
    "ramUsage": 85,
    "cpuTemp": 72,
    "batteryLevel": 45,
    "pingTime": 120,
    "diskHealth": "Optimal",
    "language": "en-US",
    "userAgent": "Mozilla/5.0..."
  }
}

Response 200:
{
  "report": "## System Health Report\n### Status: WARNING\n- CPU at 78%...\n..."
}
```

### Admin Endpoints

#### GET /api/admin/users  [ADMIN ONLY]
```json
Response 200:
{
  "users": [
    { "id": "admin-1", "name": "IT Lead", "email": "admin@support.com", "role": "admin" },
    { "id": "user-1", "name": "Alex", "email": "user@support.com", "role": "user" }
  ]
}
```

---

## 21. FRONTEND SCREEN DESIGNS

### Screen 1: Login Page
```
┌────────────────────────────────────────────────────────┐
│  🛡️  Aura Support          Technical Intelligence      │
│────────────────────────────────────────────────────────│
│                                                        │
│              ┌──────────────────────────┐              │
│              │   🔐 Technical Support   │              │
│              │          Login           │              │
│              │  AURA DIAGNOSTIC CONTROL │              │
│              │                          │              │
│              │  [✉️] Email Address       │              │
│              │  ┌──────────────────┐    │              │
│              │  │ you@example.com  │    │              │
│              │  └──────────────────┘    │              │
│              │                          │              │
│              │  [🔒] Password           │              │
│              │  ┌──────────────────┐    │              │
│              │  │ ••••••••         │    │              │
│              │  └──────────────────┘    │              │
│              │                          │              │
│              │  [ ACCESS CONSOLE ]      │              │
│              │  [ Sign in with Google ] │              │
│              │                          │              │
│              │  ─── Quick Demo ───      │              │
│              │  [User Account] [Admin]  │              │
│              └──────────────────────────┘              │
└────────────────────────────────────────────────────────┘
```

### Screen 2: Employee Dashboard
```
┌────────────────────────────────────────────────────────────────────┐
│  🖥️ Aura Support        [Admin Console]  [Logout]                  │
│────────────────────────────────────────────────────────────────────│
│                                                                    │
│  ┌──────────────────────────────────────┐  ┌────────────────────┐ │
│  │  🟢 Workspace Live   [Admin Console] │  │  User Identity     │ │
│  │  Welcome, Alex Johnson               │  │  ┌──────────────┐  │ │
│  │  Our AI Agent is ready...            │  │  │ 👤 Alex      │  │ │
│  │                                      │  │  │ user@...     │  │ │
│  │  [Start Diagnostic Chat] [Refresh]  │  │  │ Role: user   │  │ │
│  └──────────────────────────────────────┘  │  │ Tickets: 2   │  │ │
│                                            │  └──────────────┘  │ │
│  ┌─────────────────────┐                  │  [Sign Out]         │ │
│  │ ⏱ Previous Chats    │                  └────────────────────┘ │
│  │─────────────────────│                                          │
│  │ Network Troubleshoot │ SOLVED ►                                │
│  │ Hardware Session     │ ESCALATED ►                             │
│  └─────────────────────┘                                          │
│                                                                    │
│  ┌─────────────────────┐  ┌─────────────────────────────────────┐ │
│  │ 🎫 Support Tickets  │  │ 📡 Live Telemetry                   │ │
│  │─────────────────────│  │─────────────────────────────────────│ │
│  │ #tick-1001  🔵 Open  │  │  CPU Core  RAM     Temp    Battery  │ │
│  │ Printer Issue  Low   │  │   [48%]   [62%]   [52°C]  [84%]    │ │
│  │ #tick-1002  🔵 Open  │  │  ⚠️ Alert Banner (when high)       │ │
│  │ VPN Failure   Medium │  │  [Run AI Diagnostics]               │ │
│  └─────────────────────┘  └─────────────────────────────────────┘ │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 📖 Knowledge Base FAQ  [🔍 Search...]                      │   │
│  │────────────────────────────────────────────────────────────│   │
│  │ Network Issues: Troubleshooting Wi-Fi & Internet    [▼]   │   │
│  │ Hardware Issues: Laptop Overheating & Fan Noise     [▼]   │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

### Screen 3: Chat Interface
```
┌────────────────────────────────────────────────────────┐
│  ← Dashboard  | Hardware Issues Troubleshooting  ACTIVE│
│  Status: 🟡 Active | Category: Hardware Issues         │
│────────────────────────────────────────────────────────│
│  Step Progress: ████████░░░░ Step 2 of 5               │
│════════════════════════════════════════════════════════│
│                                                        │
│  🤖  I've diagnosed your issue under Hardware Issues.  │
│       Step 1: Place laptop on flat surface...          │
│       Did this resolve? Reply Yes or No.    10:30      │
│       [🔊]                                             │
│                                                        │
│                    No, still happening  👤             │
│                                          10:31         │
│                                                        │
│  🤖  Let's try the next step.                          │
│       Step 2: Clear dust from vents using              │
│       compressed air...                     10:31      │
│       [🔊]                                             │
│                                                        │
│════════════════════════════════════════════════════════│
│       [Yes, that worked!]  [No, still not working]     │
│                                                        │
│  [📎] [🎤]  [Describe the issue or reply...] [➤ Send] │
└────────────────────────────────────────────────────────┘
```

### Screen 4: Admin Console
```
┌────────────────────────────────────────────────────────────────┐
│  🟡 IT Lead | System Control Console                           │
│  Manage tickets, engineers, KB, and audit logs                 │
│────────────────────────────────────────────────────────────────│
│  [Support Tickets] [Knowledge Base] [User Directory] [Logs]   │
│────────────────────────────────────────────────────────────────│
│  Active Support Tickets (4)                                    │
│                                                                │
│  ID       │ Author    │ Issue         │ Priority│ Status       │
│  ─────────┼───────────┼───────────────┼─────────┼──────────── │
│  #tick-1  │ Alex J.   │ Printer jam   │ Low     │ 🔵 Open     │
│           │           │               │         │ [Resolve]    │
│           │ Assign: [Hardware Engineer ▼]        │             │
│  ─────────┼───────────┼───────────────┼─────────┼──────────── │
│  #tick-2  │ Alex J.   │ VPN failure   │ Medium  │ 🔵 Open     │
│           │           │               │         │ [Resolve]    │
│           │ Assign: [Network Specialist ▼]       │             │
└────────────────────────────────────────────────────────────────┘
```

---

## 22. STEP-BY-STEP WORKFLOW: LOGIN TO TICKET CLOSURE

```
STEP 1: User opens http://localhost:3000
        → Express serves Vite SPA (index.html)
        → React renders Login component

STEP 2: User enters email=user@support.com, password=user123
        → Click "Access Console"
        → POST /api/auth/login {email, password}
        → Server: find user by email, compare passwordHash
        → Return: User object {id, name, email, role}
        → React state: setUser(data.user)
        → Navigate to Dashboard component

STEP 3: Dashboard mounts
        → useEffect: parallel fetch /api/chats, /api/tickets, /api/kb
        → Bearer: user.id in Authorization header
        → Render: welcome, profile card, chat history, tickets, telemetry, FAQ
        → setInterval(4000): random walk CPU/RAM/temp/ping values

STEP 4: User clicks "Start Diagnostic Chat"
        → POST /api/chats {title: "New Diagnostic Session"}
        → Server creates ChatSession: {id, userId, status: "active", messages: []}
        → Saved to db.chats
        → onSelectChat(chat.id) → render ChatInterface component

STEP 5: Chat opens, user types "My wifi is not working"
        → (Optional: click 🎤 → SpeechRecognition → fills input)
        → (Optional: click 📎 → FileReader → base64 image attached)
        → Submit → POST /api/chats/:id/messages {text, image?}

STEP 6: Server processes first message (chat.category is null)
        → Gemini API: classify {category: "Network Issues", symptoms: [...]}
        → If no API key: local KB symptom matcher runs instead
        → KB lookup: find kb-wifi article (category match + symptom overlap)
        → chat.troubleshootingSteps = kb-wifi.solutionSteps (5 steps)
        → chat.currentStepIndex = 0
        → Reply: "Step 1: Verify Wi-Fi is enabled..."
        → Save chat to db

STEP 7: User replies "No" (or clicks [No, still not working] quick button)
        → POST /api/chats/:id/messages {text: "No, still not resolved"}
        → Server: chat.category already set → feedback pipeline
        → Gemini: classify feedback as "no"
        → OR local: "no" keyword detected
        → currentStepIndex++ (0 → 1)
        → Reply: "Step 2: Restart your wireless router..."

STEP 8: User replies "no" to steps 2, 3, 4, 5 (all steps exhausted)
        → nextStepIndex (5) >= steps.length (5) → escalation branch
        → Priority scoring: "network", "wifi" → priority = "Medium"
        → db.createTicket(userId, userName, issue, "Network Issues", "Medium")
        → chat.status = "escalated", chat.ticketId = "tick-5823"
        → Reply: "I've created ticket #tick-5823. An engineer will contact you."
        → Chat saved, ticket created

STEP 9: Admin logs in (admin@support.com / admin123)
        → Dashboard shows Admin Console button
        → Click "Admin Console" or header button
        → AdminPanel renders with activeTab="tickets"

STEP 10: Admin sees ticket #tick-5823
         → Selects "Network Specialist" from assign dropdown
         → PATCH /api/tickets/tick-5823 {assignedTo: "Network Specialist"}
         → Server: admin check passes → update ticket → save
         → Admin clicks [Resolve] button
         → PATCH /api/tickets/tick-5823 {status: "Closed"}
         → Server updates status → save

STEP 11: User refreshes Dashboard
         → GET /api/tickets → ticket now shows status: "Closed"
         → Ticket card updates with green "Closed" badge
         → ISSUE RESOLVED ✅
```

---

## 23. AI DECISION-MAKING PROCESS

### Classification Decision Tree
```
INPUT: User message text

Step 1: Does message contain image data?
  YES → Use Gemini Vision multimodal API
    → Analyze image pixels for: error dialogs, BSOD codes, log outputs
    → Cross-reference with text description
    → Classify + generate image-specific steps
    → Output: {category, symptoms, reason, solutionSteps}

  NO → Use Gemini text-only API
    → Prompt: "Classify into 8 IT categories, extract symptoms"
    → Output: {category, symptoms, reason}
    → Then: standard KB step lookup

Step 2: If Gemini fails or API key missing:
  → Local KB symptom overlap scoring:
    for each KB article:
      score = count of article.symptoms that appear in user text
    best = argmax(score)
    If max_score == 0: default to "Software Issues"
  → Set chat.category = best_category

Step 3: KB Matching:
  Primary: find article where article.category === chat.category
  Secondary: find article with highest symptom overlap with user text
  Tertiary: fallback to kb[0] (first article)
  → Set chat.troubleshootingSteps = matched.solutionSteps
```

### Priority Scoring Algorithm
```
function scorePriority(category, messageText):
  combined = (category + " " + messageText).toLowerCase()

  HIGH signals: ["crash", "blue screen", "bsod", "security", "virus",
                 "ransomware", "data loss", "not booting", "password breach"]

  MEDIUM signals: ["offline", "internet", "wifi", "network", "vpn",
                   "cannot connect", "slow network", "email down"]

  if any HIGH signal in combined: return "High"
  if any MEDIUM signal in combined: return "Medium"
  return "Low"
```

### Feedback Parsing
```
Gemini feedback prompt result: "yes" | "no" | "unclear"

If "unclear" → local keyword fallback:
  yes_words = ["yes", "yeah", "yup", "fixed", "resolved", "works",
               "working", "solved", "it did"]
  no_words  = ["no", "nope", "not", "still", "failed", "doesn't",
               "didn't", "same issue", "overheating"]

  Normalize text: lowercase + remove punctuation
  Check yes_words first (higher confidence)
  Then check no_words
  Default: "no" (conservative — don't mark solved if unclear)
```
