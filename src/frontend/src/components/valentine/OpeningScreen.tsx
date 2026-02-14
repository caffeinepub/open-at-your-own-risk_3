import { useState } from 'react';
import { OPENING_SCREEN, NO_MESSAGES } from './constants';
import NoButton from './NoButton';

interface OpeningScreenProps {
  onYesClick: () => void;
}

export default function OpeningScreen({ onYesClick }: OpeningScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [noClicks, setNoClicks] = useState(0);

  const handleNoClick = () => {
    setNoClicks(prev => prev + 1);
    setMessageIndex(prev => (prev + 1) % NO_MESSAGES.length);
  };

  const currentMessage = noClicks > 0 ? NO_MESSAGES[messageIndex] : OPENING_SCREEN.question;

  return (
    <div className="min-h-screen w-full bg-dark-pink-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in-scale">
        {/* Name with hearts */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wide flex items-center justify-center gap-4">
            <span>{OPENING_SCREEN.name}</span>
            <span className="heart-glow">{OPENING_SCREEN.heartEmojis}</span>
          </h1>
        </div>

        {/* Question with sparkle effect */}
        <div className="py-8">
          <p className="text-3xl md:text-4xl text-white font-semibold flex items-center justify-center gap-3">
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
            className="romantic-button bg-white text-pink-600 hover:bg-pink-50 z-10"
          >
            {OPENING_SCREEN.yesButton}
          </button>
          
          <NoButton onClick={handleNoClick} />
        </div>

        {/* Quote */}
        <div className="pt-8">
          <p className="text-xl md:text-2xl text-pink-100 italic font-light">
            "{OPENING_SCREEN.quote}"
          </p>
        </div>
      </div>
    </div>
  );
}
