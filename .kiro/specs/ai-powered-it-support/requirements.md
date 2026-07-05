# Requirements Document

## Introduction

This document specifies the software requirements for **Aura — AI-Powered IT Support Management System**, an enterprise-grade technical support platform. The system combines a Gemini-powered conversational AI agent, intelligent ticket management, knowledge-base-driven troubleshooting, device health monitoring, predictive maintenance, remote support, analytics, and a multi-role administration console. It is built on React 19, TypeScript, Express.js, Tailwind CSS, the `@google/genai` SDK (Gemini API), and a JSON file-based persistence layer (`db.json`). The platform targets organizations of all sizes and is designed to be presentation-ready for final-year CS projects and placement interviews, demonstrating enterprise patterns comparable to ServiceNow, Zendesk, and Microsoft Intune.

---

## Glossary

- **System**: The Aura AI-Powered IT Support Management System as a whole.
- **AI_Agent**: The Gemini-powered conversational engine that classifies issues, generates troubleshooting paths, and conducts interactive repair sessions.
- **NLP_Engine**: The natural-language processing subsystem inside the AI_Agent responsible for intent detection, entity extraction, and sentiment analysis.
- **Ticket_Manager**: The subsystem that creates, tracks, prioritizes, and routes support tickets.
- **SLA_Engine**: The component that monitors ticket age against service-level agreement thresholds and triggers escalations.
- **Knowledge_Base**: The structured repository of IT issue categories, symptom keywords, and step-by-step resolution workflows.
- **Troubleshooting_Engine**: The orchestrator that walks users through Knowledge_Base-sourced or AI-generated resolution steps.
- **Assignment_Engine**: The subsystem that automatically suggests or assigns support engineers to tickets based on workload and specialization.
- **Notification_Service**: The component responsible for delivering email, in-app, and SMS alerts.
- **Remote_Support_Module**: The component providing remote desktop session initiation, file transfer, and command execution capabilities.
- **Analytics_Dashboard**: The real-time and historical reporting interface surfacing KPIs, trends, and predictive insights.
- **Feedback_System**: The post-resolution rating and qualitative feedback collection mechanism.
- **Vision_OCR_Engine**: The image-analysis pipeline that reads screenshots to detect error codes, BSOD messages, and UI anomalies using Gemini Vision.
- **Voice_Assistant**: The speech-input and text-to-speech module enabling hands-free interaction.
- **Predictive_Maintenance_Module**: The ML-based component that forecasts hardware or software failures before they occur.
- **Device_Health_Monitor**: The telemetry collector that tracks CPU, RAM, disk, battery, and network metrics in real time.
- **Auth_Service**: The authentication and authorization subsystem managing JWT tokens, RBAC, and session lifecycle.
- **Audit_Logger**: The component that records all security-relevant events into an immutable log.
- **Employee**: A registered end-user who raises support issues and receives troubleshooting guidance.
- **Support_Engineer**: A technical staff member assigned to and resolving escalated tickets.
- **Team_Lead**: A senior role with authority to manage engineer assignments, SLA policies, and Knowledge_Base content.
- **Admin**: A system administrator with full platform configuration and user management rights.
- **Session**: An authenticated user context represented by a JWT token valid for a configurable duration.
- **Chat_Session**: A single conversational troubleshooting interaction between an Employee and the AI_Agent.
- **Escalation**: The automated promotion of an unresolved Chat_Session to a formal Ticket.
- **Priority_Level**: A discrete severity label — Low, Medium, or High — assigned to a Ticket.
- **SLA_Threshold**: The maximum elapsed time allowed before a ticket at a given Priority_Level is considered breached.
- **DB**: The JSON-file persistence layer (`db.json`) backed by an in-memory object model within `server_db.ts`.

---

## Requirements

### Requirement 1: User Authentication and Role-Based Access Control

**User Story:** As an Employee, Support_Engineer, Team_Lead, or Admin, I want to securely authenticate with the system and access only the features permitted by my role, so that unauthorized users cannot access sensitive IT support data.

#### Acceptance Criteria

1. WHEN a user submits valid email and password credentials, THE Auth_Service SHALL authenticate the user and return a JWT token with an expiry of 24 hours.
2. WHEN a user submits invalid credentials, THE Auth_Service SHALL return an HTTP 401 response with a descriptive error message within 500ms.
3. WHEN a registration request is received with an email address already present in the DB, THE Auth_Service SHALL return an HTTP 400 response indicating a duplicate account.
4. WHEN a registration request is received with a password shorter than 6 characters, THE Auth_Service SHALL reject the request with a validation error message.
5. WHEN a registration request is received with a malformed email address, THE Auth_Service SHALL reject the request with an email format error message.
6. THE Auth_Service SHALL assign the `admin` role to any account whose email contains the substring "admin", and the `user` role to all other accounts.
7. WHILE a user holds the `user` role, THE System SHALL restrict access to admin-only API endpoints and return HTTP 403 for any unauthorized attempt.
8. WHILE a user holds the `admin` role, THE System SHALL grant access to all ticket management, user directory, knowledge base editing, and chat-log audit endpoints.
9. WHEN a Google OAuth sign-in request is received with a valid email, THE Auth_Service SHALL provision a new account if none exists or return the existing account, then issue a session equivalent to standard login.
10. WHEN a user's JWT token has expired, THE Auth_Service SHALL return HTTP 401 on any protected request, prompting re-authentication.
11. THE Auth_Service SHALL support user profile updates including display name, email, and user ID, with duplicate-detection checks applied before persisting changes.
12. THE Audit_Logger SHALL record every login, logout, registration, and profile-update event with a timestamp and the actor's user ID.

---

### Requirement 2: AI Chatbot with NLP Engine and Intent Detection

**User Story:** As an Employee, I want the AI_Agent to understand my natural language description of a technical problem, so that I receive fast, accurate troubleshooting guidance without needing to navigate complex menus.

#### Acceptance Criteria

1. WHEN an Employee sends a text message in a Chat_Session, THE NLP_Engine SHALL classify the intent into exactly one of these eight categories within 3 seconds: Network Issues, Software Issues, Hardware Issues, Operating System Issues, Performance Issues, Security Issues, Account Issues, or Printer Issues.
2. WHEN the Gemini API is available, THE AI_Agent SHALL use the `gemini-2.5-flash` model for intent classification, returning a structured JSON object containing `category`, `symptoms`, and `reason` fields.
3. WHEN the Gemini API is unavailable, THE AI_Agent SHALL fall back to local symptom-keyword matching against the Knowledge_Base and classify the issue within 200ms.
4. WHEN intent classification succeeds, THE NLP_Engine SHALL extract symptom keywords from the user message and store them in the Chat_Session record.
5. THE NLP_Engine SHALL detect user feedback polarity — "resolved" versus "unresolved" — from free-text replies using AI inference, with a local keyword-matching fallback covering terms including "yes", "fixed", "resolved", "works", "no", "still", "failed", and "same".
6. WHEN a user reply is classified as resolved, THE AI_Agent SHALL mark the Chat_Session status as `solved` and present a success confirmation message.
7. WHEN a user reply is classified as unresolved and additional troubleshooting steps remain, THE AI_Agent SHALL advance to the next step and present it to the user.
8. WHEN all Knowledge_Base steps are exhausted without resolution, THE AI_Agent SHALL trigger an Escalation, creating a Ticket with inferred Priority_Level and notifying the user with the Ticket ID.
9. THE AI_Agent SHALL maintain the full message history of a Chat_Session in the DB, including sender identity, message text, timestamp, and any attached images.
10. FOR ALL Chat_Sessions, the sequence of AI responses SHALL be deterministic given the same input sequence, ensuring testable and reproducible troubleshooting paths.

---

### Requirement 3: Screenshot-Based Visual Error Detection

**User Story:** As an Employee, I want to attach a screenshot of an error or BSOD screen, so that the AI_Agent can read the error code and provide a precise fix tailored to my exact failure.

#### Acceptance Criteria

1. WHEN an Employee attaches an image file during a Chat_Session, THE Vision_OCR_Engine SHALL accept images in JPEG, PNG, GIF, and WebP formats with a maximum file size of 2MB.
2. WHEN a valid image is received, THE Vision_OCR_Engine SHALL extract the base64-encoded image data and pass it as an inline multimodal part to the Gemini Vision API.
3. WHEN analyzing a screenshot, THE AI_Agent SHALL identify visible error codes, BSOD stop codes, application crash dialogs, driver names, and UI error messages, and incorporate these specifics into the classification result.
4. WHEN a screenshot is analyzed, THE AI_Agent SHALL generate a custom 4-to-5-step troubleshooting path based on the specific error content observed in the image, rather than a generic category-based path.
5. WHEN a screenshot-based diagnosis is performed, THE Chat_Session title SHALL be prefixed with "Screen-Diagnosed:" followed by the detected category.
6. IF the Vision API returns an error or times out, THEN THE AI_Agent SHALL fall back to text-only classification using the user's accompanying description.
7. THE System SHALL store the base64 image data within the Chat_Session message record and render the image inline in the chat history for both the Employee and Admin.

---

### Requirement 4: Step-by-Step Troubleshooting Engine with Progress Tracking

**User Story:** As an Employee, I want the system to guide me through a structured repair procedure one step at a time, so that I can methodically resolve complex IT problems without feeling overwhelmed.

#### Acceptance Criteria

1. WHEN a Chat_Session is classified, THE Troubleshooting_Engine SHALL load an ordered list of resolution steps — either AI-generated or sourced from the Knowledge_Base — and store them in the `troubleshootingSteps` array of the Chat_Session record.
2. WHEN the Troubleshooting_Engine presents a step, THE System SHALL display a progress bar showing the current step index versus the total step count.
3. WHEN an Employee confirms a step resolved their issue, THE Troubleshooting_Engine SHALL mark the Chat_Session as `solved` without advancing further steps.
4. WHEN an Employee reports a step did not resolve their issue, THE Troubleshooting_Engine SHALL increment `currentStepIndex` and present the next step.
5. WHILE a Chat_Session is in `active` status, THE System SHALL display Yes/No quick-reply buttons after each assistant message that includes both options, enabling one-click responses.
6. IF a Chat_Session status is `solved` or `escalated`, THEN THE Troubleshooting_Engine SHALL reject further message submissions and display a session-closed notice.
7. THE Troubleshooting_Engine SHALL persist the `currentStepIndex` after every user interaction so that progress is preserved across browser refreshes.
8. FOR ALL Knowledge_Base categories, THE Troubleshooting_Engine SHALL provide a minimum of 4 resolution steps and a maximum of 8 resolution steps per Chat_Session.

---

### Requirement 5: Intelligent Ticket Management System

**User Story:** As an Employee, I want a support ticket automatically created when the AI cannot resolve my issue, so that a human engineer is assigned to my problem without additional effort on my part.

#### Acceptance Criteria

1. WHEN an Escalation is triggered, THE Ticket_Manager SHALL create a Ticket with a unique ID, the user's identity, the original problem description, the classified category, an inferred Priority_Level, and a status of "Open".
2. WHEN determining Priority_Level, THE Ticket_Manager SHALL assign "High" for issues containing keywords such as "crash", "blue screen", "bsod", "security", or "virus"; "Medium" for "offline", "internet", "wifi", or "network"; and "Low" for all remaining issues.
3. WHEN a Ticket is created, THE System SHALL display the Ticket ID, category, priority, and status to the Employee within the Chat_Session interface.
4. THE Ticket_Manager SHALL expose an endpoint allowing an Admin or Team_Lead to update ticket status between "Open" and "Closed".
5. THE Ticket_Manager SHALL expose an endpoint allowing an Admin or Team_Lead to reassign a Ticket to a named Support_Engineer.
6. WHEN a Ticket is reassigned, THE System SHALL record the assigned engineer's name in the `assignedTo` field of the Ticket record.
7. WHILE a Ticket has status "Open", THE System SHALL display it in the Employee's Dashboard ticket list with priority badge and creation date.
8. THE Ticket_Manager SHALL sort ticket lists by creation date in descending order by default.
9. THE Ticket_Manager SHALL prevent Employees from modifying ticket status or engineer assignment; these actions are restricted to Admin and Team_Lead roles.
10. FOR ALL ticket priority levels, THE System SHALL visually differentiate priority badges: red for High, amber for Medium, and grey for Low.

---

### Requirement 6: SLA Management and Escalation Enforcement

**User Story:** As a Team_Lead, I want the system to automatically flag tickets that breach their SLA threshold, so that I can prioritize engineer allocation and maintain service quality commitments.

#### Acceptance Criteria

1. THE SLA_Engine SHALL define default SLA thresholds: 4 hours for High priority tickets, 8 hours for Medium priority tickets, and 24 hours for Low priority tickets.
2. WHEN a ticket's elapsed open time exceeds its SLA threshold, THE SLA_Engine SHALL mark the ticket as SLA-breached and surface a visual warning in the Admin and Team_Lead views.
3. WHEN an SLA breach is detected, THE Notification_Service SHALL send an in-app alert to all users with the Team_Lead or Admin role.
4. THE SLA_Engine SHALL recalculate SLA breach status on every ticket list load and on a 60-second background polling interval.
5. WHERE an Admin has configured custom SLA thresholds, THE SLA_Engine SHALL apply the custom values instead of the defaults.
6. WHEN a ticket is closed, THE SLA_Engine SHALL record the resolution time and store it for Analytics_Dashboard reporting.

---

### Requirement 7: Knowledge Base and Troubleshooting Content Management

**User Story:** As a Team_Lead or Admin, I want to add, update, and remove knowledge base articles containing symptom keywords and solution steps, so that the AI_Agent always reflects the latest organizational troubleshooting procedures.

#### Acceptance Criteria

1. THE Knowledge_Base SHALL store each article with a unique ID, a category from the eight defined categories, a title, a comma-separated symptom keyword list, and an ordered solution-steps array.
2. WHEN an Admin submits a new Knowledge_Base article with all required fields, THE Knowledge_Base SHALL persist the article and return it in subsequent GET requests immediately.
3. WHEN an Admin deletes a Knowledge_Base article, THE Knowledge_Base SHALL remove the article and it SHALL NOT appear in future troubleshooting or FAQ queries.
4. WHEN no AI client is available, THE Troubleshooting_Engine SHALL select the Knowledge_Base article with the highest symptom-keyword overlap with the user's message for routing.
5. THE Knowledge_Base SHALL be readable without authentication, enabling public FAQ access.
6. WHEN an Employee searches the FAQ, THE Knowledge_Base SHALL return articles whose title, category, or symptom keywords contain the search query substring, case-insensitively.
7. THE System SHALL ship with a minimum of six pre-loaded Knowledge_Base articles covering: Network Issues, Hardware Issues, Printer Issues, Operating System Issues, Performance Issues, and Security Issues.
8. WHERE a new Knowledge_Base article is created, THE System SHALL validate that symptom keywords are non-empty and solution steps contain at least two entries before persisting.

---

### Requirement 8: Multi-Role System and User Management

**User Story:** As an Admin, I want to manage all registered users and their roles, so that I can control system access and ensure each person has appropriate permissions.

#### Acceptance Criteria

1. THE System SHALL support exactly four roles: Employee (mapped to `user`), Support_Engineer, Team_Lead, and Admin — with `admin` and `user` as the persisted role values in the current DB schema.
2. WHEN an Admin accesses the user directory endpoint, THE System SHALL return all registered users with their ID, name, email, and role.
3. THE System SHALL display each user's clearance level — "Console Admin" for admin role and "Customer Support" for user role — in the Admin user directory table.
4. WHEN an Employee registers, THE System SHALL default their role to `user` unless their email contains "admin", which triggers automatic `admin` role assignment.
5. THE System SHALL allow any authenticated user to update their own display name, email address, and user ID, subject to uniqueness constraints.
6. WHEN a user ID is changed, THE System SHALL cascade the update to all Chat_Sessions and Tickets referencing the old user ID.
7. THE Admin SHALL be the only role permitted to access the `/api/admin/users` endpoint; all other roles SHALL receive HTTP 403.

---

### Requirement 9: Device Health Monitoring and Real-Time Telemetry

**User Story:** As an Employee, I want the dashboard to show live metrics about my device's health, so that I can proactively spot problems like overheating or memory pressure before they cause failures.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Device_Health_Monitor SHALL collect and display the following metrics: CPU core count, device memory (GB), CPU utilization percentage, RAM utilization percentage, estimated CPU temperature (°C), battery level percentage, and network ping time (ms).
2. THE Device_Health_Monitor SHALL refresh all simulated telemetry metrics every 4 seconds using a client-side interval, applying realistic random deltas constrained within defined safe ranges.
3. WHEN CPU utilization exceeds 85%, OR CPU temperature exceeds 75°C, OR RAM utilization exceeds 85%, THE Device_Health_Monitor SHALL display an elevated-resource-usage alert banner with an advisory message.
4. WHEN an Employee initiates the AI Diagnostics run, THE System SHALL POST the collected metrics to `/api/diagnose-health` and render the Gemini-generated Markdown report in a modal overlay.
5. WHEN the Gemini API is unavailable, THE Device_Health_Monitor SHALL generate a structured offline diagnostic report using the locally captured metric values.
6. THE Device_Health_Monitor SHALL use the `navigator.getBattery()` API where supported to report real battery level, and SHALL fall back to a static value of 84% where the API is not available.
7. THE Device_Health_Monitor SHALL display CPU core count and device memory using `navigator.hardwareConcurrency` and `navigator.deviceMemory` respectively.
8. WHEN the diagnostic report is generated, THE System SHALL render it with structured Markdown formatting including headers, bullet points, bold labels, and numbered lists.

---

### Requirement 10: Voice Assistant Workflow

**User Story:** As an Employee, I want to describe my IT problem using my voice, so that I can get support hands-free when typing is inconvenient.

#### Acceptance Criteria

1. WHEN an Employee activates the voice input button, THE Voice_Assistant SHALL initialize the Web Speech API `SpeechRecognition` interface with `lang` set to "en-US", `continuous` to false, and `interimResults` to false.
2. WHEN speech recognition successfully captures input, THE Voice_Assistant SHALL append the recognized transcript to the current text input field, separated by a space if existing text is present.
3. WHEN the microphone permission is denied, THE Voice_Assistant SHALL display the error message: "Microphone access is blocked in this container frame. Try enabling microphone permissions or open the app in a new tab."
4. WHEN no speech is detected within the recognition window, THE Voice_Assistant SHALL display the message: "No speech detected. Please speak clearly into your microphone."
5. WHEN the browser does not support the Web Speech API, THE Voice_Assistant SHALL display the message: "Speech recognition is not supported in this browser. Try Google Chrome or Safari."
6. WHEN an Employee activates the text-to-speech feature on an AI message, THE Voice_Assistant SHALL use the `SpeechSynthesis` API to read the message aloud at a rate of 1.05, after stripping Markdown formatting characters.
7. WHEN a voice error occurs, THE System SHALL display the error in a dismissible banner above the chat input and SHALL NOT block further chat interaction.
8. WHILE speech recognition is active, THE System SHALL display a pulsing animation on the microphone button and update the input placeholder to "Listening closely... Speak now!".

---

### Requirement 11: Notification System

**User Story:** As an Employee or Support_Engineer, I want to receive timely notifications about ticket updates and SLA breaches, so that I am always aware of the current status of my support issues.

#### Acceptance Criteria

1. WHEN a Ticket is created via Escalation, THE Notification_Service SHALL generate an in-app notification visible to the Employee with the Ticket ID, category, priority, and status.
2. WHEN a Ticket is assigned to a Support_Engineer, THE Notification_Service SHALL generate an in-app notification for the assigned engineer identifying the ticket and the reporting user.
3. WHEN a Ticket's status is changed to "Closed", THE Notification_Service SHALL generate an in-app notification for the ticket's owner confirming resolution.
4. WHEN an SLA threshold is breached, THE Notification_Service SHALL generate in-app alerts for all Admin and Team_Lead users identifying the breached ticket.
5. WHERE an email notification service is configured, THE Notification_Service SHALL send email alerts for Ticket creation, assignment, closure, and SLA breach events.
6. WHERE an SMS gateway is configured, THE Notification_Service SHALL send SMS alerts for High-priority ticket creation and SLA breaches.
7. THE Notification_Service SHALL store all generated notifications in the DB and mark each as "read" or "unread" per user.
8. WHEN a user reads a notification, THE Notification_Service SHALL update its status to "read" and decrement the unread-notification badge count.

---

### Requirement 12: Remote Support Module

**User Story:** As a Support_Engineer, I want to initiate a remote support session with an Employee's device, so that I can directly diagnose and fix issues that cannot be resolved through chat-based guidance alone.

#### Acceptance Criteria

1. WHEN a Support_Engineer initiates a remote session on an Open ticket, THE Remote_Support_Module SHALL generate a unique session code and present it to both the engineer and the Employee.
2. WHEN an Employee enters the session code, THE Remote_Support_Module SHALL establish a peer-to-peer connection using WebRTC or a fallback signaling mechanism.
3. WHILE a remote session is active, THE Remote_Support_Module SHALL provide screen-viewing capability with at least 10 frames per second at 1280×720 resolution.
4. WHEN the Support_Engineer requests control, THE Employee SHALL receive an explicit on-screen prompt and THE Remote_Support_Module SHALL transmit mouse and keyboard events only after the Employee grants permission.
5. WHEN either participant ends the session, THE Remote_Support_Module SHALL terminate the connection within 2 seconds and record the session duration, engineer ID, ticket ID, and outcome in the DB.
6. THE Remote_Support_Module SHALL encrypt all remote-session data in transit using TLS 1.3 or higher.
7. IF the peer-to-peer connection cannot be established within 30 seconds, THEN THE Remote_Support_Module SHALL display a timeout error and suggest an alternative text-based support channel.
8. THE Remote_Support_Module SHALL log every remote session action — connect, screen-share start, control-request, control-granted, file-transfer, disconnect — to the Audit_Logger.

---

### Requirement 13: Analytics Dashboard

**User Story:** As a Team_Lead or Admin, I want a real-time and historical analytics dashboard, so that I can measure support performance, identify recurring issues, and make data-driven staffing decisions.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL display the following real-time KPIs: total open tickets, tickets closed today, average resolution time (hours), SLA compliance percentage, and total active Chat_Sessions.
2. THE Analytics_Dashboard SHALL display a time-series chart of ticket volume over the past 30 days, segmented by priority level.
3. THE Analytics_Dashboard SHALL display a breakdown chart of ticket distribution by category across the eight defined issue categories.
4. THE Analytics_Dashboard SHALL display the top 5 most common issue categories based on ticket and chat history from the past 30 days.
5. THE Analytics_Dashboard SHALL display per-engineer performance metrics including total tickets assigned, average resolution time, and close rate.
6. WHEN the Analytics_Dashboard loads, THE System SHALL compute all metrics from the DB and return them within 2 seconds.
7. THE Analytics_Dashboard SHALL refresh its data every 60 seconds without requiring a full page reload.
8. WHERE a date-range filter is applied, THE Analytics_Dashboard SHALL restrict all metric calculations to the selected time window.
9. THE Analytics_Dashboard SHALL restrict access to users with the Admin or Team_Lead role and return HTTP 403 to all others.

---

### Requirement 14: Feedback and Rating System

**User Story:** As an Employee, I want to rate and comment on the quality of a resolved support session, so that I can provide the team with actionable input to improve service quality.

#### Acceptance Criteria

1. WHEN a Chat_Session status transitions to `solved`, THE Feedback_System SHALL present a 1-to-5-star rating widget to the Employee.
2. WHEN an Employee submits a star rating, THE Feedback_System SHALL persist the `rating` value in the Chat_Session record and display a confirmation message.
3. THE Feedback_System SHALL allow only the Employee who owns the Chat_Session to submit a rating for that session.
4. WHEN a rating is submitted, THE Feedback_System SHALL display the submitted star count and the message: "Your feedback helps us improve our diagnostic algorithms."
5. THE Feedback_System SHALL expose a ratings aggregation endpoint accessible to Admin and Team_Lead roles, returning the average rating per category and per time period.
6. THE Analytics_Dashboard SHALL display the system-wide average satisfaction rating and the per-category average rating.
7. WHEN a Chat_Session already has a submitted rating, THE Feedback_System SHALL display the rating as read-only and SHALL NOT allow re-submission.

---

### Requirement 15: Predictive Maintenance Module

**User Story:** As a Team_Lead, I want the system to predict which devices are likely to experience hardware or software failures in the near future, so that I can dispatch preventive maintenance before a critical outage occurs.

#### Acceptance Criteria

1. WHEN device telemetry data is collected over three or more consecutive sessions showing an upward trend in CPU temperature or RAM utilization, THE Predictive_Maintenance_Module SHALL flag the device as a maintenance candidate.
2. THE Predictive_Maintenance_Module SHALL analyze historical ticket data and identify categories with a ticket recurrence rate exceeding two tickets per device within 14 days.
3. WHEN a device is flagged as a maintenance candidate, THE System SHALL create a preventive-maintenance Ticket with priority "Medium" and category "Predictive Alert".
4. THE Predictive_Maintenance_Module SHALL display a forecast summary for the current user on the Dashboard identifying devices with elevated failure probability.
5. WHEN the Gemini API is available, THE Predictive_Maintenance_Module SHALL submit the collected metrics history to the AI_Agent with a predictive analysis prompt and surface the generated recommendation.
6. THE Predictive_Maintenance_Module SHALL update its predictive model inputs whenever new telemetry data is collected or a new Ticket is created for the same device.

---

### Requirement 16: Security — JWT, RBAC, Encryption, and Audit Logging

**User Story:** As an Admin, I want all system access to be governed by JWT-based authentication, role-based permissions, data encryption, and comprehensive audit trails, so that the platform meets enterprise security standards.

#### Acceptance Criteria

1. THE Auth_Service SHALL issue JWT tokens signed with a secret stored in the `GEMINI_API_KEY`-adjacent environment configuration, with a configurable expiry defaulting to 24 hours.
2. WHEN any protected API endpoint is called without a valid Bearer token, THE System SHALL return HTTP 401 within 100ms.
3. WHEN any protected API endpoint is called with a valid token by a user whose role is insufficient, THE System SHALL return HTTP 403 within 100ms.
4. THE System SHALL store all passwords as hashed values; plaintext passwords SHALL NOT be written to the DB or logged.
5. THE Audit_Logger SHALL record every authentication event, every admin action (ticket update, KB create/delete, user role change), every escalation, and every remote session event, with timestamp, actor ID, action type, and affected resource ID.
6. THE System SHALL enforce HTTPS for all API and asset traffic in production environments.
7. THE Auth_Service SHALL invalidate a session token on explicit logout, preventing re-use of the token after sign-out.
8. WHEN the Audit_Logger records an event, THE System SHALL persist it to a dedicated append-only log store that is not modifiable by standard user API calls.
9. WHERE RBAC policies are defined, THE System SHALL evaluate them server-side; client-side role checks SHALL serve only as UI hints and SHALL NOT be the sole access-control mechanism.
10. THE System SHALL sanitize all user-supplied input before persisting to the DB or including in AI prompts to prevent injection attacks.

---

### Requirement 17: AI Model Configuration and Fallback Resilience

**User Story:** As an Admin, I want the system to continue operating fully when the Gemini API is unreachable, so that support agents are not left without any assistance during an API outage.

#### Acceptance Criteria

1. WHEN the `GEMINI_API_KEY` environment variable is absent or equals the placeholder value "MY_GEMINI_API_KEY", THE AI_Agent SHALL operate entirely in Knowledge_Base fallback mode without attempting Gemini API calls.
2. WHEN the Gemini API returns an error during classification, THE AI_Agent SHALL log the error to the server console and immediately invoke the local symptom-matching classifier.
3. WHEN the Gemini API returns an error during the health diagnostics endpoint, THE System SHALL return a pre-formatted offline diagnostic report using the received metrics values.
4. THE System SHALL indicate the active AI mode to the user via a "Local KB Mode" badge when fallback is active, and remove the badge when full AI is available.
5. WHEN the Gemini API recovers after a fallback period, THE AI_Agent SHALL resume using AI classification for all subsequent Chat_Sessions without requiring a server restart.
6. THE System SHALL initialize the Gemini client lazily — only when the first AI-dependent request is received — so that server startup does not fail when the API key is absent.

---

### Requirement 18: Data Persistence and DB Integrity

**User Story:** As an Admin, I want all system data to be reliably persisted to disk, so that no tickets, chat histories, or user records are lost between server restarts.

#### Acceptance Criteria

1. WHEN the server starts, THE DB SHALL load its state from `db.json` if the file exists, or create the file with seed data if it does not.
2. WHEN any data mutation occurs — user creation, chat update, ticket creation, KB modification — THE DB SHALL write the updated in-memory state to `db.json` within 1 second.
3. WHEN `db.json` is absent or corrupted on startup, THE DB SHALL fall back to the hardcoded default seed data including two default users, six Knowledge_Base articles, and two sample tickets, and SHALL create a fresh `db.json` file.
4. THE DB SHALL maintain referential consistency: deleting a user SHALL NOT delete associated tickets and chat sessions but SHALL preserve them with the original user ID for audit purposes.
5. THE DB SHALL initialize with seed users: `admin@support.com` / `admin123` mapped to the Admin role, and `user@support.com` / `user123` mapped to the Employee role.
6. WHEN concurrent write operations occur, THE DB SHALL serialize writes using an async queue to prevent race-condition data corruption.

---

### Requirement 19: Dashboard and Navigation Experience

**User Story:** As an Employee, I want a unified dashboard that shows my open tickets, recent chats, live device telemetry, and FAQ articles, so that I have a complete picture of my IT health from a single view.

#### Acceptance Criteria

1. WHEN an Employee logs in, THE Dashboard SHALL load and render all panels — chat history, ticket list, device health monitor, and FAQ — within 2 seconds.
2. THE Dashboard SHALL display a sticky navigation header showing the application name, user-context actions (Admin Console link for admins), and a logout button on every view.
3. WHEN an Admin user is logged in, THE Dashboard SHALL surface an "Admin Console" button that navigates to the AdminPanel, which presents tabs for Tickets, Knowledge Base, User Directory, and Troubleshoot Logs.
4. WHEN an Employee navigates from the Dashboard into a Chat_Session, THE System SHALL preserve the Dashboard state so that returning via the Back button does not require a full data reload.
5. THE Dashboard SHALL display real-time telemetry metrics in a responsive grid layout adapting from 2 columns on mobile to 3 columns on desktop.
6. WHEN an Employee initiates a new chat session from the Dashboard, THE System SHALL create the session via POST to `/api/chats` and navigate to the Chat_Session view within 500ms.
7. THE Dashboard FAQ panel SHALL support incremental text search across Knowledge_Base article titles, categories, and symptom keywords, filtering results as the user types.
8. IF an API call fails during Dashboard load, THEN THE Dashboard SHALL display a descriptive error banner and continue rendering the panels that loaded successfully.

---

### Requirement 20: Accessibility and Responsive Design

**User Story:** As any user, I want the application to be usable on any screen size and accessible to users relying on assistive technologies, so that the platform is inclusive and professional.

#### Acceptance Criteria

1. THE System SHALL be fully operable using keyboard navigation alone, with all interactive elements reachable via Tab key order and activatable via Enter or Space.
2. THE System SHALL provide visible focus indicators on all interactive elements meeting WCAG 2.1 AA contrast requirements.
3. THE System SHALL use semantic HTML elements (`<button>`, `<form>`, `<label>`, `<table>`, `<nav>`, `<main>`, `<header>`) to ensure compatibility with screen readers.
4. ALL form inputs SHALL have associated `<label>` elements with explicit `htmlFor` bindings.
5. ALL images and icons with informational meaning SHALL have descriptive `alt` attributes or `aria-label` attributes.
6. THE System SHALL adapt its layout responsively at breakpoints for mobile (< 640px), tablet (640px–1024px), and desktop (> 1024px) screen widths.
7. THE System SHALL maintain a minimum colour contrast ratio of 4.5:1 for body text and 3:1 for large text and UI component boundaries, in accordance with WCAG 2.1 AA.
8. WHEN loading states are active, THE System SHALL display visible loading indicators and disable interactive elements to prevent duplicate submissions.
