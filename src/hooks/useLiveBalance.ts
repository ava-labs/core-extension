import { useEffect } from 'react';
import { useBalancesContext } from '@src/contexts/BalancesProvider';

export const useLiveBalance = () => {
  const { registerSubscriber, unregisterSubscriber } = useBalancesContext();

  useEffect(() => {
    registerSubscriber();

    return () => {
      unregisterSubscriber();
    };
  }, [registerSubscriber, unregisterSubscriber]);
};
