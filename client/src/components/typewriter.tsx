import { useTypewriter } from "@/hooks/use-typewriter";

interface TypewriterProps {
  phrases: string[];
}

export function Typewriter({ phrases }: TypewriterProps) {
  const displayText = useTypewriter(phrases, {
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseTime: 1500,
  });

  return (
    <span className="text-primary dark:text-blue-400">
      {displayText}
      <span className="inline-block w-1 h-8 ml-1 bg-primary dark:bg-blue-400 animate-pulse" />
    </span>
  );
}
