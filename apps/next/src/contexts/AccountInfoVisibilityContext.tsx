import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
  useMemo,
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
  children?: ReactNode;
}) => {
  const [isAccountInfoVisible, setIsAccountInfoVisible] = useState(false);
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setAccountInfoElement = setElement;

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

  const value = useMemo(
    () => ({ isAccountInfoVisible, setAccountInfoElement }),
    [isAccountInfoVisible, setAccountInfoElement],
  );

  return (
    <AccountInfoVisibilityContext.Provider value={value}>
      {children}
    </AccountInfoVisibilityContext.Provider>
  );
};

const defaultContextValue: AccountInfoVisibilityContextType = {
  isAccountInfoVisible: false,
  setAccountInfoElement: () => {},
};

export const useAccountInfoVisibility = () => {
  const context = useContext(AccountInfoVisibilityContext);
  // Return default value if context is not available (e.g., during initial render)
  return context ?? defaultContextValue;
};
