import { useState, useEffect, useRef } from 'react';
import { OPENING_SCREEN, NO_MESSAGES } from './constants';
import NoButton from './NoButton';
import PopHeartsBackground from './PopHeartsBackground';

interface OpeningScreenProps {
  onYesClick: () => void;
}

export default function OpeningScreen({ onYesClick }: OpeningScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [noClicks, setNoClicks] = useState(0);
  const [isMessageCycling, setIsMessageCycling] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNoClick = () => {
    const newNoClicks = noClicks + 1;
    setNoClicks(newNoClicks);
    
    // Advance to next message immediately on click
    setMessageIndex(prev => (prev + 1) % NO_MESSAGES.length);
    
    // Start automatic cycling after first click
    if (!isMessageCycling) {
      setIsMessageCycling(true);
    }
  };

  // Automatic message cycling effect
  useEffect(() => {
    if (isMessageCycling) {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Set up interval to cycle through messages
      timerRef.current = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % NO_MESSAGES.length);
      }, 2500); // Change message every 2.5 seconds
    }

    // Cleanup on unmount or when cycling stops
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isMessageCycling]);

  const currentMessage = noClicks > 0 ? NO_MESSAGES[messageIndex] : OPENING_SCREEN.question;

  return (
    <div className="min-h-screen w-full bg-light-pink-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <PopHeartsBackground />
      
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in-scale relative z-10">
        {/* Name with hearts */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-pink-700 tracking-wide flex items-center justify-center gap-4">
            <span>{OPENING_SCREEN.name}</span>
            <span className="heart-glow">{OPENING_SCREEN.heartEmojis}</span>
          </h1>
        </div>

        {/* Question with sparkle effect */}
        <div className="py-8">
          <p className="text-3xl md:text-4xl text-pink-800 font-semibold flex items-center justify-center gap-3">
            <span>{currentMessage}</span>
            {noClicks === 0 && (
              <span className="animate-sparkle inline-block">💖</span>
            )}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative min-h-[120px]">
          <button
            onClick={onYesClick}
            className="romantic-button bg-pink-600 text-white hover:bg-pink-700 z-10"
          >
            {OPENING_SCREEN.yesButton}
          </button>
          
          <NoButton onClick={handleNoClick} />
        </div>

        {/* Quote */}
        <div className="pt-8">
          <p className="text-xl md:text-2xl text-pink-700 italic font-light">
            "{OPENING_SCREEN.quote}"
          </p>
        </div>
      </div>
    </div>
  );
}
