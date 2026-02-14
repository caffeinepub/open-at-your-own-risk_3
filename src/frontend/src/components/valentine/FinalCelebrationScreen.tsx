import { useEffect, useState, useRef } from 'react';
import { CELEBRATION_SCREEN } from './constants';
import { Volume2, VolumeX } from 'lucide-react';

export default function FinalCelebrationScreen() {
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: string; delay: number; duration: number }>>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Create floating hearts
    const hearts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
    }));
    setFloatingHearts(hearts);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen w-full bg-light-pink-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts background */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: heart.left,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          💗
        </div>
      ))}

      {/* Main content */}
      <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
        {/* Title */}
        <h1 className="text-7xl md:text-9xl font-bold text-pink-600 animate-fade-in-bloom animate-glow">
          {CELEBRATION_SCREEN.title}
        </h1>

        {/* Subtitle */}
        <p className="text-3xl md:text-4xl text-pink-700 font-semibold animate-fade-in-bloom" style={{ animationDelay: '0.2s' }}>
          {CELEBRATION_SCREEN.subtitle}
        </p>

        {/* GIF */}
        <div className="flex justify-center py-8 animate-fade-in-bloom" style={{ animationDelay: '0.4s' }}>
          <img
            src="/assets/generated/romantic-gif.dim_800x450.gif"
            alt="Romantic celebration"
            className="max-w-full w-full md:w-3/4 lg:w-2/3 rounded-3xl shadow-2xl"
          />
        </div>

        {/* Heart emoji row */}
        <div className="flex justify-center gap-6 text-5xl md:text-6xl animate-fade-in-bloom" style={{ animationDelay: '0.6s' }}>
          {CELEBRATION_SCREEN.heartEmojis.map((emoji, index) => (
            <span
              key={index}
              className="animate-bounce-gentle heart-glow inline-block"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Music control */}
        <div className="pt-8 animate-fade-in-bloom" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={toggleMusic}
            className="romantic-button bg-pink-500 text-white hover:bg-pink-600 flex items-center gap-3 mx-auto"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-6 h-6" />
                <span>Pause Music</span>
              </>
            ) : (
              <>
                <VolumeX className="w-6 h-6" />
                <span>Play Music</span>
              </>
            )}
          </button>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} loop>
          <source src="/assets/music/romantic.mp3" type="audio/mpeg" />
        </audio>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-pink-600 text-sm">
        <p>
          © {new Date().getFullYear()} • Built with 💖 using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-pink-700"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
