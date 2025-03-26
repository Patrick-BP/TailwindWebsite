import { useState, useEffect, useCallback } from "react";

type TypewriterOptions = {
  typingSpeed: number;
  pauseTime: number;
};

export const useTypewriter = (
  phrases: string[],
  options: TypewriterOptions = {
    typingSpeed: 100,
    pauseTime: 3000,
  }
) => {
  const [displayedText, setDisplayedText] = useState("");
  const [completedPhrase, setCompletedPhrase] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const typeEffect = useCallback(() => {
    const { typingSpeed, pauseTime } = options;
    const currentPhrase = phrases[currentPhraseIndex];
    
    // If we haven't completed the phrase yet, keep typing
    if (!completedPhrase) {
      if (displayedText.length < currentPhrase.length) {
        // Still typing the current phrase
        setDisplayedText(current => currentPhrase.substring(0, current.length + 1));
        
        // Schedule next character
        setTimeout(typeEffect, typingSpeed);
      } else {
        // We've completed typing the phrase
        setCompletedPhrase(true);
        
        // Wait for the pause time, then move to the next phrase
        setTimeout(typeEffect, pauseTime);
      }
    } else {
      // Move to the next phrase
      setCurrentPhraseIndex((current) => (current + 1) % phrases.length);
      setDisplayedText("");
      setCompletedPhrase(false);
      
      // Start typing the next phrase
      setTimeout(typeEffect, typingSpeed);
    }
  }, [displayedText, currentPhraseIndex, completedPhrase, phrases, options]);
  
  useEffect(() => {
    const timeoutId = setTimeout(typeEffect, 1000); // Initial delay
    return () => clearTimeout(timeoutId);
  }, [typeEffect]);
  
  return displayedText;
};
