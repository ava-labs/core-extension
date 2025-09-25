import { useBridge } from '@core/ui';
import { createContext, FC, PropsWithChildren, use } from 'react';

export const BridgeContext = createContext<
  ReturnType<typeof useBridge> | undefined
>(undefined);

export const BridgeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <BridgeContext.Provider value={useBridge()}>
      {children}
    </BridgeContext.Provider>
  );
};

export const useBridgeContext = () => {
  const context = use(BridgeContext);
  if (!context) {
    throw new Error(
      'useBridgeContext must be used within a BridgeContextProvider',
    );
  }
  return context;
};
