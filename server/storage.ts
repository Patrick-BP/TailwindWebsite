import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  blogPosts, type BlogPost, type InsertBlogPost,
  timelineEntries, type TimelineEntry, type InsertTimelineEntry,
  contactMessages, type ContactMessage, type InsertContactMessage,
  profile, type Profile, type InsertProfile
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: InsertProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Blog post methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: InsertBlogPost): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Timeline entry methods
  getAllTimelineEntries(): Promise<TimelineEntry[]>;
  getTimelineEntry(id: number): Promise<TimelineEntry | undefined>;
  createTimelineEntry(timelineEntry: InsertTimelineEntry): Promise<TimelineEntry>;
  updateTimelineEntry(id: number, timelineEntry: InsertTimelineEntry): Promise<TimelineEntry>;
  deleteTimelineEntry(id: number): Promise<void>;
  
  // Contact message methods
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage>;
  deleteContactMessage(id: number): Promise<void>;
  
  // Profile methods
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profileData: InsertProfile): Promise<Profile>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private projectsMap: Map<number, Project>;
  private blogPostsMap: Map<number, BlogPost>;
  private timelineEntriesMap: Map<number, TimelineEntry>;
  private contactMessagesMap: Map<number, ContactMessage>;
  private profileData: Profile | undefined;
  
  sessionStore: session.SessionStore;
  
  private userCurrentId: number = 1;
  private projectCurrentId: number = 1;
  private blogPostCurrentId: number = 1;
  private timelineEntryCurrentId: number = 1;
  private contactMessageCurrentId: number = 1;
  private profileCurrentId: number = 1;

  constructor() {
    this.usersMap = new Map();
    this.projectsMap = new Map();
    this.blogPostsMap = new Map();
    this.timelineEntriesMap = new Map();
    this.contactMessagesMap = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.usersMap.set(id, user);
    return user;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projectsMap.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projectsMap.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectCurrentId++;
    const now = new Date();
    const newProject: Project = { ...project, id, createdAt: now };
    this.projectsMap.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: InsertProject): Promise<Project> {
    const existingProject = this.projectsMap.get(id);
    if (!existingProject) {
      throw new Error("Project not found");
    }
    
    const updatedProject: Project = { ...existingProject, ...project };
    this.projectsMap.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    this.projectsMap.delete(id);
  }

  // Blog post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPostsMap.values());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPostsMap.get(id);
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCurrentId++;
    const now = new Date();
    const newBlogPost: BlogPost = { ...blogPost, id, publishedAt: now };
    this.blogPostsMap.set(id, newBlogPost);
    return newBlogPost;
  }

  async updateBlogPost(id: number, blogPost: InsertBlogPost): Promise<BlogPost> {
    const existingBlogPost = this.blogPostsMap.get(id);
    if (!existingBlogPost) {
      throw new Error("Blog post not found");
    }
    
    const updatedBlogPost: BlogPost = { ...existingBlogPost, ...blogPost };
    this.blogPostsMap.set(id, updatedBlogPost);
    return updatedBlogPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    this.blogPostsMap.delete(id);
  }

  // Timeline entry methods
  async getAllTimelineEntries(): Promise<TimelineEntry[]> {
    return Array.from(this.timelineEntriesMap.values())
      .sort((a, b) => a.order - b.order);
  }

  async getTimelineEntry(id: number): Promise<TimelineEntry | undefined> {
    return this.timelineEntriesMap.get(id);
  }

  async createTimelineEntry(timelineEntry: InsertTimelineEntry): Promise<TimelineEntry> {
    const id = this.timelineEntryCurrentId++;
    const newTimelineEntry: TimelineEntry = { ...timelineEntry, id };
    this.timelineEntriesMap.set(id, newTimelineEntry);
    return newTimelineEntry;
  }

  async updateTimelineEntry(id: number, timelineEntry: InsertTimelineEntry): Promise<TimelineEntry> {
    const existingTimelineEntry = this.timelineEntriesMap.get(id);
    if (!existingTimelineEntry) {
      throw new Error("Timeline entry not found");
    }
    
    const updatedTimelineEntry: TimelineEntry = { ...existingTimelineEntry, ...timelineEntry };
    this.timelineEntriesMap.set(id, updatedTimelineEntry);
    return updatedTimelineEntry;
  }

  async deleteTimelineEntry(id: number): Promise<void> {
    this.timelineEntriesMap.delete(id);
  }

  // Contact message methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessagesMap.values());
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessagesMap.get(id);
  }

  async createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const now = new Date();
    const newContactMessage: ContactMessage = { 
      ...contactMessage, 
      id, 
      createdAt: now, 
      isRead: false 
    };
    this.contactMessagesMap.set(id, newContactMessage);
    return newContactMessage;
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage> {
    const existingContactMessage = this.contactMessagesMap.get(id);
    if (!existingContactMessage) {
      throw new Error("Contact message not found");
    }
    
    const updatedContactMessage: ContactMessage = { ...existingContactMessage, isRead: true };
    this.contactMessagesMap.set(id, updatedContactMessage);
    return updatedContactMessage;
  }

  async deleteContactMessage(id: number): Promise<void> {
    this.contactMessagesMap.delete(id);
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    return this.profileData;
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    if (!this.profileData) {
      const id = this.profileCurrentId++;
      this.profileData = { ...profileData, id };
    } else {
      this.profileData = { ...this.profileData, ...profileData };
    }
    
    return this.profileData;
  }
}

export const storage = new MemStorage();
