import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for Replit Auth integration
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role", { enum: ["mentee", "mentor", "both"] }).notNull().default("mentee"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mentor profiles with expertise and capacity
export const mentorProfiles = pgTable("mentor_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title"),
  company: text("company"),
  bio: text("bio"),
  expertise: text("expertise").array(),
  weeklyCapacity: integer("weekly_capacity").notNull().default(5),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Questions from mentees
export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menteeId: varchar("mentee_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  category: text("category", { 
    enum: ["career", "confidence", "leadership", "technical", "personal"] 
  }).notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  status: text("status", { 
    enum: ["pending", "matched", "answered", "closed"] 
  }).notNull().default("pending"),
  menteeProfile: jsonb("mentee_profile"), // Background info for context
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Answers from mentors
export const answers = pgTable("answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionId: varchar("question_id").notNull().references(() => questions.id),
  mentorId: varchar("mentor_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  aiInsights: jsonb("ai_insights"), // Generated key takeaways and action steps
  isHelpful: boolean("is_helpful"), // Mentee feedback
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Mentor applications table for verification process
export const mentorApplications = pgTable("mentor_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status", { enum: ["pending", "under_review", "approved", "rejected"] }).notNull().default("pending"),
  
  // Professional Information
  currentTitle: text("current_title").notNull(),
  currentCompany: text("current_company").notNull(),
  workEmail: varchar("work_email").notNull(),
  linkedinProfile: varchar("linkedin_profile"),
  yearsExperience: integer("years_experience").notNull(),
  expertise: text("expertise").array().notNull(),
  industries: text("industries").array().notNull(),
  
  // Background Information
  education: jsonb("education").notNull(), // { degree, institution, year, field }
  workHistory: jsonb("work_history").notNull(), // [{ title, company, years, description }]
  certifications: jsonb("certifications"), // [{ name, issuer, year, credentialId }]
  
  // Mentoring Information
  bio: text("bio").notNull(),
  mentoringExperience: text("mentoring_experience"),
  mentoringMotivation: text("mentoring_motivation").notNull(),
  availabilityHours: integer("availability_hours").notNull(), // per week
  preferredCategories: text("preferred_categories").array().notNull(),
  
  // References
  references: jsonb("references").notNull(), // [{ name, title, company, email, relationship }]
  
  // Verification Status
  workEmailVerified: boolean("work_email_verified").default(false),
  linkedinVerified: boolean("linkedin_verified").default(false),
  backgroundCheckStatus: text("background_check_status", { enum: ["pending", "in_progress", "completed", "failed"] }).default("pending"),
  referencesContacted: boolean("references_contacted").default(false),
  
  // Admin Notes and Review
  adminNotes: text("admin_notes"),
  rejectionReason: text("rejection_reason"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  mentorProfile: one(mentorProfiles, {
    fields: [users.id],
    references: [mentorProfiles.userId],
  }),
  mentorApplication: one(mentorApplications, {
    fields: [users.id],
    references: [mentorApplications.userId],
  }),
  questionsAsked: many(questions),
  answersGiven: many(answers),
}));

export const mentorProfilesRelations = relations(mentorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [mentorProfiles.userId],
    references: [users.id],
  }),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  mentee: one(users, {
    fields: [questions.menteeId],
    references: [users.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  mentor: one(users, {
    fields: [answers.mentorId],
    references: [users.id],
  }),
}));

export const mentorApplicationsRelations = relations(mentorApplications, ({ one }) => ({
  user: one(users, {
    fields: [mentorApplications.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [mentorApplications.reviewedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMentorProfileSchema = createInsertSchema(mentorProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  text: z.string().min(10, "Question must be at least 10 characters"),
  category: z.enum(["career", "confidence", "leadership", "technical", "personal"]),
});

export const insertAnswerSchema = createInsertSchema(answers).omit({
  id: true,
  aiInsights: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  text: z.string().min(20, "Answer must be at least 20 characters"),
});

export const insertMentorApplicationSchema = createInsertSchema(mentorApplications).omit({
  id: true,
  status: true,
  workEmailVerified: true,
  linkedinVerified: true,
  backgroundCheckStatus: true,
  referencesContacted: true,
  adminNotes: true,
  rejectionReason: true,
  reviewedBy: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  currentTitle: z.string().min(2, "Current title is required"),
  currentCompany: z.string().min(2, "Current company is required"),
  workEmail: z.string().email("Valid work email is required"),
  yearsExperience: z.number().min(1, "Minimum 1 year of experience required"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  mentoringMotivation: z.string().min(30, "Please explain your motivation"),
  availabilityHours: z.number().min(1).max(20, "Availability must be between 1-20 hours per week"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert; // Required for Replit Auth
export type User = typeof users.$inferSelect;
export type InsertMentorProfile = z.infer<typeof insertMentorProfileSchema>;
export type MentorProfile = typeof mentorProfiles.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type Answer = typeof answers.$inferSelect;
export type InsertMentorApplication = z.infer<typeof insertMentorApplicationSchema>;
export type MentorApplication = typeof mentorApplications.$inferSelect;

// Combined types for UI
export type QuestionWithAnswer = Question & {
  answers: (Answer & {
    mentor: User & { mentorProfile: MentorProfile | null };
  })[];
  mentee: User;
};

export type MentorWithProfile = User & {
  mentorProfile: MentorProfile | null;
};
