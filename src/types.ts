/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  image?: string; // base64 representation of any uploaded screenshot
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  category?: string;
  status: "active" | "solved" | "escalated";
  ticketId?: string;
  currentStepIndex?: number;
  troubleshootingSteps?: string[];
  symptoms?: string;
  messages: ChatMessage[];
  createdAt: string;
  rating?: number; // feedback rating out of 5 stars
}

export interface KnowledgeBaseItem {
  id: string;
  category: string;
  title: string;
  symptoms: string[]; // keywords or symptom phrases
  solutionSteps: string[]; // step-by-step guidance
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  issue: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "Closed";
  assignedTo?: string;
  createdAt: string;
}
