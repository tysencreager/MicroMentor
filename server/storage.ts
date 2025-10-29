import { 
  type User, 
  type InsertUser,
  type UpsertUser,
  type Question, 
  type InsertQuestion, 
  type Answer, 
  type InsertAnswer, 
  type MentorProfile, 
  type InsertMentorProfile,
  type MentorApplication,
  type InsertMentorApplication,
  type QuestionWithAnswer,
  type MentorWithProfile,
  users,
  questions,
  answers,
  mentorProfiles,
  mentorApplications
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, isNull } from "drizzle-orm";

export interface IStorage {
  // User management - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Additional user methods
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;

  // Mentor profiles
  getMentorProfile(userId: string): Promise<MentorProfile | undefined>;
  createMentorProfile(profile: InsertMentorProfile): Promise<MentorProfile>;
  updateMentorProfile(userId: string, profile: Partial<InsertMentorProfile>): Promise<MentorProfile>;
  getActiveMentors(): Promise<MentorWithProfile[]>;

  // Questions
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestionsByMentee(menteeId: string): Promise<QuestionWithAnswer[]>;
  getPendingQuestions(): Promise<QuestionWithAnswer[]>;
  updateQuestionStatus(questionId: string, status: string): Promise<Question>;

  // Answers
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  updateAnswerInsights(answerId: string, insights: any): Promise<Answer>;
  getAnswersByMentor(mentorId: string): Promise<Answer[]>;
  
  // Mentor applications
  getMentorApplication(userId: string): Promise<MentorApplication | undefined>;
  getAllMentorApplications(): Promise<MentorApplication[]>;
  createMentorApplication(application: InsertMentorApplication): Promise<MentorApplication>;
  updateMentorApplicationStatus(id: string, status: string, adminNotes?: string): Promise<MentorApplication>;
}

export class DatabaseStorage implements IStorage {
  // User management - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updateUser, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Mentor profiles
  async getMentorProfile(userId: string): Promise<MentorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(mentorProfiles)
      .where(eq(mentorProfiles.userId, userId));
    return profile || undefined;
  }

  async createMentorProfile(profile: InsertMentorProfile): Promise<MentorProfile> {
    const [mentorProfile] = await db
      .insert(mentorProfiles)
      .values(profile)
      .returning();
    return mentorProfile;
  }

  async updateMentorProfile(userId: string, profile: Partial<InsertMentorProfile>): Promise<MentorProfile> {
    const [mentorProfile] = await db
      .update(mentorProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(mentorProfiles.userId, userId))
      .returning();
    return mentorProfile;
  }

  async getActiveMentors(): Promise<MentorWithProfile[]> {
    const results = await db
      .select()
      .from(users)
      .innerJoin(mentorProfiles, eq(users.id, mentorProfiles.userId))
      .where(eq(mentorProfiles.isActive, true))
      .orderBy(asc(mentorProfiles.createdAt));
    
    return results.map(result => ({
      ...result.users,
      mentorProfile: result.mentor_profiles
    }));
  }

  // Questions
  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db
      .insert(questions)
      .values(question)
      .returning();
    return newQuestion;
  }

  async getQuestionsByMentee(menteeId: string): Promise<QuestionWithAnswer[]> {
    const results = await db.query.questions.findMany({
      where: eq(questions.menteeId, menteeId),
      with: {
        mentee: true,
        answers: {
          with: {
            mentor: {
              with: {
                mentorProfile: true
              }
            }
          }
        }
      },
      orderBy: desc(questions.createdAt)
    });
    
    return results as QuestionWithAnswer[];
  }

  async getPendingQuestions(): Promise<QuestionWithAnswer[]> {
    const results = await db.query.questions.findMany({
      where: eq(questions.status, "pending"),
      with: {
        mentee: true,
        answers: {
          with: {
            mentor: {
              with: {
                mentorProfile: true
              }
            }
          }
        }
      },
      orderBy: desc(questions.createdAt)
    });
    
    return results as QuestionWithAnswer[];
  }

  async updateQuestionStatus(questionId: string, status: string): Promise<Question> {
    const [question] = await db
      .update(questions)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(questions.id, questionId))
      .returning();
    return question;
  }

  // Answers
  async createAnswer(answer: InsertAnswer): Promise<Answer> {
    const [newAnswer] = await db
      .insert(answers)
      .values(answer)
      .returning();
    return newAnswer;
  }

  async updateAnswerInsights(answerId: string, insights: any): Promise<Answer> {
    const [answer] = await db
      .update(answers)
      .set({ aiInsights: insights, updatedAt: new Date() })
      .where(eq(answers.id, answerId))
      .returning();
    return answer;
  }

  async getAnswersByMentor(mentorId: string): Promise<Answer[]> {
    const results = await db
      .select()
      .from(answers)
      .where(eq(answers.mentorId, mentorId))
      .orderBy(desc(answers.createdAt));
    return results;
  }
  
  // Mentor applications
  async getMentorApplication(userId: string): Promise<MentorApplication | undefined> {
    const [application] = await db
      .select()
      .from(mentorApplications)
      .where(eq(mentorApplications.userId, userId));
    return application || undefined;
  }

  async getAllMentorApplications(): Promise<MentorApplication[]> {
    const applications = await db
      .select()
      .from(mentorApplications)
      .orderBy(desc(mentorApplications.createdAt));
    return applications;
  }

  async createMentorApplication(applicationData: InsertMentorApplication): Promise<MentorApplication> {
    const [application] = await db
      .insert(mentorApplications)
      .values(applicationData)
      .returning();
    return application;
  }

  async updateMentorApplicationStatus(id: string, status: string, adminNotes?: string): Promise<MentorApplication> {
    const updateData: any = {
      status: status as any,
      updatedAt: new Date(),
    };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    if (status === 'approved' || status === 'rejected') {
      updateData.reviewedAt = new Date();
    }
    
    const [application] = await db
      .update(mentorApplications)
      .set(updateData)
      .where(eq(mentorApplications.id, id))
      .returning();
    return application;
  }
}

export const storage = new DatabaseStorage();
