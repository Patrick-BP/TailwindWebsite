import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Github, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectDetailPage() {
  const [, params] = useRoute("/projects/:id");
  const projectId = params?.id ? parseInt(params.id) : undefined;

  // Fetch project details
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Project</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Failed to load the project details. Please try again later.
            </p>
            <Link href="/#projects">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
        ) : project ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/#projects">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative overflow-hidden rounded-xl shadow-xl"
                >
                  <img 
                    src={project.thumbnail} 
                    alt={project.title} 
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-md transition-colors"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      View Live Demo
                    </a>
                  )}
                  
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-md transition-colors"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
              
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                  
                  <div className="mb-6">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900 text-primary dark:text-blue-400 text-sm font-medium">
                      {project.category}
                    </span>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none mb-8">
                    {project.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
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
                            className={`px-3 py-1.5 text-sm font-medium bg-${color}-100 dark:bg-${color}-900 text-${color}-600 dark:text-${color}-300 rounded-md`}
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4">Project Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium mb-2">Category</h4>
                        <p className="text-gray-600 dark:text-gray-300">{project.category}</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium mb-2">Completed</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/#projects">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
