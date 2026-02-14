import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  exploded: boolean;
  particles: Particle[];
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
      const x = Math.random() * canvas.width;
      const targetY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.1;
      
      fireworks.push({
        x,
        y: canvas.height,
        targetY,
        vy: -8 - Math.random() * 4,
        exploded: false,
        particles: [],
      });
    };

    const createParticles = (firework: Firework) => {
      const particleCount = 50 + Math.floor(Math.random() * 30);
      const color = pinkColors[Math.floor(Math.random() * pinkColors.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 3;
        
        firework.particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          maxLife: 1,
          color,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];

        if (!firework.exploded) {
          // Move firework up
          firework.y += firework.vy;
          firework.vy += 0.1; // gravity

          // Draw rocket
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
          // Update and draw particles
          for (let j = firework.particles.length - 1; j >= 0; j--) {
            const particle = firework.particles[j];

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.05; // gravity
            particle.life -= 0.01;

            if (particle.life <= 0) {
              firework.particles.splice(j, 1);
              continue;
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(')', ` / ${particle.life})`);
            ctx.fill();
          }

          // Remove firework if all particles are gone
          if (firework.particles.length === 0) {
            fireworks.splice(i, 1);
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    // Create fireworks periodically
    const fireworkInterval = setInterval(() => {
      createFirework();
    }, 400);

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
