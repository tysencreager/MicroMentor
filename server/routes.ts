import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupMockAuth, isMockAuthenticated } from "./mockAuth";
import { generateAIInsights } from "./aiService";
import {
  insertQuestionSchema,
  insertAnswerSchema,
  insertMentorProfileSchema,
  insertMentorApplicationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication first - use mock auth in development if enabled
  const useMockAuth = process.env.USE_MOCK_AUTH === 'true';
  const authMiddleware = useMockAuth ? isMockAuthenticated : isAuthenticated;

  if (useMockAuth) {
    await setupMockAuth(app);
  } else {
    await setupAuth(app);
  }

  // Auth user route
  app.get('/api/auth/user', authMiddleware, async (req: any, res) => {
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
  app.post("/api/questions", authMiddleware, async (req: any, res) => {

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

  app.get("/api/questions/mentee", authMiddleware, async (req: any, res) => {
    try {
      const questions = await storage.getQuestionsByMentee(req.user.claims.sub);
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/questions/pending", authMiddleware, async (req: any, res) => {
    try {
      const questions = await storage.getPendingQuestions();
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Answer routes
  app.post("/api/answers", authMiddleware, async (req: any, res) => {
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

  app.post("/api/mentors/profile", authMiddleware, async (req: any, res) => {
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

  app.get("/api/mentors/profile", authMiddleware, async (req: any, res) => {
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

  // Mentor application routes
  app.post("/api/mentors/apply", authMiddleware, async (req: any, res) => {
    try {
      // Check if user already has an application
      const existingApplication = await storage.getMentorApplication(req.user.claims.sub);
      if (existingApplication) {
        return res.status(400).json({ error: "You have already submitted a mentor application" });
      }

      const applicationData = insertMentorApplicationSchema.parse({
        ...req.body,
        userId: req.user.claims.sub
      });

      const application = await storage.createMentorApplication(applicationData);
      res.status(201).json(application);
    } catch (error: any) {
      console.error("Error creating mentor application:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/mentors/application", authMiddleware, async (req: any, res) => {
    try {
      const application = await storage.getMentorApplication(req.user.claims.sub);
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/mentors/application/:id/status", authMiddleware, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      // TODO: Add admin authorization check here
      if (!['pending', 'under_review', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const application = await storage.updateMentorApplicationStatus(id, status, adminNotes);
      res.json(application);
    } catch (error: any) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin routes - get all applications
  app.get("/api/admin/applications", authMiddleware, async (req: any, res) => {
    try {
      // TODO: Add admin authorization check here
      const applications = await storage.getAllMentorApplications();
      res.json(applications);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
