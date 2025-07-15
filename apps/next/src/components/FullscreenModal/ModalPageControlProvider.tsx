import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { PageControlData } from '../PageControl';

type BackButtonHandler = () => void;

const ModalPageControlContext = createContext<
  | undefined
  | (PageControlData & {
      setTotal: (total: number) => void;
      setCurrent: (current: number) => void;
      onBackHandler?: BackButtonHandler;
      registerBackButtonHandler: (onBackHandler: BackButtonHandler) => void;
      isBackButtonVisible: boolean;
      setIsBackButtonVisible: (isBackButtonVisible: boolean) => void;
    })
>(undefined);

export const ModalPageControlProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(true);
  const [onBackHandler, setOnBackHandler] = useState<BackButtonHandler>();
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);

  /**
   * Used by modal's child components to register a listener for the "back" button.
   * @returns {Function} a callback that unregisters the handler.
   */
  const registerBackButtonHandler = useCallback(
    (newHandler: BackButtonHandler) => {
      setOnBackHandler(() => newHandler);

      return () => {
        setOnBackHandler(undefined);
      };
    },
    [setOnBackHandler],
  );

  useEffect(() => {
    setIsBackButtonVisible(current > 1);
  }, [current]);

  return (
    <ModalPageControlContext.Provider
      value={{
        total,
        current,
        setTotal,
        setCurrent,
        onBackHandler,
        registerBackButtonHandler,
        isBackButtonVisible,
        setIsBackButtonVisible,
      }}
    >
      {children}
    </ModalPageControlContext.Provider>
  );
};

export const useModalPageControl = () => {
  const context = useContext(ModalPageControlContext);
  if (!context) {
    throw new Error(
      'useModalPageControl must be used within ModalPageControlProvider',
    );
  }

  return context;
};
