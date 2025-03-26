export interface NavItem {
  title: string;
  href: string;
}

export interface ProjectFormValues {
  title: string;
  description: string;
  thumbnail: string;
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  techStack: string[];
  featured: boolean;
}

export interface BlogPostFormValues {
  title: string;
  content: string;
  thumbnail: string;
  excerpt: string;
  category: string;
}

export interface TimelineEntryFormValues {
  title: string;
  company: string;
  description: string;
  dateRange: string;
  skills: string[];
  order: number;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ProfileFormValues {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  location: string;
  resumeUrl: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    dev?: string;
    [key: string]: string | undefined;
  };
  skills: {
    [key: string]: number;
  };
}

export interface FileUploadResponse {
  url: string;
}

export interface AdminTab {
  id: string;
  label: string;
  component: React.ComponentType;
}
