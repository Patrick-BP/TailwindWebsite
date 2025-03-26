import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  liveUrl: text("liveUrl"),
  githubUrl: text("githubUrl"),
  category: text("category").notNull(),
  techStack: text("techStack").array().notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

// Blog posts table
export const blogPosts = pgTable("blogPosts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  thumbnail: text("thumbnail").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
});

// Timeline entries
export const timelineEntries = pgTable("timelineEntries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  dateRange: text("dateRange").notNull(),
  skills: text("skills").array().notNull(),
  order: integer("order").notNull(),
});

export const insertTimelineEntrySchema = createInsertSchema(timelineEntries).omit({
  id: true,
});

// Contact messages
export const contactMessages = pgTable("contactMessages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  isRead: boolean("isRead").default(false).notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Profile information
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar").notNull(),
  email: text("email").notNull(),
  location: text("location").notNull(),
  resumeUrl: text("resumeUrl").notNull(),
  socialLinks: jsonb("socialLinks").notNull(),
  skills: jsonb("skills").notNull(),
});

export const insertProfileSchema = createInsertSchema(profile).omit({
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type TimelineEntry = typeof timelineEntries.$inferSelect;
export type InsertTimelineEntry = z.infer<typeof insertTimelineEntrySchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
