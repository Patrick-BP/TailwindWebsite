import { 
  User, InsertUser,
  Project, InsertProject,
  BlogPost, InsertBlogPost,
  TimelineEntry, InsertTimelineEntry,
  ContactMessage, InsertContactMessage,
  Profile, InsertProfile
} from "@shared/schema";
import { IStorage } from "../storage";
import session from "express-session";
import { 
  UserModel, 
  ProjectModel, 
  BlogPostModel, 
  TimelineEntryModel, 
  ContactMessageModel, 
  ProfileModel 
} from "./models";
import connectDB from "./mongo";
import { log } from "../vite";

// Add declaration for connect-mongodb-session
declare module 'connect-mongodb-session' {
  import session from 'express-session';
  export default function(session: typeof import('express-session')): {
    new(options: any): session.Store;
  };
}

import connectMongo from "connect-mongodb-session";
const MongoDBStore = connectMongo(session);

export class MongoStorage implements IStorage {
  sessionStore: session.Store;
  
  private userCurrentId: number = 1;
  private projectCurrentId: number = 1;
  private blogPostCurrentId: number = 1;
  private timelineEntryCurrentId: number = 1;
  private contactMessageCurrentId: number = 1;
  private profileCurrentId: number = 1;

  private isInitialized: boolean = false;

  constructor() {
    // Connect to MongoDB
    connectDB().then(() => {
      this.initializeData();
    }).catch(err => {
      log(`Failed to initialize MongoDB storage: ${err}`, 'mongodb');
    });

    // Set up session store
    this.sessionStore = new MongoDBStore({
      uri: process.env.MONGODB_URI!,
      collection: 'sessions',
      expires: 1000 * 60 * 60 * 24 * 7, // 1 week
    });

    (this.sessionStore as any).on('error', (error: any) => {
      log(`Session store error: ${error}`, 'mongodb');
    });
  }

  private async initializeData() {
    try {
      // Check if data already exists
      const usersCount = await UserModel.countDocuments();
      const projectsCount = await ProjectModel.countDocuments();
      const blogPostsCount = await BlogPostModel.countDocuments();
      const timelineEntriesCount = await TimelineEntryModel.countDocuments();
      const profileCount = await ProfileModel.countDocuments();

      // If we already have data, set the current IDs to max+1
      if (usersCount > 0) {
        const maxUserId = await UserModel.findOne().sort('-id').select('id');
        if (maxUserId) this.userCurrentId = maxUserId.id + 1;
      }

      if (projectsCount > 0) {
        const maxProjectId = await ProjectModel.findOne().sort('-id').select('id');
        if (maxProjectId) this.projectCurrentId = maxProjectId.id + 1;
      }

      if (blogPostsCount > 0) {
        const maxBlogPostId = await BlogPostModel.findOne().sort('-id').select('id');
        if (maxBlogPostId) this.blogPostCurrentId = maxBlogPostId.id + 1;
      }

      if (timelineEntriesCount > 0) {
        const maxTimelineEntryId = await TimelineEntryModel.findOne().sort('-id').select('id');
        if (maxTimelineEntryId) this.timelineEntryCurrentId = maxTimelineEntryId.id + 1;
      }

      if (profileCount > 0) {
        const maxProfileId = await ProfileModel.findOne().sort('-id').select('id');
        if (maxProfileId) this.profileCurrentId = maxProfileId.id + 1;
      }

      // If no data exists, initialize with sample data
      if (this.isInitialized) return;

      if (projectsCount === 0) await this.initializeProjects();
      if (blogPostsCount === 0) await this.initializeBlogPosts();
      if (timelineEntriesCount === 0) await this.initializeTimelineEntries();
      if (profileCount === 0) await this.initializeProfile();

      this.isInitialized = true;
      log('MongoDB storage initialized with sample data', 'mongodb');
    } catch (error) {
      log(`Error initializing data: ${error}`, 'mongodb');
    }
  }

  // Initialize sample data methods
  private async initializeTimelineEntries() {
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

    try {
      await TimelineEntryModel.create(education);
      await TimelineEntryModel.create(experiences);
    } catch (error) {
      log(`Error initializing timeline entries: ${error}`, 'mongodb');
    }
  }

  private async initializeProjects() {
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
    
    try {
      await ProjectModel.create(projects);
    } catch (error) {
      log(`Error initializing projects: ${error}`, 'mongodb');
    }
  }

  private async initializeBlogPosts() {
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

Breaking your application into smaller, independent services can improve scalability and maintainability:

\`\`\`javascript
// user-service.js
const express = require('express');
const app = express();

app.get('/api/users', async (req, res) => {
  // Handle user retrieval
});

app.listen(3001);

// product-service.js
const express = require('express');
const app = express();

app.get('/api/products', async (req, res) => {
  // Handle product retrieval
});

app.listen(3002);
\`\`\`

### Event-Driven Architecture

Using events for communication between services can reduce coupling:

\`\`\`javascript
const eventEmitter = new EventEmitter();

// Publisher
function createOrder(order) {
  // Save order to database
  eventEmitter.emit('orderCreated', order);
}

// Subscribers
eventEmitter.on('orderCreated', (order) => {
  // Update inventory
});

eventEmitter.on('orderCreated', (order) => {
  // Send confirmation email
});
\`\`\`

## Performance Optimization

### Caching

Implement caching to reduce database load:

\`\`\`javascript
const cache = new Map();

async function getProductById(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  
  const product = await db.findProduct(id);
  cache.set(id, product);
  return product;
}
\`\`\`

### Database Optimization

Use indexes, connection pooling, and query optimization:

\`\`\`javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

async function getUsers() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}
\`\`\`

## Conclusion

Building a scalable Node.js backend requires thoughtful architectural decisions and performance optimizations. By implementing these patterns and techniques, you can ensure your application can handle growth and maintain performance under load.
        `,
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        excerpt: "Learn how to build a scalable backend using Node.js with architectural patterns like microservices and event-driven design, along with performance optimization techniques.",
        category: "Node.js",
        publishedAt: new Date("2023-05-22")
      },
      {
        id: this.blogPostCurrentId++,
        title: "Creating Accessible Web Applications",
        content: `
## Introduction

Accessibility is a crucial aspect of web development that ensures your application can be used by everyone, including people with disabilities. In this post, I'll cover best practices for creating accessible web applications.

## Semantic HTML

Using semantic HTML provides meaning to your content and helps assistive technologies understand your page structure:

\`\`\`html
<!-- Bad -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
    <div class="nav-item">About</div>
  </div>
</div>

<!-- Good -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
\`\`\`

## ARIA Attributes

ARIA (Accessible Rich Internet Applications) attributes can enhance accessibility when HTML alone isn't sufficient:

\`\`\`html
<button 
  aria-expanded="false"
  aria-controls="dropdown-menu"
  onClick="toggleDropdown()"
>
  Menu
</button>
<ul id="dropdown-menu" hidden>
  <li><a href="/">Home</a></li>
  <li><a href="/about">About</a></li>
</ul>
\`\`\`

## Keyboard Navigation

Ensure your application can be fully navigated using a keyboard:

\`\`\`javascript
// Trap focus within a modal
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
  
  firstElement.focus();
}
\`\`\`

## Color Contrast

Ensure sufficient color contrast between text and background:

\`\`\`css
/* Good contrast */
.button {
  background-color: #2060a0;
  color: white; /* High contrast */
}

/* Poor contrast */
.button-low-contrast {
  background-color: #7890a0;
  color: #e0e0e0; /* Low contrast - avoid this */
}
\`\`\`

## Testing Accessibility

Use automated tools and manual testing to ensure accessibility:

- Use tools like Lighthouse or axe-core
- Test with screen readers (VoiceOver, NVDA, JAWS)
- Test keyboard navigation
- Check for sufficient color contrast

## Conclusion

Creating accessible web applications is not just about compliance with guidelines—it's about ensuring that everyone can use your application effectively. By following these best practices, you can make your web applications more inclusive and reach a wider audience.
        `,
        thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        excerpt: "Discover best practices for building accessible web applications, including semantic HTML, ARIA attributes, keyboard navigation, and color contrast considerations.",
        category: "Accessibility",
        publishedAt: new Date("2023-03-10")
      }
    ];
    
    try {
      await BlogPostModel.create(blogPosts);
    } catch (error) {
      log(`Error initializing blog posts: ${error}`, 'mongodb');
    }
  }

  private async initializeProfile() {
    const profileData: Profile = {
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

    try {
      await ProfileModel.create(profileData);
    } catch (error) {
      log(`Error initializing profile: ${error}`, 'mongodb');
    }
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ id });
      return user ? user.toObject() : undefined;
    } catch (error) {
      log(`Error getting user: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username });
      return user ? user.toObject() : undefined;
    } catch (error) {
      log(`Error getting user by username: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = this.userCurrentId++;
      const user: User = { ...insertUser, id };
      const newUser = await UserModel.create(user);
      return newUser.toObject();
    } catch (error) {
      log(`Error creating user: ${error}`, 'mongodb');
      throw error;
    }
  }

  // Project Methods
  async getAllProjects(): Promise<Project[]> {
    try {
      const projects = await ProjectModel.find().sort({ createdAt: -1 });
      return projects.map(project => project.toObject());
    } catch (error) {
      log(`Error getting all projects: ${error}`, 'mongodb');
      return [];
    }
  }

  async getProject(id: number): Promise<Project | undefined> {
    try {
      const project = await ProjectModel.findOne({ id });
      return project ? project.toObject() : undefined;
    } catch (error) {
      log(`Error getting project: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async createProject(project: InsertProject): Promise<Project> {
    try {
      const id = this.projectCurrentId++;
      const now = new Date();
      const newProject: Project = { ...project, id, createdAt: now };
      const createdProject = await ProjectModel.create(newProject);
      return createdProject.toObject();
    } catch (error) {
      log(`Error creating project: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updateProject(id: number, project: InsertProject): Promise<Project> {
    try {
      const existingProject = await ProjectModel.findOne({ id });
      if (!existingProject) {
        throw new Error(`Project with id ${id} not found`);
      }
      
      Object.assign(existingProject, project);
      await existingProject.save();
      return existingProject.toObject();
    } catch (error) {
      log(`Error updating project: ${error}`, 'mongodb');
      throw error;
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      await ProjectModel.deleteOne({ id });
    } catch (error) {
      log(`Error deleting project: ${error}`, 'mongodb');
      throw error;
    }
  }

  // Blog Post Methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      const posts = await BlogPostModel.find().sort({ publishedAt: -1 });
      return posts.map(post => post.toObject());
    } catch (error) {
      log(`Error getting all blog posts: ${error}`, 'mongodb');
      return [];
    }
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    try {
      const post = await BlogPostModel.findOne({ id });
      return post ? post.toObject() : undefined;
    } catch (error) {
      log(`Error getting blog post: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    try {
      const id = this.blogPostCurrentId++;
      const now = new Date();
      const newBlogPost: BlogPost = { ...blogPost, id, publishedAt: now };
      const createdPost = await BlogPostModel.create(newBlogPost);
      return createdPost.toObject();
    } catch (error) {
      log(`Error creating blog post: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updateBlogPost(id: number, blogPost: InsertBlogPost): Promise<BlogPost> {
    try {
      const existingPost = await BlogPostModel.findOne({ id });
      if (!existingPost) {
        throw new Error(`Blog post with id ${id} not found`);
      }
      
      Object.assign(existingPost, blogPost);
      await existingPost.save();
      return existingPost.toObject();
    } catch (error) {
      log(`Error updating blog post: ${error}`, 'mongodb');
      throw error;
    }
  }

  async deleteBlogPost(id: number): Promise<void> {
    try {
      await BlogPostModel.deleteOne({ id });
    } catch (error) {
      log(`Error deleting blog post: ${error}`, 'mongodb');
      throw error;
    }
  }

  // Timeline Entry Methods
  async getAllTimelineEntries(): Promise<TimelineEntry[]> {
    try {
      const entries = await TimelineEntryModel.find().sort({ order: 1 });
      return entries.map(entry => entry.toObject());
    } catch (error) {
      log(`Error getting all timeline entries: ${error}`, 'mongodb');
      return [];
    }
  }

  async getTimelineEntry(id: number): Promise<TimelineEntry | undefined> {
    try {
      const entry = await TimelineEntryModel.findOne({ id });
      return entry ? entry.toObject() : undefined;
    } catch (error) {
      log(`Error getting timeline entry: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async createTimelineEntry(timelineEntry: InsertTimelineEntry): Promise<TimelineEntry> {
    try {
      const id = this.timelineEntryCurrentId++;
      const newTimelineEntry: TimelineEntry = { ...timelineEntry, id };
      const createdEntry = await TimelineEntryModel.create(newTimelineEntry);
      return createdEntry.toObject();
    } catch (error) {
      log(`Error creating timeline entry: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updateTimelineEntry(id: number, timelineEntry: InsertTimelineEntry): Promise<TimelineEntry> {
    try {
      const existingEntry = await TimelineEntryModel.findOne({ id });
      if (!existingEntry) {
        throw new Error(`Timeline entry with id ${id} not found`);
      }
      
      Object.assign(existingEntry, timelineEntry);
      await existingEntry.save();
      return existingEntry.toObject();
    } catch (error) {
      log(`Error updating timeline entry: ${error}`, 'mongodb');
      throw error;
    }
  }

  async deleteTimelineEntry(id: number): Promise<void> {
    try {
      await TimelineEntryModel.deleteOne({ id });
    } catch (error) {
      log(`Error deleting timeline entry: ${error}`, 'mongodb');
      throw error;
    }
  }

  // Contact Message Methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    try {
      const messages = await ContactMessageModel.find().sort({ createdAt: -1 });
      return messages.map(message => message.toObject());
    } catch (error) {
      log(`Error getting all contact messages: ${error}`, 'mongodb');
      return [];
    }
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    try {
      const message = await ContactMessageModel.findOne({ id });
      return message ? message.toObject() : undefined;
    } catch (error) {
      log(`Error getting contact message: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage> {
    try {
      const id = this.contactMessageCurrentId++;
      const now = new Date();
      const newContactMessage: ContactMessage = { 
        ...contactMessage, 
        id, 
        isRead: false, 
        createdAt: now 
      };
      const createdMessage = await ContactMessageModel.create(newContactMessage);
      return createdMessage.toObject();
    } catch (error) {
      log(`Error creating contact message: ${error}`, 'mongodb');
      throw error;
    }
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage> {
    try {
      const message = await ContactMessageModel.findOne({ id });
      if (!message) {
        throw new Error(`Contact message with id ${id} not found`);
      }
      
      message.isRead = true;
      await message.save();
      return message.toObject();
    } catch (error) {
      log(`Error marking contact message as read: ${error}`, 'mongodb');
      throw error;
    }
  }

  async deleteContactMessage(id: number): Promise<void> {
    try {
      await ContactMessageModel.deleteOne({ id });
    } catch (error) {
      log(`Error deleting contact message: ${error}`, 'mongodb');
      throw error;
    }
  }

  // Profile Methods
  async getProfile(): Promise<Profile | undefined> {
    try {
      const profile = await ProfileModel.findOne();
      return profile ? profile.toObject() : undefined;
    } catch (error) {
      log(`Error getting profile: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    try {
      let profile = await ProfileModel.findOne();
      
      if (!profile) {
        // If no profile exists, create a new one
        profile = await ProfileModel.create({
          ...profileData,
          id: this.profileCurrentId++
        });
      } else {
        // Update existing profile
        Object.assign(profile, profileData);
        await profile.save();
      }
      
      return profile.toObject();
    } catch (error) {
      log(`Error updating profile: ${error}`, 'mongodb');
      throw error;
    }
  }
}