import { useState, useRef, useEffect, useCallback } from 'react';
import { OPENING_SCREEN } from './constants';

interface NoButtonProps {
  onClick: () => void;
}

export default function NoButton({ onClick }: NoButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getViewportDimensions = useCallback(() => {
    // Use visualViewport for mobile browsers where available, fallback to window dimensions
    if (window.visualViewport) {
      return {
        width: window.visualViewport.width,
        height: window.visualViewport.height,
      };
    }
    return {
      width: Math.min(window.innerWidth, document.documentElement.clientWidth),
      height: Math.min(window.innerHeight, document.documentElement.clientHeight),
    };
  }, []);

  const clampPositionToViewport = useCallback(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;

    const viewport = getViewportDimensions();
    const padding = 20;

    // Calculate safe boundaries
    const minX = padding;
    const minY = padding;
    const maxX = Math.max(padding, viewport.width - buttonWidth - padding);
    const maxY = Math.max(padding, viewport.height - buttonHeight - padding);

    // Clamp current position to safe boundaries
    setPosition((prev) => {
      const clampedX = Math.max(minX, Math.min(prev.x, maxX));
      const clampedY = Math.max(minY, Math.min(prev.y, maxY));
      
      // Round to avoid sub-pixel issues
      return {
        x: Math.round(clampedX),
        y: Math.round(clampedY),
      };
    });
  }, [getViewportDimensions]);

  const moveButton = useCallback(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;

    const viewport = getViewportDimensions();
    const padding = 20;

    // Calculate safe boundaries
    const minX = padding;
    const minY = padding;
    const maxX = Math.max(padding, viewport.width - buttonWidth - padding);
    const maxY = Math.max(padding, viewport.height - buttonHeight - padding);

    // Ensure we have valid bounds
    if (maxX <= minX || maxY <= minY) {
      // Viewport too small, center the button as best we can
      const safeX = Math.max(0, Math.min(padding, viewport.width - buttonWidth));
      const safeY = Math.max(0, Math.min(padding, viewport.height - buttonHeight));
      setPosition({ x: Math.round(safeX), y: Math.round(safeY) });
      setIsPositioned(true);
      return;
    }

    // Generate random position strictly within safe boundaries
    const randomX = minX + Math.random() * (maxX - minX);
    const randomY = minY + Math.random() * (maxY - minY);

    // Clamp and round to ensure integer pixel values
    const finalX = Math.round(Math.max(minX, Math.min(randomX, maxX)));
    const finalY = Math.round(Math.max(minY, Math.min(randomY, maxY)));

    setPosition({ x: finalX, y: finalY });
    setIsPositioned(true);

    // Schedule a post-render clamp to verify the button is actually on-screen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        clampPositionToViewport();
      });
    });
  }, [getViewportDimensions, clampPositionToViewport]);

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
    // Re-clamp position on viewport changes
    const handleViewportChange = () => {
      if (isPositioned) {
        clampPositionToViewport();
      }
    };

    // Listen to multiple viewport change events
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
    
    // Listen to visual viewport changes (mobile browser UI, zoom, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
    };
  }, [isPositioned, clampPositionToViewport]);

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
