import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { BlogSection } from "@/components/blog-section";
import { ContactSection } from "@/components/contact-section";
import { useEffect } from "react";

export default function HomePage() {
  // Smooth scroll functionality
  useEffect(() => {
    const smoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId as string);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', smoothScroll);
    
    return () => {
      document.removeEventListener('click', smoothScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
