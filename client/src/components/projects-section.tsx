import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "@/components/project-card";
import { Project } from "@shared/schema";
import { motion } from "framer-motion";

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Get unique categories from projects
  const categories = ["All"];
  if (projects) {
    projects.forEach(project => {
      if (!categories.includes(project.category)) {
        categories.push(project.category);
      }
    });
  }

  // Filter projects by active category
  const filteredProjects = projects?.filter(project => 
    activeCategory === "All" || project.category === activeCategory
  );

  // Container and item variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-24 h-1 bg-primary dark:bg-blue-400 mx-auto mb-8"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Here are some of my recent projects. Each one presented unique challenges and opportunities for growth.
          </p>
        </div>
        
        {/* Project Filter Tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeCategory === category 
                  ? "bg-primary text-white" 
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-primary hover:text-white dark:hover:bg-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg h-96 animate-pulse">
                <div className="h-56 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects && filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                  No projects found in this category.
                </h3>
              </div>
            )}
          </motion.div>
        )}
        
        {projects && projects.length > 6 && (
          <div className="text-center mt-12">
            <a href="#" className="inline-flex items-center text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              <span>View More Projects</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
