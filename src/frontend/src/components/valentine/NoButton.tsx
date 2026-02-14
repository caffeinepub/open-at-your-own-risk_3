import { useState, useRef, useEffect, useCallback } from 'react';
import { OPENING_SCREEN } from './constants';

interface NoButtonProps {
  onClick: () => void;
}

export default function NoButton({ onClick }: NoButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getViewportInfo = useCallback(() => {
    // Use visualViewport for mobile browsers where available
    if (window.visualViewport) {
      return {
        width: window.visualViewport.width,
        height: window.visualViewport.height,
        offsetLeft: window.visualViewport.offsetLeft,
        offsetTop: window.visualViewport.offsetTop,
      };
    }
    return {
      width: Math.min(window.innerWidth, document.documentElement.clientWidth),
      height: Math.min(window.innerHeight, document.documentElement.clientHeight),
      offsetLeft: 0,
      offsetTop: 0,
    };
  }, []);

  const clampPositionToViewport = useCallback(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;

    const viewport = getViewportInfo();
    const padding = 16; // Consistent padding from edges

    // Calculate safe boundaries in layout viewport coordinates
    // For fixed positioning, we need to account for visualViewport offsets
    const minX = viewport.offsetLeft + padding;
    const minY = viewport.offsetTop + padding;
    const maxX = viewport.offsetLeft + viewport.width - buttonWidth - padding;
    const maxY = viewport.offsetTop + viewport.height - buttonHeight - padding;

    // Ensure maxX and maxY are at least minX and minY
    const safeMaxX = Math.max(minX, maxX);
    const safeMaxY = Math.max(minY, maxY);

    // Clamp current position to safe boundaries
    setPosition((prev) => {
      const clampedX = Math.max(minX, Math.min(prev.x, safeMaxX));
      const clampedY = Math.max(minY, Math.min(prev.y, safeMaxY));
      
      return {
        x: Math.round(clampedX),
        y: Math.round(clampedY),
      };
    });
  }, [getViewportInfo]);

  const moveButton = useCallback(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;

    const viewport = getViewportInfo();
    const padding = 16; // Consistent padding from edges

    // Calculate safe boundaries in layout viewport coordinates
    const minX = viewport.offsetLeft + padding;
    const minY = viewport.offsetTop + padding;
    const maxX = viewport.offsetLeft + viewport.width - buttonWidth - padding;
    const maxY = viewport.offsetTop + viewport.height - buttonHeight - padding;

    // Ensure we have valid bounds
    const safeMaxX = Math.max(minX, maxX);
    const safeMaxY = Math.max(minY, maxY);

    // If viewport is too small for the button with padding, center it
    if (safeMaxX <= minX || safeMaxY <= minY) {
      const centerX = viewport.offsetLeft + Math.max(0, (viewport.width - buttonWidth) / 2);
      const centerY = viewport.offsetTop + Math.max(0, (viewport.height - buttonHeight) / 2);
      setPosition({ x: Math.round(centerX), y: Math.round(centerY) });
      setIsPositioned(true);
      return;
    }

    // Generate random position strictly within safe boundaries
    const randomX = minX + Math.random() * (safeMaxX - minX);
    const randomY = minY + Math.random() * (safeMaxY - minY);

    // Round to ensure integer pixel values
    const finalX = Math.round(randomX);
    const finalY = Math.round(randomY);

    setPosition({ x: finalX, y: finalY });
    setIsPositioned(true);

    // Double-check position after render to ensure button is fully visible
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        clampPositionToViewport();
      });
    });
  }, [getViewportInfo, clampPositionToViewport]);

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

  // Observe button size changes and re-clamp if needed
  useEffect(() => {
    if (!buttonRef.current || !isPositioned) return;

    const resizeObserver = new ResizeObserver(() => {
      clampPositionToViewport();
    });

    resizeObserver.observe(buttonRef.current);

    return () => {
      resizeObserver.disconnect();
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
