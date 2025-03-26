import { useState, useEffect, useCallback } from "react";

type TypewriterOptions = {
  typingSpeed: number;
  deletingSpeed: number;
  pauseTime: number;
};

export const useTypewriter = (
  phrases: string[],
  options: TypewriterOptions = {
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseTime: 1500,
  }
) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typeEffect = useCallback(() => {
    const { typingSpeed, deletingSpeed, pauseTime } = options;
    const currentPhrase = phrases[currentPhraseIndex];
    
    // Calculate the next state
    if (isDeleting) {
      // Remove a character
      setDisplayedText(current => current.substring(0, current.length - 1));
    } else {
      // Add a character
      setDisplayedText(current => currentPhrase.substring(0, current.length + 1));
    }
    
    // Determine the next action based on current state
    let nextTimeout;
    
    if (!isDeleting && displayedText === currentPhrase) {
      // If we've finished typing the current phrase, start deleting after a pause
      nextTimeout = pauseTime;
      setIsDeleting(true);
    } else if (isDeleting && displayedText === "") {
      // If we've finished deleting, move to the next phrase
      setIsDeleting(false);
      setCurrentPhraseIndex((current) => (current + 1) % phrases.length);
      nextTimeout = 500; // Pause before starting the next phrase
    } else {
      // Otherwise, continue typing or deleting at normal speed
      nextTimeout = isDeleting ? deletingSpeed : typingSpeed;
    }
    
    // Schedule the next update
    const timeoutId = setTimeout(typeEffect, nextTimeout);
    return () => clearTimeout(timeoutId);
  }, [displayedText, currentPhraseIndex, isDeleting, phrases, options]);
  
  useEffect(() => {
    const timeoutId = setTimeout(typeEffect, 1000); // Initial delay
    return () => clearTimeout(timeoutId);
  }, [typeEffect]);
  
  return displayedText;
};
