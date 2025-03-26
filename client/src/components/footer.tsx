import { Link } from "wouter";
import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-xl font-bold flex items-center">
              <span className="text-2xl mr-2">&lt;/&gt;</span>
              <span>DevPortfolio</span>
            </Link>
            <p className="mt-2 text-gray-400 max-w-md">
              Full-stack developer specializing in building exceptional digital experiences.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            &copy; {currentYear} John Doe. All rights reserved.
          </div>
          
          <div className="mt-4 md:mt-0">
            <nav className="flex flex-wrap space-x-4 sm:space-x-6">
              <a href="#home" className="text-sm text-gray-400 hover:text-white transition-colors">Home</a>
              <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#projects" className="text-sm text-gray-400 hover:text-white transition-colors">Projects</a>
              <a href="#blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a>
              <a href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
