import mongoose, { Schema, Document } from 'mongoose';
import { 
  User, 
  Project, 
  BlogPost, 
  TimelineEntry, 
  ContactMessage, 
  Profile 
} from '@shared/schema';

// User Schema
const userSchema = new Schema<User>({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'user' }
});

// Project Schema
const projectSchema = new Schema<Project>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  liveUrl: { type: String, default: null },
  githubUrl: { type: String, default: null },
  category: { type: String, required: true },
  techStack: [{ type: String }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// BlogPost Schema
const blogPostSchema = new Schema<BlogPost>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String, required: true },
  excerpt: { type: String, required: true },
  category: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now }
});

// TimelineEntry Schema
const timelineEntrySchema = new Schema<TimelineEntry>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  dateRange: { type: String, required: true },
  skills: [{ type: String }],
  order: { type: Number, required: true }
});

// ContactMessage Schema
const contactMessageSchema = new Schema<ContactMessage>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Profile Schema
const profileSchema = new Schema<Profile>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  avatar: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    dev: { type: String }
  },
  skills: { type: Schema.Types.Mixed, required: true }
});

// Create and export models
export const UserModel = mongoose.model<User>('User', userSchema);
export const ProjectModel = mongoose.model<Project>('Project', projectSchema);
export const BlogPostModel = mongoose.model<BlogPost>('BlogPost', blogPostSchema);
export const TimelineEntryModel = mongoose.model<TimelineEntry>('TimelineEntry', timelineEntrySchema);
export const ContactMessageModel = mongoose.model<ContactMessage>('ContactMessage', contactMessageSchema);
export const ProfileModel = mongoose.model<Profile>('Profile', profileSchema);