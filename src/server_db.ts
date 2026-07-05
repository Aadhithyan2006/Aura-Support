/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs/promises";
import path from "path";
import { User, UserRole, ChatSession, KnowledgeBaseItem, Ticket } from "./types";

const DB_FILE = path.join(process.cwd(), "db.json");

interface DatabaseSchema {
  users: Record<string, User & { passwordHash: string }>;
  chats: Record<string, ChatSession>;
  kb: Record<string, KnowledgeBaseItem>;
  tickets: Record<string, Ticket>;
}

// Initial default Knowledge Base
const DEFAULT_KB: KnowledgeBaseItem[] = [
  {
    id: "kb-wifi",
    category: "Network Issues",
    title: "Troubleshooting Wi-Fi & Internet Connectivity",
    symptoms: ["wifi", "wi-fi", "internet", "router", "connection", "ethernet", "offline"],
    solutionSteps: [
      "Verify that your Wi-Fi is enabled on your device (check physical switch or settings menu).",
      "Restart your wireless router by unplugging its power cord for 30 seconds, then plugging it back in.",
      "Disconnect from your Wi-Fi network and reconnect, ensuring you type the correct security password.",
      "Open your device's Network Adapter settings and run the automated Network Troubleshooter.",
      "Update your device's Network Card driver software through the Device Manager."
    ]
  },
  {
    id: "kb-overheat",
    category: "Hardware Issues",
    title: "Laptop Overheating & Fan Noise Troubleshooting",
    symptoms: ["overheating", "hot", "fan", "noise", "shutdown", "warm"],
    solutionSteps: [
      "Ensure the laptop is placed on a flat, hard surface (like a desk) to allow proper airflow. Avoid using it on soft surfaces like beds or carpets.",
      "Check if the cooling vents are clear of dust. If visible dust is present, gently blow it out using compressed air.",
      "Listen closely to verify if the cooling fan is running at all. If it's silent or making grinding noises, the fan may need replacement.",
      "Open Task Manager (Ctrl+Shift+Esc) or Activity Monitor to identify if any background application is utilizing 100% CPU, and close it.",
      "Consider adjusting your OS power plan to 'Balanced' or 'Power Saver' mode to reduce CPU thermal output."
    ]
  },
  {
    id: "kb-printer",
    category: "Printer Issues",
    title: "Resolving Printer Offline, Jams, or Error States",
    symptoms: ["printer", "printing", "offline", "jam", "ink", "toner", "blurry"],
    solutionSteps: [
      "Verify the printer is powered on and its physical display does not show any warning lights or paper jams.",
      "Ensure the USB connection cable is securely attached, or confirm that both the printer and your laptop are on the exact same Wi-Fi network.",
      "Restart the Print Spooler service on your computer (via Windows Services or MacOS Print Queue).",
      "Check if 'Use Printer Offline' is checked in your system's Printers & Devices settings, and uncheck it.",
      "Remove the printer driver completely from your device settings, download the latest version from the manufacturer's website, and reinstall it."
    ]
  },
  {
    id: "kb-update",
    category: "Operating System Issues",
    title: "Fixing Stuck OS Updates and Blue Screen (BSOD) Errors",
    symptoms: ["windows update", "blue screen", "bsod", "boot", "crash", "stuck update"],
    solutionSteps: [
      "Disconnect all non-essential external hardware (USBs, second monitors, printers) and attempt to restart.",
      "Run the system's built-in Update Troubleshooter (e.g., Settings > Update & Security > Troubleshoot).",
      "Open Command Prompt as Admin and run the System File Checker command: 'sfc /scannow' to repair corrupt files.",
      "Boot into Safe Mode with Networking to see if the operating system functions correctly without third-party drivers.",
      "Perform a System Restore to a restore point created before the update or crash started occurring."
    ]
  },
  {
    id: "kb-slow",
    category: "Performance Issues",
    title: "Boosting Sluggish Computer and Resolving High CPU Usage",
    symptoms: ["slow", "sluggish", "lag", "cpu", "ram", "memory", "freezing"],
    solutionSteps: [
      "Restart your computer completely to clear the RAM cache and terminate orphaned system processes.",
      "Open Task Manager (Ctrl+Shift+Esc) or Activity Monitor and sort by CPU or Memory usage. End any unneeded processes using over 20%.",
      "Disable unnecessary startup applications in your task manager's 'Startup' tab to reduce boot-time overhead.",
      "Run a Disk Cleanup or Storage Sense scan to delete temporary files and free up at least 15% of your drive space.",
      "Check your hard drive health (or swap HDD for an SSD) and verify that you have at least 8GB of RAM for standard tasks."
    ]
  },
  {
    id: "kb-virus",
    category: "Security Issues",
    title: "Malware Infection and Suspicious Popup Troubleshooting",
    symptoms: ["virus", "malware", "antivirus", "popup", "adware", "firewall"],
    solutionSteps: [
      "Immediately disconnect your machine from the internet (Wi-Fi or Ethernet) to prevent data exfiltration.",
      "Boot your machine into Safe Mode and run a full system scan using your built-in security tool (e.g., Windows Defender).",
      "Check your browser's extension manager and uninstall any recently added or unrecognized browser extensions.",
      "Check your system's Startup list for unrecognized programs and disable them from launching.",
      "Download a trusted on-demand secondary scanner (like Malwarebytes) on another machine, copy the installer via USB, and scan your system."
    ]
  }
];

const DEFAULT_USERS = {
  "admin-1": {
    id: "admin-1",
    name: "IT Lead Support",
    email: "admin@support.com",
    role: UserRole.ADMIN,
    passwordHash: "admin123" // In production we would hash, but simple matching is used for this support app
  },
  "user-1": {
    id: "user-1",
    name: "Alex Johnson",
    email: "user@support.com",
    role: UserRole.USER,
    passwordHash: "user123"
  }
};

const DEFAULT_TICKETS: Record<string, Ticket> = {
  "tick-1001": {
    id: "tick-1001",
    userId: "user-1",
    userName: "Alex Johnson",
    issue: "Company printer has a continuous paper jam error",
    category: "Printer Issues",
    priority: "Low",
    status: "Open",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  },
  "tick-1002": {
    id: "tick-1002",
    userId: "user-1",
    userName: "Alex Johnson",
    issue: "VPN fails to establish connection after router change",
    category: "Network Issues",
    priority: "Medium",
    status: "Open",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  }
};

class ServerDatabase {
  private memoryDb: DatabaseSchema = {
    users: { ...DEFAULT_USERS },
    chats: {},
    kb: {},
    tickets: { ...DEFAULT_TICKETS }
  };

  constructor() {
    DEFAULT_KB.forEach(item => {
      this.memoryDb.kb[item.id] = item;
    });
  }

  async init() {
    try {
      const exists = await fs.access(DB_FILE).then(() => true).catch(() => false);
      if (exists) {
        const fileContent = await fs.readFile(DB_FILE, "utf-8");
        const parsed = JSON.parse(fileContent);
        this.memoryDb = {
          users: parsed.users || { ...DEFAULT_USERS },
          chats: parsed.chats || {},
          kb: parsed.kb || this.memoryDb.kb,
          tickets: parsed.tickets || { ...DEFAULT_TICKETS }
        };
        console.log("Database successfully loaded from", DB_FILE);
      } else {
        await this.save();
        console.log("Database file created and initialized at", DB_FILE);
      }
    } catch (error) {
      console.error("Failed to initialize database file. Falling back to in-memory mode.", error);
    }
  }

  private async save() {
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(this.memoryDb, null, 2), "utf-8");
    } catch (error) {
      console.error("Failed to save database file:", error);
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const user = this.memoryDb.users[id];
    if (!user) return undefined;
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async getUserByEmail(email: string) {
    return Object.values(this.memoryDb.users).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(name: string, email: string, passwordHash: string, role: UserRole = UserRole.USER): Promise<User> {
    const id = `usr-${Math.random().toString(36).substring(2, 9)}`;
    const newUser = { id, name, email, role, passwordHash };
    this.memoryDb.users[id] = newUser;
    await this.save();
    return { id, name, email, role };
  }

  async updateUser(id: string, updates: { name?: string; email?: string; id?: string }): Promise<User | undefined> {
    const user = this.memoryDb.users[id];
    if (!user) return undefined;
    
    const newId = updates.id || id;
    const updatedUser = {
      ...user,
      id: newId,
      name: updates.name ?? user.name,
      email: updates.email ?? user.email,
    };
    
    if (newId !== id) {
      delete this.memoryDb.users[id];
    }
    this.memoryDb.users[newId] = updatedUser;
    
    // Update chats associated with this user
    for (const chatId in this.memoryDb.chats) {
      if (this.memoryDb.chats[chatId].userId === id) {
        this.memoryDb.chats[chatId].userId = newId;
      }
    }
    
    // Update tickets associated with this user
    for (const ticketId in this.memoryDb.tickets) {
      if (this.memoryDb.tickets[ticketId].userId === id) {
        this.memoryDb.tickets[ticketId].userId = newId;
        if (updates.name) {
          this.memoryDb.tickets[ticketId].userName = updates.name;
        }
      }
    }
    
    await this.save();
    return { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role };
  }

  async getUsers(): Promise<User[]> {
    return Object.values(this.memoryDb.users).map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
  }

  // Chats
  async getChats(userId: string, isAdmin: boolean = false): Promise<ChatSession[]> {
    const chats = Object.values(this.memoryDb.chats);
    if (isAdmin) return chats.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return chats
      .filter(c => c.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getChat(id: string): Promise<ChatSession | undefined> {
    return this.memoryDb.chats[id];
  }

  async createChat(userId: string, title: string): Promise<ChatSession> {
    const id = `chat-${Math.random().toString(36).substring(2, 9)}`;
    const newChat: ChatSession = {
      id,
      userId,
      title,
      status: "active",
      messages: [],
      createdAt: new Date().toISOString()
    };
    this.memoryDb.chats[id] = newChat;
    await this.save();
    return newChat;
  }

  async updateChat(chat: ChatSession): Promise<ChatSession> {
    this.memoryDb.chats[chat.id] = chat;
    await this.save();
    return chat;
  }

  // Knowledge Base
  async getKB(): Promise<KnowledgeBaseItem[]> {
    return Object.values(this.memoryDb.kb);
  }

  async createKBItem(category: string, title: string, symptoms: string[], solutionSteps: string[]): Promise<KnowledgeBaseItem> {
    const id = `kb-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: KnowledgeBaseItem = { id, category, title, symptoms, solutionSteps };
    this.memoryDb.kb[id] = newItem;
    await this.save();
    return newItem;
  }

  async deleteKBItem(id: string): Promise<boolean> {
    if (this.memoryDb.kb[id]) {
      delete this.memoryDb.kb[id];
      await this.save();
      return true;
    }
    return false;
  }

  // Tickets
  async getTickets(userId?: string): Promise<Ticket[]> {
    const tickets = Object.values(this.memoryDb.tickets);
    if (!userId) return tickets.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return tickets
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async createTicket(userId: string, userName: string, issue: string, category: string, priority: "Low" | "Medium" | "High"): Promise<Ticket> {
    const id = `tick-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: Ticket = {
      id,
      userId,
      userName,
      issue,
      category,
      priority,
      status: "Open",
      createdAt: new Date().toISOString()
    };
    this.memoryDb.tickets[id] = newTicket;
    await this.save();
    return newTicket;
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticket = this.memoryDb.tickets[id];
    if (!ticket) return undefined;
    const updated = { ...ticket, ...updates };
    this.memoryDb.tickets[id] = updated;
    await this.save();
    return updated;
  }
}

export const db = new ServerDatabase();
