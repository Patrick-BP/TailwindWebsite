import { useState, useEffect, useContext } from "react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthContext } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;
  
  // Handle window scroll for header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (authContext?.logoutMutation) {
      authContext.logoutMutation.mutate();
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white dark:bg-gray-900 shadow-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-primary dark:text-blue-400 flex items-center">
            <span className="text-2xl mr-2">&lt;/&gt;</span>
            <span>DevPortfolio</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-sm font-medium hover:text-primary dark:hover:text-blue-400 transition-colors">Home</a>
            <a href="#about" className="text-sm font-medium hover:text-primary dark:hover:text-blue-400 transition-colors">About</a>
            <a href="#projects" className="text-sm font-medium hover:text-primary dark:hover:text-blue-400 transition-colors">Projects</a>
            <a href="#blog" className="text-sm font-medium hover:text-primary dark:hover:text-blue-400 transition-colors">Blog</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary dark:hover:text-blue-400 transition-colors">Contact</a>
            
            <a 
              href="/resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Resume
            </a>
            
            <ThemeToggle />
            
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            )}
            
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMobileMenu}>Home</a>
            <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMobileMenu}>About</a>
            <a href="#projects" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMobileMenu}>Projects</a>
            <a href="#blog" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMobileMenu}>Blog</a>
            <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMobileMenu}>Contact</a>
            
            <a 
              href="/resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary"
              onClick={closeMobileMenu}
            >
              Resume
            </a>
            
            {user?.role === "admin" && (
              <Link href="/admin">
                <span className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMobileMenu}>
                  Admin Dashboard
                </span>
              </Link>
            )}
            
            {user ? (
              <span 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" 
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
              >
                Logout
              </span>
            ) : (
              <Link href="/auth">
                <span className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeMobileMenu}>
                  Login
                </span>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
