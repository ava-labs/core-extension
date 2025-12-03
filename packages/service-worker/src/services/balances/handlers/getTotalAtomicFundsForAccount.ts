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
  ExtensionRequest.GET_ATOMIC_FUNDS_FOR_ACCOUNT,
  { sum: number },
  { accountId: string }
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
export class GetTotalAtomicFundsForAccountHandler implements HandlerType {
  method = ExtensionRequest.GET_ATOMIC_FUNDS_FOR_ACCOUNT as const;

  constructor(
    private balanceAggregatorService: BalanceAggregatorService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { accountId } = request.params;

    const primaryAccounts = Object.values(
      (await this.accountsService.getAccounts()).primary,
    ).flat();
    const selectedAccount = primaryAccounts.find(
      (account) => account.id === accountId,
    );

    if (!selectedAccount) {
      return {
        ...request,
        result: {
          sum: 0,
        },
      };
    }

    const accountsOfInterest = [
      selectedAccount.addressCoreEth,
      selectedAccount.addressAVM,
      selectedAccount.addressPVM,
    ];

    const { atomicBalances } = this.balanceAggregatorService;
    const atomicFundsSum = sum(
      Object.entries(atomicBalances).flatMap(([chainId, chainBalance]) => {
        return Object.entries(chainBalance).flatMap(
          ([accountAddress, atomicBalance]) => {
            if (!accountsOfInterest.includes(accountAddress)) {
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
