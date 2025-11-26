import React, { useCallback, useRef, ReactNode, useEffect } from 'react';
import { Confetti, ConfettiMethods } from './Confetti';

// Global ref to store confetti instance - works without React context
let globalConfettiRef: React.RefObject<ConfettiMethods | null> | null = null;

export const ConfettiProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const confettiRef = useRef<ConfettiMethods>(null);

  // Register the ref globally when component mounts
  useEffect(() => {
    globalConfettiRef = confettiRef;
    return () => {
      globalConfettiRef = null;
    };
  }, []);

  return (
    <>
      {children}
      <Confetti ref={confettiRef} />
    </>
  );
};

export function useConfettiContext() {
  const triggerConfetti = useCallback(() => {
    globalConfettiRef?.current?.restart();
  }, []);

  return { triggerConfetti };
}
