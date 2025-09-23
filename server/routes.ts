import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertQuestionSchema, 
  insertAnswerSchema, 
  insertMentorProfileSchema 
} from "@shared/schema";

// Helper to get AI insights for an answer
async function generateAIInsights(question: string, answer: string) {
  try {
    // TODO: Replace with actual OpenAI integration
    const mockInsights = {
      keyTakeaways: [
        "Focus on actionable steps",
        "Build confidence through practice",
        "Leverage your unique perspective"
      ],
      actionSteps: [
        "Schedule a practice conversation this week",
        "Research specific examples in your industry",
        "Connect with 2-3 people who've faced similar challenges"
      ]
    };
    return mockInsights;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication first
  await setupAuth(app);

  // Auth user route
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Question routes
  app.post("/api/questions", isAuthenticated, async (req: any, res) => {

    try {
      const questionData = insertQuestionSchema.parse({
        ...req.body,
        menteeId: req.user.claims.sub
      });
      const question = await storage.createQuestion(questionData);
      res.status(201).json(question);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/questions/mentee", isAuthenticated, async (req: any, res) => {
    try {
      const questions = await storage.getQuestionsByMentee(req.user.claims.sub);
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/questions/pending", isAuthenticated, async (req: any, res) => {
    try {
      const questions = await storage.getPendingQuestions();
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Answer routes
  app.post("/api/answers", isAuthenticated, async (req: any, res) => {
    try {
      const answerData = insertAnswerSchema.parse({
        ...req.body,
        mentorId: req.user.claims.sub
      });
      
      // Create the answer
      const answer = await storage.createAnswer(answerData);
      
      // Update question status to answered
      await storage.updateQuestionStatus(answerData.questionId, "answered");
      
      // Generate AI insights asynchronously
      const insights = await generateAIInsights(req.body.questionText || '', answerData.text);
      if (insights) {
        await storage.updateAnswerInsights(answer.id, insights);
      }
      
      res.status(201).json(answer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Mentor routes
  app.get("/api/mentors", async (req, res) => {
    try {
      const mentors = await storage.getActiveMentors();
      res.json(mentors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/mentors/profile", isAuthenticated, async (req: any, res) => {
    try {
      const profileData = insertMentorProfileSchema.parse({
        ...req.body,
        userId: req.user.claims.sub
      });
      const profile = await storage.createMentorProfile(profileData);
      res.status(201).json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/mentors/profile", isAuthenticated, async (req: any, res) => {
    try {
      const profile = await storage.getMentorProfile(req.user.claims.sub);
      if (!profile) {
        return res.status(404).json({ error: "Mentor profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
