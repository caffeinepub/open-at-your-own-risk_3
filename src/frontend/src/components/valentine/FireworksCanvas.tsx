import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  exploded: boolean;
  particles: Particle[];
  burstRing: number; // For the expanding burst ring effect
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fireworks: Firework[] = [];
    const pinkColors = [
      'oklch(0.75 0.22 355)',
      'oklch(0.85 0.15 340)',
      'oklch(0.65 0.25 350)',
      'oklch(0.80 0.18 345)',
      'oklch(0.70 0.20 355)',
    ];

    const createFirework = () => {
      // Better x distribution across the screen
      const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      // Varied target heights
      const targetY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.15;
      
      fireworks.push({
        x,
        y: canvas.height,
        targetY,
        vy: -10 - Math.random() * 5,
        exploded: false,
        particles: [],
        burstRing: 0,
      });
    };

    const createParticles = (firework: Firework) => {
      const particleCount = 40 + Math.floor(Math.random() * 20); // Reduced for performance
      const color = pinkColors[Math.floor(Math.random() * pinkColors.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 3 + Math.random() * 4; // Increased velocity for more visible burst
        
        firework.particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          maxLife: 1,
          color,
          size: 2 + Math.random() * 2,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];

        if (!firework.exploded) {
          // Move firework up
          firework.y += firework.vy;
          firework.vy += 0.15; // gravity

          // Draw rocket trail
          ctx.beginPath();
          ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'oklch(0.85 0.15 340)';
          ctx.fill();

          // Check if reached target
          if (firework.y <= firework.targetY) {
            firework.exploded = true;
            createParticles(firework);
          }
        } else {
          // Draw expanding burst ring for the "pop" effect
          if (firework.burstRing < 30) {
            firework.burstRing += 2;
            const ringOpacity = 1 - (firework.burstRing / 30);
            
            ctx.beginPath();
            ctx.arc(firework.x, firework.y, firework.burstRing, 0, Math.PI * 2);
            ctx.strokeStyle = `oklch(0.85 0.15 340 / ${ringOpacity})`;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Inner flash
            ctx.beginPath();
            ctx.arc(firework.x, firework.y, firework.burstRing * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `oklch(0.95 0.10 345 / ${ringOpacity * 0.5})`;
            ctx.fill();
          }

          // Update and draw particles
          for (let j = firework.particles.length - 1; j >= 0; j--) {
            const particle = firework.particles[j];

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.08; // gravity
            particle.vx *= 0.99; // air resistance
            particle.life -= 0.012; // Slightly faster fade

            if (particle.life <= 0) {
              firework.particles.splice(j, 1);
              continue;
            }

            // Draw particle with glow
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(')', ` / ${particle.life})`);
            ctx.fill();

            // Add glow effect
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(')', ` / ${particle.life * 0.3})`);
            ctx.fill();
          }

          // Remove firework if all particles are gone and burst is complete
          if (firework.particles.length === 0 && firework.burstRing >= 30) {
            fireworks.splice(i, 1);
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    // Create fireworks periodically
    const fireworkInterval = setInterval(() => {
      createFirework();
    }, 500); // Slightly slower spawn rate

    let animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(fireworkInterval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}
