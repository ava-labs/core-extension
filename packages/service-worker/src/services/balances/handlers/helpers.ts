import { AtomicBalances } from '@core/types';

export const getAvaxPrice = (atomicBalances: AtomicBalances): number => {
  for (const chain of Object.values(atomicBalances)) {
    for (const account of Object.values(chain)) {
      if ('nativeTokenBalance' in account) {
        const nativeTokenBalance = account.nativeTokenBalance as {
          price: number;
          internalId: string;
        };
        if (nativeTokenBalance.internalId === 'NATIVE-avax') {
          return nativeTokenBalance.price;
        }
      }
    }
  }

  return 0;
};
