import { useState, useRef, useEffect } from 'react';
import { OPENING_SCREEN } from './constants';

interface NoButtonProps {
  onClick: () => void;
}

export default function NoButton({ onClick }: NoButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const moveButton = () => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate safe boundaries (with padding)
    const padding = 20;
    const maxX = viewportWidth - buttonWidth - padding;
    const maxY = viewportHeight - buttonHeight - padding;

    // Generate random position within safe boundaries
    const newX = Math.random() * maxX + padding;
    const newY = Math.random() * maxY + padding;

    setPosition({ x: newX, y: newY });
    setIsPositioned(true);
  };

  const handleClick = () => {
    onClick();
    moveButton();
  };

  useEffect(() => {
    // Reset position when component mounts
    setIsPositioned(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="romantic-button bg-pink-200 text-pink-700 hover:bg-pink-300 transition-all duration-300"
      style={
        isPositioned
          ? {
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 50,
            }
          : {}
      }
    >
      {OPENING_SCREEN.noButton}
    </button>
  );
}
