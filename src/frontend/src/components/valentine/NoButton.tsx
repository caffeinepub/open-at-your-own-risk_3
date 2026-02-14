import { useState, useRef, useEffect } from 'react';
import { OPENING_SCREEN } from './constants';

interface NoButtonProps {
  onClick: () => void;
}

export default function NoButton({ onClick }: NoButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const clampPosition = () => {
    if (!buttonRef.current || !isPositioned) return;

    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const padding = 20;
    const maxX = Math.max(padding, viewportWidth - buttonWidth - padding);
    const maxY = Math.max(padding, viewportHeight - buttonHeight - padding);

    // Clamp current position to safe boundaries
    const clampedX = Math.max(padding, Math.min(position.x, maxX));
    const clampedY = Math.max(padding, Math.min(position.y, maxY));

    if (clampedX !== position.x || clampedY !== position.y) {
      setPosition({ x: clampedX, y: clampedY });
    }
  };

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
    const minX = padding;
    const minY = padding;
    const maxX = viewportWidth - buttonWidth - padding;
    const maxY = viewportHeight - buttonHeight - padding;

    // Handle edge case where viewport is smaller than button + padding
    if (maxX < padding || maxY < padding) {
      // Clamp to safe on-screen position
      const safeX = Math.max(10, Math.min(padding, viewportWidth - buttonWidth - 10));
      const safeY = Math.max(10, Math.min(padding, viewportHeight - buttonHeight - 10));
      setPosition({ x: safeX, y: safeY });
      setIsPositioned(true);
      return;
    }

    // Generate random position within safe boundaries
    // Ensure the random position is strictly within bounds
    const newX = minX + Math.random() * (maxX - minX);
    const newY = minY + Math.random() * (maxY - minY);

    // Double-check bounds before setting
    const finalX = Math.max(minX, Math.min(newX, maxX));
    const finalY = Math.max(minY, Math.min(newY, maxY));

    setPosition({ x: finalX, y: finalY });
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

  useEffect(() => {
    // Add resize and orientation change listeners to re-clamp position
    const handleResize = () => {
      clampPosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isPositioned, position]);

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
