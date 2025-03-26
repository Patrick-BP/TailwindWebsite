import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { uploadMiddleware, handleFileUpload } from "./upload";
import { 
  insertProjectSchema, 
  insertBlogPostSchema, 
  insertTimelineEntrySchema, 
  insertContactMessageSchema,
  insertProfileSchema
} from "@shared/schema";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth routes (login, register, etc.)
  setupAuth(app);

  // API routes
  // ============================
  
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data", error });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.updateProject(parseInt(req.params.id), validatedData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data", error });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await storage.deleteProject(parseInt(req.params.id));
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Blog Posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const blogPost = await storage.getBlogPost(parseInt(req.params.id));
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(validatedData);
      res.status(201).json(blogPost);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data", error });
    }
  });

  app.put("/api/blog-posts/:id", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.updateBlogPost(parseInt(req.params.id), validatedData);
      res.json(blogPost);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data", error });
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await storage.deleteBlogPost(parseInt(req.params.id));
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Timeline Entries
  app.get("/api/timeline-entries", async (req, res) => {
    try {
      const timelineEntries = await storage.getAllTimelineEntries();
      res.json(timelineEntries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline entries" });
    }
  });

  app.post("/api/timeline-entries", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = insertTimelineEntrySchema.parse(req.body);
      const timelineEntry = await storage.createTimelineEntry(validatedData);
      res.status(201).json(timelineEntry);
    } catch (error) {
      res.status(400).json({ message: "Invalid timeline entry data", error });
    }
  });

  app.put("/api/timeline-entries/:id", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = insertTimelineEntrySchema.parse(req.body);
      const timelineEntry = await storage.updateTimelineEntry(parseInt(req.params.id), validatedData);
      res.json(timelineEntry);
    } catch (error) {
      res.status(400).json({ message: "Invalid timeline entry data", error });
    }
  });

  app.delete("/api/timeline-entries/:id", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await storage.deleteTimelineEntry(parseInt(req.params.id));
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete timeline entry" });
    }
  });

  // Contact Messages
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await storage.createContactMessage(validatedData);
      res.status(201).json(contactMessage);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact message data", error });
    }
  });

  app.get("/api/contact-messages", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const contactMessages = await storage.getAllContactMessages();
      res.json(contactMessages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.put("/api/contact-messages/:id/read", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const contactMessage = await storage.markContactMessageAsRead(parseInt(req.params.id));
      res.json(contactMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark contact message as read" });
    }
  });

  app.delete("/api/contact-messages/:id", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await storage.deleteContactMessage(parseInt(req.params.id));
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact message" });
    }
  });

  // Admin User Management
  app.get("/api/users", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id/role", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { role } = req.body;
      if (!role || !["admin", "user"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await storage.updateUserRole(parseInt(req.params.id), role);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await storage.deleteUser(parseInt(req.params.id));
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Profile
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(validatedData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data", error });
    }
  });

  // File Upload
  app.post("/api/upload", uploadMiddleware.single("file"), async (req, res) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const fileUrl = await handleFileUpload(req.file);
      res.json({ url: fileUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
