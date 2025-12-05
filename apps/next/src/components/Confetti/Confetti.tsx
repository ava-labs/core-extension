import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import ConfettiLib from 'react-confetti';

export interface ConfettiMethods {
  restart: () => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
}

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

export const Confetti = forwardRef<ConfettiMethods>((_, ref) => {
  const [key, setKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const { width, height } = useWindowSize();

  const restart = useCallback(() => {
    setShowConfetti(false);
    setOpacity(1);
    setKey((v) => v + 1);
    setShowConfetti(true);
  }, []);

  useEffect(() => {
    if (showConfetti) {
      // Start fading out after 2.7 seconds, finish at 3 seconds
      const fadeOutStart = setTimeout(() => {
        setOpacity(0);
      }, 2700);

      // Hide confetti after animation completes
      const hideTimeout = setTimeout(() => {
        setShowConfetti(false);
        setOpacity(1); // Reset opacity for next time
      }, 3000);

      return () => {
        clearTimeout(fadeOutStart);
        clearTimeout(hideTimeout);
      };
    }
  }, [showConfetti]);

  useImperativeHandle(ref, () => ({
    restart,
    reset: () => {
      setShowConfetti(false);
    },
    pause: () => {
      // react-confetti doesn't have pause, but we can hide it
      setShowConfetti(false);
    },
    resume: () => {
      setShowConfetti(true);
    },
  }));

  if (!showConfetti || width === 0 || height === 0) {
    return null;
  }

  return (
    <ConfettiLib
      key={key}
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={250}
      gravity={0.4}
      initialVelocityY={3}
      initialVelocityX={5}
      wind={0}
      colors={['#098F69', '#1FC626', '#42C49F']}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity,
        transition: 'opacity 0.3s ease-out',
      }}
    />
  );
});

Confetti.displayName = 'Confetti';
