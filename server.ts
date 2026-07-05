/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./src/server_db";
import { UserRole, ChatMessage, ChatSession, Ticket } from "./src/types";

dotenv.config();

// Helper to get Gemini Client lazily to prevent crash on startup if missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

async function startServer() {
  await db.init();

  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Middleware to authenticate users (simple auth header or query param for this applet)
  // To keep things robust, we support a simple Authorization header with the user ID: "Bearer <userId>"
  const authenticate = async (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized access" });
      return;
    }
    const userId = authHeader.split(" ")[1];
    const user = await db.getUser(userId);
    if (!user) {
      res.status(401).json({ error: "Invalid user session" });
      return;
    }
    req.user = user;
    next();
  };

  // Auth Endpoints
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
      }

      // Password strength check
      if (password.length < 6) {
        res.status(400).json({ error: "Password must be at least 6 characters long" });
        return;
      }

      // Check for duplicate
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: "An account with this email already exists" });
        return;
      }

      // Assign admin role if the email contains admin@support.com or user requests admin
      const role = email.toLowerCase().includes("admin") ? UserRole.ADMIN : UserRole.USER;
      const user = await db.createUser(name, email, password, role);

      res.status(201).json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const userRecord = await db.getUserByEmail(email);
      if (!userRecord || userRecord.passwordHash !== password) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      res.status(200).json({
        user: {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          role: userRecord.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/profile", authenticate, async (req: Request, res: Response) => {
    try {
      const { name, email, newId } = req.body;
      const currentUserId = req.user!.id;

      // Email format check if provided
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          res.status(400).json({ error: "Invalid email format" });
          return;
        }
      }

      // Check if newId already exists and isn't the current user's ID
      if (newId && newId !== currentUserId) {
        const existingUser = await db.getUser(newId);
        if (existingUser) {
          res.status(400).json({ error: "This User ID is already taken" });
          return;
        }
      }

      // Check if email already exists and isn't the current user's email
      if (email && email.toLowerCase() !== req.user!.email.toLowerCase()) {
        const existingUserWithEmail = await db.getUserByEmail(email);
        if (existingUserWithEmail) {
          res.status(400).json({ error: "An account with this email already exists" });
          return;
        }
      }

      const updatedUser = await db.updateUser(currentUserId, { name, email, id: newId });
      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user: updatedUser });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/google", async (req: Request, res: Response) => {
    try {
      const { name, email, googleId } = req.body;
      if (!email) {
        res.status(400).json({ error: "Google sign-in requires email" });
        return;
      }

      let user = await db.getUserByEmail(email) as any;
      if (!user) {
        const passwordHash = `google-${googleId || Math.random().toString(36).substring(2, 9)}`;
        const role = email.toLowerCase().includes("admin") ? UserRole.ADMIN : UserRole.USER;
        user = await db.createUser(name || "Google User", email, passwordHash, role);
      }

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Knowledge Base Endpoints
  app.get("/api/kb", async (req: Request, res: Response) => {
    try {
      const kb = await db.getKB();
      res.json({ kb });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/kb", authenticate, async (req: Request, res: Response) => {
    try {
      if (req.user?.role !== UserRole.ADMIN) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const { category, title, symptoms, solutionSteps } = req.body;
      if (!category || !title || !symptoms || !solutionSteps) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }
      const newItem = await db.createKBItem(category, title, symptoms, solutionSteps);
      res.status(201).json({ item: newItem });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/kb/:id", authenticate, async (req: Request, res: Response) => {
    try {
      if (req.user?.role !== UserRole.ADMIN) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const success = await db.deleteKBItem(req.params.id);
      if (!success) {
        res.status(404).json({ error: "KB item not found" });
        return;
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Ticket Management Endpoints
  app.get("/api/tickets", authenticate, async (req: Request, res: Response) => {
    try {
      const isAdmin = req.user?.role === UserRole.ADMIN;
      const tickets = await db.getTickets(isAdmin ? undefined : req.user?.id);
      res.json({ tickets });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tickets", authenticate, async (req: Request, res: Response) => {
    try {
      const { issue, category, priority } = req.body;
      if (!issue || !category || !priority) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }
      const ticket = await db.createTicket(
        req.user!.id,
        req.user!.name,
        issue,
        category,
        priority
      );
      res.status(201).json({ ticket });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/tickets/:id", authenticate, async (req: Request, res: Response) => {
    try {
      if (req.user?.role !== UserRole.ADMIN) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const { status, assignedTo, priority } = req.body;
      const updated = await db.updateTicket(req.params.id, { status, assignedTo, priority });
      if (!updated) {
        res.status(404).json({ error: "Ticket not found" });
        return;
      }
      res.json({ ticket: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Chats Endpoints
  app.get("/api/chats", authenticate, async (req: Request, res: Response) => {
    try {
      const isAdmin = req.user?.role === UserRole.ADMIN;
      const chats = await db.getChats(req.user!.id, isAdmin);
      res.json({ chats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chats", authenticate, async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const chat = await db.createChat(req.user!.id, title || "New Troubleshooting Session");
      res.status(201).json({ chat });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/chats/:id", authenticate, async (req: Request, res: Response) => {
    try {
      const chat = await db.getChat(req.params.id);
      if (!chat) {
        res.status(404).json({ error: "Chat not found" });
        return;
      }
      // Check auth boundary
      if (req.user?.role !== UserRole.ADMIN && chat.userId !== req.user?.id) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      res.json({ chat });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Interactive AI / Chatbot message handling
  app.post("/api/chats/:id/messages", authenticate, async (req: Request, res: Response) => {
    try {
      const { text, image } = req.body;
      if (!text) {
        res.status(400).json({ error: "Message text is required" });
        return;
      }

      const chat = await db.getChat(req.params.id);
      if (!chat) {
        res.status(404).json({ error: "Chat not found" });
        return;
      }

      // Check auth boundary
      if (req.user?.role !== UserRole.ADMIN && chat.userId !== req.user?.id) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      // Append user message
      const userMessage: ChatMessage = {
        id: `msg-${Math.random().toString(36).substring(2, 9)}`,
        sender: "user",
        text,
        timestamp: new Date().toISOString(),
        image: image || undefined
      };
      chat.messages.push(userMessage);

      // AI client check
      const ai = getGeminiClient();
      const kb = await db.getKB();

      let replyText = "";
      let mode: "ai" | "fallback" = ai ? "ai" : "fallback";

      if (chat.status === "solved" || chat.status === "escalated") {
        replyText = `This troubleshooting session is already marked as **${chat.status}**. If you have another technical issue, please return to the Dashboard and start a new chat.`;
      } else if (!chat.category) {
        // MODULE 3 & 4: Intent & Classification
        if (ai) {
          try {
            // Check for image
            let imagePart: any = null;
            if (image && image.startsWith("data:")) {
              const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              if (matches && matches.length === 3) {
                imagePart = {
                  inlineData: {
                    mimeType: matches[1],
                    data: matches[2]
                  }
                };
              }
            }

            const parts: any[] = [];
            if (imagePart) {
              parts.push(imagePart);
              parts.push({
                text: `You are an expert IT Support Assistant.
                Analyze the attached screenshot which shows a technical error/issue on the user's system.
                Also, the user describes the problem as: "${text}".
                
                Perform these tasks:
                1. Classify the issue into exactly one of these 8 categories:
                   - Network Issues
                   - Software Issues
                   - Hardware Issues
                   - Operating System Issues
                   - Performance Issues
                   - Security Issues
                   - Account Issues
                   - Printer Issues
                2. Extract the primary symptom keywords.
                3. Based SPECIFICALLY on the error seen in the screenshot, generate a custom step-by-step diagnostic solution path (4-5 detailed, sequential steps) to solve this exact problem (including error codes, BSOD codes, or driver names seen).
                
                Provide your output strictly in JSON format matching this schema:
                {
                  "category": "One of the 8 categories above",
                  "symptoms": ["keyword1", "keyword2"],
                  "reason": "Explain exactly what you see in the screenshot (including read error codes, cause of the error, etc.)",
                  "solutionSteps": ["Step 1...", "Step 2...", "Step 3...", "Step 4...", "Step 5..."]
                }
                `
              });
            } else {
              parts.push({
                text: `
                  Analyze this user technical issue description: "${text}"
                  Classify it into exactly one of these 8 categories:
                  1. Network Issues
                  2. Software Issues
                  3. Hardware Issues
                  4. Operating System Issues
                  5. Performance Issues
                  6. Security Issues
                  7. Account Issues
                  8. Printer Issues

                  Also extract the primary symptom keywords.
                  Provide your output strictly in JSON format matching this schema:
                  {
                    "category": "One of the 8 categories above",
                    "symptoms": ["keyword1", "keyword2"],
                    "reason": "Brief explanation"
                  }
                `
              });
            }

            const response = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: parts,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                    reason: { type: Type.STRING },
                    solutionSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["category", "symptoms"]
                }
              }
            });

            const result = JSON.parse(response.text?.trim() || "{}");
            chat.category = result.category;
            chat.symptoms = result.symptoms?.join(", ");
            if (result.solutionSteps && result.solutionSteps.length > 0) {
              chat.troubleshootingSteps = result.solutionSteps;
              chat.title = `Screen-Diagnosed: ${chat.category}`;
            }
          } catch (e) {
            console.error("AI classification failed. Using local classifier.", e);
            mode = "fallback";
          }
        }

        // If AI classifier was not used or failed, use local symptom matching
        if (!chat.category) {
          const lowerText = text.toLowerCase();
          let bestMatchCategory = "Software Issues"; // Default fallback
          let matchedSymptoms: string[] = [];

          // Find KB item with highest symptom overlap
          let maxOverlap = 0;
          for (const item of kb) {
            const overlap = item.symptoms.filter(sym => lowerText.includes(sym)).length;
            if (overlap > maxOverlap) {
              maxOverlap = overlap;
              bestMatchCategory = item.category;
              matchedSymptoms = item.symptoms.filter(sym => lowerText.includes(sym));
            }
          }

          chat.category = bestMatchCategory;
          chat.symptoms = matchedSymptoms.join(", ") || "general issues";
        }

        // Search the Knowledge Base for matching articles
        const matchedKB = kb.find(item => {
          const symptomsList = item.symptoms;
          return symptomsList.some(s => text.toLowerCase().includes(s.toLowerCase())) || item.category === chat.category;
        }) || kb[0]; // fallback to first item if none matched

        chat.troubleshootingSteps = matchedKB.solutionSteps;
        chat.currentStepIndex = 0;
        chat.title = `${chat.category} Troubleshooting`;

        replyText = `I have diagnosed your issue and classified it under **${chat.category}**. Let's run through a step-by-step troubleshooting plan.

**Step 1:** ${chat.troubleshootingSteps[0]}

*Did this resolve your problem? Please reply with **Yes** or **No**.*`;
      } else {
        // MODULE 6: Troubleshooting loop
        const currentStepIndex = chat.currentStepIndex ?? 0;
        const steps = chat.troubleshootingSteps ?? [];

        let userFeedback: "yes" | "no" | "unclear" = "unclear";

        if (ai) {
          try {
            // Let Gemini determine user feedback state (Solved, Not Solved, or detail)
            const feedbackPrompt = `
              A user is going through IT troubleshooting steps one by one.
              The user just replied: "${text}"

              Carefully determine if their reply means:
              - "yes"  → the issue IS resolved / the step worked (e.g. "yes", "it works now", "that fixed it")
              - "no"   → the issue is STILL NOT resolved / the step did NOT work (e.g. "no", "still broken",
                          "not working", "no still not resolved", "didn't help", "same problem")
              - "unclear" → cannot determine from the reply alone

              IMPORTANT: Phrases like "No, still not resolved" or "not fixed" mean "no".
              Do NOT treat the word "resolved" or "fixed" as positive if preceded by "not", "still not", or "no".

              Respond strictly in JSON:
              {
                "feedback": "yes" or "no" or "unclear",
                "explanation": "one sentence reason"
              }
            `;
            const fbResponse = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: feedbackPrompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    feedback: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["feedback"]
                }
              }
            });
            const fbResult = JSON.parse(fbResponse.text?.trim() || "{}");
            if (fbResult.feedback === "yes" || fbResult.feedback === "no") {
              userFeedback = fbResult.feedback;
            }
          } catch (e) {
            console.error("AI feedback parsing failed. Using local parser.", e);
            mode = "fallback";
          }
        }

        // Local feedback parsing fallback
        if (userFeedback === "unclear") {
          const cleanText = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

          // Helper: whole-word match to avoid "resolved" matching inside "not resolved"
          const hasWord = (src: string, word: string) =>
            new RegExp(`(^|\\s)${word}(\\s|$)`).test(src);

          // Strong NO signals — checked FIRST so "No, still not resolved" → "no"
          const noWords  = ["no", "nope", "still", "not", "failed", "doesnt", "didnt",
                            "same", "overheating", "still not", "not working", "not resolved",
                            "not fixed", "not solved", "doesnt work", "didnt work", "same issue"];

          // YES signals — only match if no strong NO signal present
          const yesWords = ["yes", "yeah", "yup", "fixed", "works", "working", "it did",
                            "that worked", "its working", "all good", "problem solved",
                            "issue resolved", "its fixed"];

          // Check NO first — stronger signal
          if (noWords.some(w => hasWord(cleanText, w) || cleanText.includes(w))) {
            userFeedback = "no";
          } else if (yesWords.some(w => hasWord(cleanText, w) || cleanText.includes(w))) {
            userFeedback = "yes";
          }
        }

        if (userFeedback === "yes") {
          chat.status = "solved";
          replyText = `Fantastic! I am thrilled to hear that the step resolved your technical issue. 🎉

I've marked this troubleshooting session as **Solved**. Please feel free to rate this solution or let me know if there's anything else I can help with!`;
        } else {
          // Move to next step if available
          const nextStepIndex = currentStepIndex + 1;
          if (nextStepIndex < steps.length) {
            chat.currentStepIndex = nextStepIndex;
            replyText = `I understand that didn't resolve the issue. Let's try the next troubleshooting step.

**Step ${nextStepIndex + 1}:** ${steps[nextStepIndex]}

*Did this resolve your problem? Please reply with **Yes** or **No**.*`;
          } else {
            // Out of steps! MODULE 7: Escalate & Create Support Ticket
            chat.status = "escalated";

            // Priority detection
            let priority: "Low" | "Medium" | "High" = "Low";
            const priorityText = (chat.category + " " + text).toLowerCase();
            if (priorityText.includes("crash") || priorityText.includes("blue screen") || priorityText.includes("bsod") || priorityText.includes("security") || priorityText.includes("virus")) {
              priority = "High";
            } else if (priorityText.includes("offline") || priorityText.includes("internet") || priorityText.includes("wifi") || priorityText.includes("network")) {
              priority = "Medium";
            }

            const ticket = await db.createTicket(
              chat.userId,
              req.user!.name,
              chat.messages[0]?.text || "Unresolved technical issue",
              chat.category,
              priority
            );

            chat.ticketId = ticket.id;

            replyText = `I have run through all our available solutions in the Knowledge Base, but your issue is still unresolved. 

To get you the expert help you need, I have created a **Support Ticket** for you. An IT support engineer has been notified and will contact you shortly.

**Ticket details:**
- **Ticket ID:** #${ticket.id}
- **Category:** ${ticket.category}
- **Priority:** ${ticket.priority}
- **Status:** ${ticket.status} (Open)

You can track your tickets anytime via the Dashboard.`;
          }
        }
      }

      // Save assistant message
      const assistantMessage: ChatMessage = {
        id: `msg-${Math.random().toString(36).substring(2, 9)}`,
        sender: "assistant",
        text: replyText,
        timestamp: new Date().toISOString()
      };
      chat.messages.push(assistantMessage);

      await db.updateChat(chat);

      res.status(200).json({ chat, mode });
    } catch (error: any) {
      console.error("Message handling error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Save chat feedback rating
  app.post("/api/chats/:id/rating", authenticate, async (req: Request, res: Response) => {
    try {
      const { rating } = req.body;
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        res.status(400).json({ error: "Invalid rating value" });
        return;
      }
      const chat = await db.getChat(req.params.id);
      if (!chat) {
        res.status(404).json({ error: "Chat not found" });
        return;
      }
      chat.rating = rating;
      await db.updateChat(chat);
      res.json({ success: true, chat });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Diagnose local device health using Gemini 3.5 Flash
  app.post("/api/diagnose-health", authenticate, async (req: Request, res: Response) => {
    try {
      const { metrics } = req.body;
      if (!metrics) {
        res.status(400).json({ error: "System metrics are required" });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Offline Diagnostic Report Fallback
        res.json({
          report: `### System Health Optimization Report (Offline mode)
- **Status Summary:** **Warning State** (Simulated)
- **Primary Diagnostics:**
  - **CPU Temperature:** ${metrics.cpuTemp || "55"}°C (Elevated, target is < 50°C)
  - **CPU Core Load:** ${metrics.cpuUsage || "42"}%
  - **RAM Memory Capacity:** ${metrics.ramUsage || "65"}% active allocation
  - **Hard Drive Health Index:** ${metrics.diskHealth || "Optimal"}
  - **Active Device Power:** ${metrics.batteryLevel || "92"}% charge
- **Offline Resolution Recommendations:**
  1. Terminate secondary browser tabs or high-overhead background processes.
  2. Clear temporary user data folders and cache.
  3. Ensure active ventilation paths are clear of dust or obstacles.
  4. Perform standard security scanner sweep.`
        });
        return;
      }

      const healthPrompt = `
        You are Aura IT Diagnostics Agent. Perform a comprehensive analysis of the user's current device health metrics:
        - CPU Cores Available: ${metrics.cpuCores || "Unknown"}
        - Detected Device Memory: ${metrics.deviceMemory ? `${metrics.deviceMemory} GB` : "Unknown"}
        - Current CPU Utilization: ${metrics.cpuUsage}%
        - Active Memory Allocation: ${metrics.ramUsage}%
        - Hard Drive Health Rating: ${metrics.diskHealth || "Good"}
        - Power Battery Level: ${metrics.batteryLevel || "100"}%
        - CPU Core Temperature: ${metrics.cpuTemp || "45"}°C
        - Browser Interface Language: ${metrics.language || "en"}
        - Operating Environment (User Agent): ${metrics.userAgent || "Unknown"}

        Create a highly polished, professional Markdown diagnostic report including:
        1. **System Health Status Overview** (Provide a rating: e.g. EXCELLENT, WARNING, or CRITICAL based on temperature, CPU load, and RAM).
        2. **Detailed Resource Analysis** (explain in clear, simple terms what the metrics mean, specifically focusing on CPU Temp, Load, and Memory limits).
        3. **Proactive Optimization Guidelines** (Actionable steps tailored specifically to their stats. E.g. if CPU Temp or usage is high, recommend cooling steps or closing high-impact browser processes).
        
        Keep it direct, beautifully structured with bullet points, and extremely useful for a technical resume demonstration.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: healthPrompt
      });

      res.json({ report: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Dashboard / Management Endpoints
  app.get("/api/admin/users", authenticate, async (req: Request, res: Response) => {
    try {
      if (req.user?.role !== UserRole.ADMIN) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const users = await db.getUsers();
      res.json({ users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve static assets & build Vite configuration in development vs production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Server booted on port ${PORT}`);
  });
}

// Add typing extension to Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

startServer().catch((err) => {
  console.error("Failed to start Express server:", err);
});
