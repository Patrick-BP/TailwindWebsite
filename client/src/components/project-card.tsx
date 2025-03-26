import { Link } from "wouter";
import { Project } from "@shared/schema";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="project-card group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
      variants={itemVariants}
    >
      <div className="relative overflow-hidden h-56">
        <img 
          src={project.thumbnail}
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <div className="project-overlay absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/60 flex items-center justify-center opacity-0 transition-opacity duration-300">
          <div className="text-center px-6">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-primary rounded-md font-medium inline-block mb-3 hover:bg-gray-100 transition-colors"
              >
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-900 text-white rounded-md font-medium inline-block hover:bg-black transition-colors"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-xl font-bold mb-2 cursor-pointer hover:text-primary dark:hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {project.description.length > 120 
            ? `${project.description.substring(0, 120)}...` 
            : project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, index) => {
            // Generate a color based on the tech name for variety
            const colors = [
              "blue", "green", "yellow", "purple", "pink", "indigo", "red", "orange", "teal", "cyan"
            ];
            const colorIndex = tech.charCodeAt(0) % colors.length;
            const color = colors[colorIndex];
            
            return (
              <span 
                key={index} 
                className={`px-2 py-1 text-xs font-medium bg-${color}-100 dark:bg-${color}-900 text-${color}-600 dark:text-${color}-300 rounded`}
              >
                {tech}
              </span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
