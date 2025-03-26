import { Link } from "wouter";
import { Typewriter } from "@/components/typewriter";
import { TechStack } from "@/components/tech-stack";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@shared/schema";

export function HeroSection() {
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  // Typewriter phrases
  const phrases = [
    "building exceptional digital experiences",
    "creating responsive web applications",
    "developing innovative solutions",
    "turning ideas into reality"
  ];

  // Use placeholder data if profile is still loading
  const name = profile?.name || "John Doe";
  const title = profile?.title || "Full-Stack Developer";
  const bio = profile?.bio || "I craft robust and scalable web applications using modern technologies, focusing on responsive design and exceptional user experience.";
  const avatarUrl = profile?.avatar || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80";
  const socialLinks = profile?.socialLinks || {};

  return (
    <section id="home" className="pt-24 lg:pt-28 pb-20 lg:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900 text-primary dark:text-blue-400 text-sm font-medium mb-4">
              {title}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Hi, I'm <span className="text-primary dark:text-blue-400">{name}</span>
              <div className="block mt-2">
                I'm <Typewriter phrases={phrases} />
              </div>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              {bio}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-md transition-colors font-medium">
                View My Work
              </a>
              <a href="#contact" className="px-6 py-3 bg-transparent border border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-blue-500 text-gray-800 dark:text-gray-200 rounded-md transition-colors font-medium">
                Contact Me
              </a>
            </div>
            
            <div className="flex items-center mt-10 space-x-6">
              <a href={socialLinks.github || "https://github.com"} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                <i className="fab fa-github text-2xl"></i>
              </a>
              <a href={socialLinks.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
              <a href={socialLinks.twitter || "https://twitter.com"} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a href={socialLinks.dev || "https://dev.to"} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                <i className="fab fa-dev text-2xl"></i>
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-30 dark:opacity-40"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-2">
                <img 
                  src={avatarUrl}
                  alt={name} 
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <TechStack />
      </div>
    </section>
  );
}
