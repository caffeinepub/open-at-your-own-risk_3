import { useEffect, useState } from 'react';
import FireworksCanvas from './FireworksCanvas';

interface YesTransitionProps {
  onComplete: () => void;
}

export default function YesTransition({ onComplete }: YesTransitionProps) {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    // Show fireworks after fade starts
    const fireworksTimer = setTimeout(() => {
      setShowFireworks(true);
    }, 500);

    // Transition to celebration screen
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(fireworksTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black animate-fade-to-black" />
      
      {/* Fireworks */}
      {showFireworks && <FireworksCanvas />}
    </div>
  );
}
