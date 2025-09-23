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

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  mentorProfile: one(mentorProfiles, {
    fields: [users.id],
    references: [mentorProfiles.userId],
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
