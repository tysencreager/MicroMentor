import type { Express, RequestHandler } from "express";
import session from "express-session";
import { storage } from "./storage";

// Mock users for local development
const MOCK_USERS = {
  mentee: {
    id: "mock-mentee-1",
    email: "mentee@example.com",
    firstName: "Test",
    lastName: "Mentee",
    profileImageUrl: null,
    role: "mentee" as const,
  },
  mentor: {
    id: "mock-mentor-1",
    email: "mentor@example.com",
    firstName: "Test",
    lastName: "Mentor",
    profileImageUrl: null,
    role: "mentor" as const,
  },
  both: {
    id: "mock-both-1",
    email: "both@example.com",
    firstName: "Test",
    lastName: "Both",
    profileImageUrl: null,
    role: "both" as const,
  },
};

export async function setupMockAuth(app: Express) {
  console.log("🔓 Using MOCK authentication for local development");

  // Simple session setup for mock auth (in-memory store)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "local-dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // false for local development
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
    })
  );

  // Initialize mock session middleware
  app.use((req: any, res, next) => {
    // If no user in session, default to mentee for easier testing
    if (!req.session.mockUser) {
      req.session.mockUser = MOCK_USERS.mentee;
    }

    // Attach mock user to request
    req.user = {
      claims: {
        sub: req.session.mockUser.id,
        email: req.session.mockUser.email,
        first_name: req.session.mockUser.firstName,
        last_name: req.session.mockUser.lastName,
        profile_image_url: req.session.mockUser.profileImageUrl,
      },
    };

    next();
  });

  // Mock login routes to switch between user types
  app.get("/api/login", (req: any, res) => {
    res.json({
      message: "Mock auth is enabled. Use /api/mock-login/:role to switch users",
      availableRoles: Object.keys(MOCK_USERS),
      currentUser: req.session.mockUser,
    });
  });

  app.get("/api/mock-login/:role", async (req: any, res) => {
    const role = req.params.role as keyof typeof MOCK_USERS;

    if (!MOCK_USERS[role]) {
      return res.status(400).json({
        error: "Invalid role. Choose: mentee, mentor, or both"
      });
    }

    const mockUser = MOCK_USERS[role];
    req.session.mockUser = mockUser;

    // Ensure user exists in database
    try {
      await storage.upsertUser(mockUser);

      // If role is mentor or both, create a mentor profile if it doesn't exist
      if (role === "mentor" || role === "both") {
        const user = await storage.getUser(mockUser.id);
        if (!user?.mentorProfile) {
          await storage.upsertMentorProfile({
            userId: mockUser.id,
            title: "Senior Software Engineer",
            company: "Tech Company",
            bio: "Mock mentor for local development",
            expertise: ["career", "technical", "leadership"],
            weeklyCapacity: 5,
            isActive: true,
          });
        }
      }
    } catch (error) {
      console.error("Error setting up mock user:", error);
    }

    res.json({
      message: `Logged in as ${role}`,
      user: mockUser,
    });
  });

  app.get("/api/logout", (req: any, res) => {
    req.session.mockUser = MOCK_USERS.mentee; // Reset to default
    res.json({ message: "Logged out, reset to default mentee" });
  });

  // Initialize mock users in database
  try {
    for (const mockUser of Object.values(MOCK_USERS)) {
      await storage.upsertUser(mockUser);
    }
    console.log("✅ Mock users initialized in database");
  } catch (error) {
    console.error("Error initializing mock users:", error);
  }
}

export const isMockAuthenticated: RequestHandler = (req: any, res, next) => {
  if (req.user && req.user.claims && req.user.claims.sub) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
