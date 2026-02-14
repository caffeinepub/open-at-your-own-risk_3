import { useEffect, useState, useRef } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
}

const MAX_VISIBLE_HEARTS = 8; // Hard cap on simultaneous hearts
const MIN_SPAWN_DELAY = 800; // Minimum delay between spawns (ms)
const MAX_SPAWN_DELAY = 1500; // Maximum delay between spawns (ms)
const HEART_LIFETIME = 2500; // How long each heart lives (ms)

export default function PopHeartsBackground() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const nextIdRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const spawnHeart = () => {
      if (!isMountedRef.current) return;

      // Check if we're at the cap
      setHearts((prev) => {
        if (prev.length >= MAX_VISIBLE_HEARTS) {
          // Skip spawning, but schedule next attempt
          scheduleNextHeart();
          return prev;
        }

        const x = Math.random() * 100; // percentage
        const y = Math.random() * 100; // percentage

        const newHeart: Heart = {
          id: nextIdRef.current,
          x,
          y,
        };

        nextIdRef.current += 1;

        // Remove this specific heart after its lifetime
        setTimeout(() => {
          if (isMountedRef.current) {
            setHearts((current) => current.filter((h) => h.id !== newHeart.id));
          }
        }, HEART_LIFETIME);

        // Schedule next heart spawn
        scheduleNextHeart();

        return [...prev, newHeart];
      });
    };

    const scheduleNextHeart = () => {
      if (!isMountedRef.current) return;

      const delay = Math.random() * (MAX_SPAWN_DELAY - MIN_SPAWN_DELAY) + MIN_SPAWN_DELAY;
      
      timeoutRef.current = setTimeout(() => {
        spawnHeart();
      }, delay);
    };

    // Start the spawning cycle
    scheduleNextHeart();

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // Empty dependency array - effect runs once on mount

  return (
    <div className="pop-hearts-container">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="pop-heart"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
          }}
        >
          💗
        </div>
      ))}
    </div>
  );
}
