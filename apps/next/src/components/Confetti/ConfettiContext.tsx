import React, {
  useCallback,
  useRef,
  ReactNode,
  createContext,
  use,
} from 'react';
import { Confetti, ConfettiMethods } from './Confetti';

const ConfettiMethodsContext = createContext<
  React.RefObject<ConfettiMethods | null>
>({ current: null });

export const ConfettiProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const confettiRef = useRef<ConfettiMethods>(null);

  return (
    <ConfettiMethodsContext.Provider value={confettiRef}>
      {children}
      <Confetti ref={confettiRef} />
    </ConfettiMethodsContext.Provider>
  );
};

export function useConfettiContext() {
  const methodsRef = use(ConfettiMethodsContext);
  const triggerConfetti = useCallback(() => {
    methodsRef.current?.restart();
  }, [methodsRef]);
  const stopConfetti = useCallback(() => {
    methodsRef.current?.reset();
  }, [methodsRef]);
  return { triggerConfetti, stopConfetti };
}
