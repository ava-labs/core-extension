import { sum } from 'lodash';
import { injectable } from 'tsyringe';
import { ChainId } from '@avalabs/core-chains-sdk';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  PvmCategories,
  CoreEthCategories,
  AvmCategories,
} from '@core/types';
import { balanceToDecimal } from '@core/common';

import { BalanceAggregatorService } from '~/services/balances/BalanceAggregatorService';
import { AccountsService } from '~/services/accounts/AccountsService';
import { AvalancheBalanceItem } from '~/api-clients/balance-api';
import { AVALANCHE_CHAIN_IDS } from '~/api-clients/constants';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GET_ATOMIC_FUNDS_FOR_WALLET,
  { sum: number },
  { walletId: string }
>;

type PvmCategoryWithNativeTokenBalance = PvmCategories & {
  nativeTokenBalance: { decimals: number };
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

@injectable()
export class GetTotalAtomicFundsForWalletHandler implements HandlerType {
  method = ExtensionRequest.GET_ATOMIC_FUNDS_FOR_WALLET as const;

  constructor(
    private balanceAggregatorService: BalanceAggregatorService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { walletId } = request.params;

    const primaryAccounts = Object.values(
      (await this.accountsService.getAccounts()).primary,
    ).flat();
    const accountsInWallet = primaryAccounts
      .filter((account) => account.walletId === walletId)
      .reduce<Record<string, boolean>>(
        (accumulator, account) => ({
          ...accumulator,
          [account.addressCoreEth ?? '']: true,
          [account.addressAVM ?? '']: true,
          [account.addressPVM ?? '']: true,
        }),
        {},
      );

    const { atomicBalances } = this.balanceAggregatorService;
    const atomicFundsSum = sum(
      Object.entries(atomicBalances).flatMap(([chainId, chainBalance]) => {
        return Object.entries(chainBalance).flatMap(
          ([accountAddress, atomicBalance]) => {
            if (!accountsInWallet[accountAddress]) {
              return 0;
            }
            if (isCoreEthOrAvmAtomicBalance(chainId, atomicBalance)) {
              return sum(
                Object.values(atomicBalance.atomicMemoryUnlocked).flatMap(
                  (atomicBalanceItems: AvalancheBalanceItem[]) =>
                    atomicBalanceItems.flatMap((item) =>
                      balanceToDecimal(item.balance, item.decimals),
                    ),
                ),
              );
            }
            if (isPvmAtomicBalance(chainId, atomicBalance)) {
              return sum(
                Object.values(atomicBalance.atomicMemoryUnlocked).flatMap(
                  (balance) =>
                    balanceToDecimal(
                      balance,
                      atomicBalance.nativeTokenBalance.decimals,
                    ),
                ),
              );
            }
            return 0;
          },
        );
      }),
    );

    return {
      ...request,
      result: {
        sum: atomicFundsSum,
      },
    };
  };
}
