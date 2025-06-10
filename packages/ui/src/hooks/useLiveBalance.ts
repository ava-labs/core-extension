import { useEffect } from 'react';
import { useBalancesContext } from '../contexts';
import { TokenType } from '@avalabs/vm-module-types';

export const useLiveBalance = (tokenTypes: TokenType[]) => {
  const { registerSubscriber, unregisterSubscriber } = useBalancesContext();

  useEffect(() => {
    registerSubscriber(tokenTypes);

    return () => {
      unregisterSubscriber(tokenTypes);
    };
  }, [registerSubscriber, unregisterSubscriber, tokenTypes]);
};
