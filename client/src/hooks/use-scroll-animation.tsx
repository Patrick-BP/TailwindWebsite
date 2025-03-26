import { useRef, useEffect } from "react";

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || "0px"
    };
    
    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // If the element is visible, add the animation class
          entry.target.classList.add("animate-fade-in");
          
          // Once the element is animated, no need to observe it anymore
          if (entry.target.classList.contains("timeline-item")) {
            observer.unobserve(entry.target);
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // If we have a reference to the container element
    if (observerRef.current) {
      // Find all timeline items within the container
      const timelineItems = observerRef.current.querySelectorAll(".timeline-item");
      
      // Start observing each timeline item
      timelineItems.forEach(item => {
        observer.observe(item);
      });
    }
    
    return () => {
      if (observerRef.current) {
        const timelineItems = observerRef.current.querySelectorAll(".timeline-item");
        timelineItems.forEach(item => {
          observer.unobserve(item);
        });
      }
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);
  
  return { observerRef };
};
