import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

type AccountInfoVisibilityContextType = {
  isAccountInfoVisible: boolean;
  setAccountInfoElement: (element: HTMLDivElement | null) => void;
};

const AccountInfoVisibilityContext =
  createContext<AccountInfoVisibilityContextType | null>(null);

export const AccountInfoVisibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isAccountInfoVisible, setIsAccountInfoVisible] = useState(false);
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setAccountInfoElement = useCallback(
    (newElement: HTMLDivElement | null) => {
      setElement(newElement);
    },
    [],
  );

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!element) {
      setIsAccountInfoVisible(false);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsAccountInfoVisible(entry?.isIntersecting ?? false);
      },
      { threshold: 0 },
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [element]);

  return (
    <AccountInfoVisibilityContext.Provider
      value={{ isAccountInfoVisible, setAccountInfoElement }}
    >
      {children}
    </AccountInfoVisibilityContext.Provider>
  );
};

export const useAccountInfoVisibility = () => {
  const context = useContext(AccountInfoVisibilityContext);
  if (!context) {
    throw new Error(
      'useAccountInfoVisibility must be used within AccountInfoVisibilityProvider',
    );
  }
  return context;
};
