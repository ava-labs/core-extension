import { createContext, ReactNode, useContext } from 'react';

import { useMaxAmountForTokenSend } from '@/hooks/useMaxAmountForTokenSend';

type SendMaxAmount = ReturnType<typeof useMaxAmountForTokenSend>;

const SendMaxAmountContext = createContext<SendMaxAmount | null>(null);

export const SendMaxAmountProvider = ({
  value,
  children,
}: {
  value: SendMaxAmount;
  children: ReactNode;
}) => (
  <SendMaxAmountContext.Provider value={value}>
    {children}
  </SendMaxAmountContext.Provider>
);

export const useSendMaxAmount = (): SendMaxAmount => {
  const context = useContext(SendMaxAmountContext);

  if (!context) {
    throw new Error(
      'useSendMaxAmount must be used within a SendMaxAmountProvider',
    );
  }

  return context;
};
