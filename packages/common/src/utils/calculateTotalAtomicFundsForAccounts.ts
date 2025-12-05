import {
  AtomicBalances,
  AvmCategories,
  CoreEthCategories,
  PvmCategories,
  AvalancheBalanceItem,
} from '@core/types';
import { ChainId } from '@avalabs/core-chains-sdk';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { AVALANCHE_CHAIN_IDS } from './constants';

type PvmCategoryWithNativeTokenBalance = PvmCategories & {
  nativeTokenBalance: { decimals: number; price: number };
};

type Categories = PvmCategories | CoreEthCategories | AvmCategories;

const isCoreEthOrAvmAtomicBalance = (
  chainId: string | number,
  atomicBalance: Categories,
): atomicBalance is CoreEthCategories | AvmCategories =>
  (AVALANCHE_CHAIN_IDS.MAINNET_C === chainId ||
    ChainId.AVALANCHE_X === Number(chainId)) &&
  'atomicMemoryUnlocked' in atomicBalance;

const isPvmAtomicBalance = (
  chainId: string | number,
  atomicBalance: Categories,
): atomicBalance is PvmCategoryWithNativeTokenBalance => {
  return (
    !isNaN(Number(chainId)) &&
    Number(chainId) === ChainId.AVALANCHE_P &&
    'atomicMemoryUnlocked' in atomicBalance
  );
};

export const calculateTotalAtomicFundsForAccounts = (
  atomicBalances: AtomicBalances,
  accounts: Array<string | undefined>,
): TokenUnit => {
  return Object.entries(atomicBalances).reduce(
    (baseAccumulator, [chainId, chainBalance]) => {
      return Object.entries(chainBalance).reduce(
        (acc, [accountAddress, atomicBalance]) => {
          if (!accounts.includes(accountAddress)) {
            return acc;
          }
          let tempAcc = acc;
          if (isCoreEthOrAvmAtomicBalance(chainId, atomicBalance)) {
            Object.values(atomicBalance.atomicMemoryUnlocked).map(
              (atomicBalanceItems: AvalancheBalanceItem[]) => {
                atomicBalanceItems.map((item) => {
                  tempAcc = tempAcc.add(
                    new TokenUnit(item.balance, item.decimals, item.symbol),
                  );
                });
              },
            );
          }
          if (isPvmAtomicBalance(chainId, atomicBalance)) {
            Object.values(atomicBalance.atomicMemoryUnlocked).map((balance) => {
              tempAcc = tempAcc.add(
                new TokenUnit(
                  balance,
                  atomicBalance.nativeTokenBalance.decimals,
                  '',
                ),
              );
            });
          }
          return tempAcc;
        },
        baseAccumulator,
      );
    },
    // TODO: we could pass in the Token symbol as a param
    new TokenUnit('0', 18, 'N/A'),
  );
};
