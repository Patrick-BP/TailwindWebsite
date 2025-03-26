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
import { log } from "./vite";
import { MongoStorage } from "./db/mongo-storage";

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
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private projectsMap: Map<number, Project>;
  private blogPostsMap: Map<number, BlogPost>;
  private timelineEntriesMap: Map<number, TimelineEntry>;
  private contactMessagesMap: Map<number, ContactMessage>;
  private profileData: Profile | undefined;
  
  sessionStore: session.Store;
  
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
    this.profileData = {
      id: 1,
      name: "Alex Morgan",
      title: "Full-Stack Developer",
      bio: "I craft robust and scalable web applications using modern technologies. With expertise in React, Node.js, and cloud platforms, I focus on creating responsive designs and exceptional user experiences.",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
      email: "alex.morgan@example.com",
      location: "San Francisco, CA",
      resumeUrl: "/resume.pdf",
      socialLinks: {
        github: "https://github.com/alexmorgan",
        linkedin: "https://linkedin.com/in/alexmorgan",
        twitter: "https://twitter.com/alexmorgan",
        dev: "https://dev.to/alexmorgan"
      },
      skills: {
        "React": 95,
        "JavaScript": 90,
        "TypeScript": 85,
        "Node.js": 85,
        "MongoDB": 80,
        "Express": 85,
        "GraphQL": 75,
        "Next.js": 80,
        "AWS": 70,
        "Docker": 75,
        "CI/CD": 70
      }
    };
    
    // Initialize sample data
    this.initializeTimelineEntries();
    this.initializeProjects();
    this.initializeBlogPosts();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }
  
  // Initialize journey data with one education and three experiences
  private initializeTimelineEntries() {
    // Education entry
    const education: TimelineEntry = {
      id: this.timelineEntryCurrentId++,
      title: "Bachelor of Science in Computer Science",
      company: "Stanford University",
      description: "Graduated with honors. Specialized in Software Engineering and Machine Learning. Participated in multiple hackathons and coding competitions.",
      dateRange: "2016 - 2020",
      skills: ["Algorithms", "Data Structures", "Software Design", "Machine Learning", "AI"],
      order: 7
    };
    this.timelineEntriesMap.set(education.id, education);
    
    // Experience entries
    const experiences: TimelineEntry[] = [
      {
        id: this.timelineEntryCurrentId++,
        title: "Senior Full-Stack Developer",
        company: "Tech Innovations Inc.",
        description: "Leading a team of 5 developers in building scalable web applications. Implemented CI/CD pipelines and microservices architecture. Reduced loading times by 40% through performance optimizations.",
        dateRange: "2022 - Present",
        skills: ["React", "Node.js", "Microservices", "Team Leadership", "CI/CD", "AWS"],
        order: 1
      },
      {
        id: this.timelineEntryCurrentId++,
        title: "Full-Stack Developer",
        company: "WebSolutions Co.",
        description: "Developed and maintained multiple client projects using React and Node.js. Implemented responsive designs and optimized database queries. Integrated third-party APIs and payment gateways.",
        dateRange: "2020 - 2022",
        skills: ["React", "Node.js", "MongoDB", "Express", "Payment Integration", "RESTful APIs"],
        order: 2
      },
      {
        id: this.timelineEntryCurrentId++,
        title: "Front-End Developer",
        company: "Digital Creations Ltd.",
        description: "Developed responsive and interactive user interfaces for web applications. Collaborated with designers to implement pixel-perfect designs. Optimized performance for mobile devices.",
        dateRange: "2019 - 2020",
        skills: ["JavaScript", "React", "CSS3", "SASS", "Responsive Design", "Webpack"],
        order: 3
      },
      {
        id: this.timelineEntryCurrentId++,
        title: "UI/UX Developer",
        company: "InnovateTech",
        description: "Created user interfaces for mobile and web applications. Worked closely with product managers to implement user-friendly designs. Conducted usability testing and made improvements based on feedback.",
        dateRange: "2018 - 2019",
        skills: ["HTML5", "CSS3", "JavaScript", "Sketch", "Figma", "User Testing"],
        order: 4
      },
      {
        id: this.timelineEntryCurrentId++,
        title: "Web Developer",
        company: "CreativeWorks Agency",
        description: "Developed websites for various clients including e-commerce, corporate, and portfolio sites. Implemented CMS solutions and custom functionalities. Ensured cross-browser compatibility and accessibility.",
        dateRange: "2017 - 2018",
        skills: ["HTML", "CSS", "JavaScript", "WordPress", "PHP", "jQuery"],
        order: 5
      },
      {
        id: this.timelineEntryCurrentId++,
        title: "Software Engineering Intern",
        company: "GlobalTech",
        description: "Assisted in developing features for the company's main product. Fixed bugs and optimized code. Participated in code reviews and agile development processes.",
        dateRange: "Summer 2017",
        skills: ["JavaScript", "React", "Git", "Agile Methodologies", "Problem Solving"],
        order: 6
      }
    ];
    
    experiences.forEach(exp => {
      this.timelineEntriesMap.set(exp.id, exp);
    });
  }
  
  // Initialize 6 sample projects
  private initializeProjects() {
    const projects: Project[] = [
      {
        id: this.projectCurrentId++,
        title: "E-Commerce Platform",
        description: "A full-featured e-commerce platform with product management, shopping cart, payment processing, and order tracking. Built with React, Node.js, and MongoDB.",
        thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        liveUrl: "https://ecommerce-platform.example.com",
        githubUrl: "https://github.com/alexmorgan/ecommerce-platform",
        category: "Full-Stack",
        techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe", "Redux"],
        featured: true,
        createdAt: new Date("2023-08-15")
      },
      {
        id: this.projectCurrentId++,
        title: "Task Management App",
        description: "A collaborative task management application with real-time updates, drag-and-drop interface, and team collaboration features. Uses WebSockets for real-time communication.",
        thumbnail: "https://images.unsplash.com/photo-1540888747681-4acddd2bbdf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        liveUrl: "https://taskmanager.example.com",
        githubUrl: "https://github.com/alexmorgan/task-manager",
        category: "Web Application",
        techStack: ["React", "TypeScript", "Node.js", "Socket.io", "MongoDB", "Material UI"],
        featured: true,
        createdAt: new Date("2023-05-20")
      },
      {
        id: this.projectCurrentId++,
        title: "Weather Dashboard",
        description: "A weather dashboard that displays current weather conditions and forecasts for multiple locations. Integrates with weather APIs and provides visualization of weather data.",
        thumbnail: "https://images.unsplash.com/photo-1547628641-0aac13f38532?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        liveUrl: "https://weather-dashboard.example.com",
        githubUrl: "https://github.com/alexmorgan/weather-dashboard",
        category: "Front-End",
        techStack: ["React", "Chart.js", "OpenWeather API", "Styled Components", "Axios"],
        featured: false,
        createdAt: new Date("2023-02-10")
      },
      {
        id: this.projectCurrentId++,
        title: "Recipe Finder",
        description: "A recipe finder application that helps users discover recipes based on available ingredients. Features include recipe saving, meal planning, and nutritional information.",
        thumbnail: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        liveUrl: "https://recipe-finder.example.com",
        githubUrl: "https://github.com/alexmorgan/recipe-finder",
        category: "Web Application",
        techStack: ["React", "Redux", "Firebase", "Spoonacular API", "CSS Modules"],
        featured: false,
        createdAt: new Date("2022-11-05")
      },
      {
        id: this.projectCurrentId++,
        title: "Budget Tracker",
        description: "A personal finance application for tracking income, expenses, and savings goals. Provides visualizations and insights on spending patterns and financial health.",
        thumbnail: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        liveUrl: "https://budget-tracker.example.com",
        githubUrl: "https://github.com/alexmorgan/budget-tracker",
        category: "Full-Stack",
        techStack: ["React", "Node.js", "Express", "MongoDB", "Chart.js", "Auth0"],
        featured: true,
        createdAt: new Date("2022-09-18")
      },
      {
        id: this.projectCurrentId++,
        title: "Portfolio Website",
        description: "A responsive portfolio website to showcase projects and skills. Features dark/light mode, contact form, and blog integration. Built with modern web technologies.",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        liveUrl: "https://alexmorgan.example.com",
        githubUrl: "https://github.com/alexmorgan/portfolio",
        category: "Front-End",
        techStack: ["React", "Tailwind CSS", "Framer Motion", "Next.js", "Vercel"],
        featured: false,
        createdAt: new Date("2022-07-25")
      }
    ];
    
    projects.forEach(project => {
      this.projectsMap.set(project.id, project);
    });
  }
  
  // Initialize 3 sample blog posts
  private initializeBlogPosts() {
    const blogPosts: BlogPost[] = [
      {
        id: this.blogPostCurrentId++,
        title: "Modern React Patterns for 2023",
        content: `
## Introduction

React has evolved significantly since its inception, and with that evolution comes new patterns and best practices. In this post, I'll explore some of the most effective React patterns that have emerged in 2023.

## 1. Server Components

With the introduction of React Server Components, we now have a new way to think about rendering. Server Components allow you to render components on the server without sending JavaScript to the client, resulting in smaller bundle sizes and improved performance.

\`\`\`jsx
// ServerComponent.js - This component never ships to the client
export default async function ServerComponent() {
  const data = await fetchDataFromDatabase();
  return <div>{data.map(item => <p key={item.id}>{item.name}</p>)}</div>;
}
\`\`\`

## 2. The Builder Pattern for Complex Components

The builder pattern has become increasingly popular for creating complex components with many configuration options:

\`\`\`jsx
const Table = createTable()
  .withPagination({ initialPage: 1, pageSize: 10 })
  .withSorting({ initialSortBy: 'name' })
  .withFiltering()
  .build();
\`\`\`

## 3. State Machines for Complex State Management

For components with complex state logic, state machines provide a more predictable approach:

\`\`\`jsx
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } }
  }
});

function Toggle() {
  const [state, send] = useMachine(toggleMachine);
  return (
    <button onClick={() => send('TOGGLE')}>
      {state.value === 'inactive' ? 'Off' : 'On'}
    </button>
  );
}
\`\`\`

## Conclusion

As React continues to evolve, so do the patterns we use to build applications. By adopting these modern patterns, you can create more maintainable, performant, and scalable React applications in 2023 and beyond.
        `,
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        excerpt: "Explore the latest React patterns that are gaining traction in 2023, including Server Components, the Builder Pattern, and State Machines for complex state management.",
        category: "React",
        publishedAt: new Date("2023-07-15")
      },
      {
        id: this.blogPostCurrentId++,
        title: "Building a Scalable Backend with Node.js",
        content: `
## Introduction

Scalability is crucial for applications that need to handle growth in users and traffic. In this post, I'll share strategies for building a scalable backend with Node.js.

## Architectural Patterns

### Microservices

Breaking your application into smaller, independent services can significantly improve scalability:

\`\`\`javascript
// user-service.js
const express = require('express');
const app = express();

app.get('/users', async (req, res) => {
  // Handle user-related logic
});

app.listen(3001);
\`\`\`

### Message Queues

Using message queues for handling asynchronous tasks:

\`\`\`javascript
const amqp = require('amqplib');

async function setupQueue() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('task_queue', { durable: true });
  
  // Producer
  channel.sendToQueue('task_queue', Buffer.from('Task data'), { persistent: true });
  
  // Consumer
  channel.consume('task_queue', msg => {
    console.log('Received:', msg.content.toString());
    channel.ack(msg);
  });
}
\`\`\`

## Database Optimization

### Connection Pooling

\`\`\`javascript
const { Pool } = require('pg');

const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
\`\`\`

### Caching

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

async function getCachedData(key, fetchDataFn) {
  // Try to get data from cache
  const cachedData = await client.get(key);
  if (cachedData) return JSON.parse(cachedData);
  
  // If not in cache, fetch and store
  const data = await fetchDataFn();
  await client.set(key, JSON.stringify(data), 'EX', 3600);
  return data;
}
\`\`\`

## Conclusion

Building a scalable backend with Node.js involves careful architectural decisions, effective database strategies, and proper handling of asynchronous operations. By applying these patterns and techniques, you can create a backend that grows with your application's needs.
        `,
        thumbnail: "https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        excerpt: "Learn how to build scalable backend systems with Node.js using microservices, message queues, connection pooling, and efficient caching strategies.",
        category: "Backend",
        publishedAt: new Date("2023-05-28")
      },
      {
        id: this.blogPostCurrentId++,
        title: "Introduction to Web Accessibility",
        content: `
## Introduction

Web accessibility ensures that websites and applications can be used by people with disabilities. In this post, I'll introduce key concepts and practical techniques for making your websites more accessible.

## WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide standards for web accessibility. They are organized under four principles:

1. **Perceivable** - Information must be presentable to users in ways they can perceive
2. **Operable** - Interface components must be operable
3. **Understandable** - Information and operation must be understandable
4. **Robust** - Content must be robust enough to be interpreted by a variety of user agents

## Semantic HTML

Using semantic HTML is one of the simplest ways to improve accessibility:

\`\`\`html
<!-- Bad -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>

<!-- Good -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
\`\`\`

## ARIA Attributes

When HTML semantics aren't enough, ARIA attributes can help:

\`\`\`html
<button 
  aria-expanded="false"
  aria-controls="dropdown-menu"
  onClick="toggleMenu()">
  Menu
</button>

<div id="dropdown-menu" hidden>
  <!-- Menu items -->
</div>
\`\`\`

## Focus Management

Proper focus management is essential for keyboard users:

\`\`\`javascript
// When opening a modal
function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  
  // Save the current focus position
  previousFocus = document.activeElement;
  
  // Focus on the first focusable element in the modal
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length) {
    focusableElements[0].focus();
  }
}

// When closing a modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  
  // Restore focus to previous element
  if (previousFocus) {
    previousFocus.focus();
  }
}
\`\`\`

## Testing for Accessibility

Use tools to test your website's accessibility:

1. Automated tools like Lighthouse, axe, or WAVE
2. Screen readers (NVDA, VoiceOver, JAWS)
3. Keyboard-only navigation testing

## Conclusion

Web accessibility is not just a legal requirement in many jurisdictions—it's also good for business and the right thing to do. By following accessibility guidelines and best practices, you can create web experiences that are inclusive for all users.
        `,
        thumbnail: "https://images.unsplash.com/photo-1531489549245-ba6981737143?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        excerpt: "Discover the fundamentals of web accessibility and learn practical techniques for making your websites usable by everyone, including people with disabilities.",
        category: "Web Development",
        publishedAt: new Date("2023-03-12")
      }
    ];
    
    blogPosts.forEach(post => {
      this.blogPostsMap.set(post.id, post);
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

// Import MongoDB storage implementation
import { MongoStorage } from "./db/mongo-storage";

// Use MongoDB for storage
export const storage = new MongoStorage();
