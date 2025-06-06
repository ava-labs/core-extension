import { createContext, FC, useContext, useState, type ReactNode } from 'react';

import { PageControlData } from '../PageControl';

const ModalPageControlContext = createContext<
  | undefined
  | (PageControlData & {
      setTotal: (total: number) => void;
      setCurrent: (current: number) => void;
      isBackButtonVisible: boolean;
      setIsBackButtonVisible: (isBackButtonVisible: boolean) => void;
    })
>(undefined);

export const ModalPageControlProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(true);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);

  return (
    <ModalPageControlContext.Provider
      value={{
        total,
        current,
        setTotal,
        setCurrent,
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
