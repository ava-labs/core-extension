import { injectable } from 'tsyringe';
import { ChainId } from '@avalabs/core-chains-sdk';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  PvmCategories,
  CoreEthCategories,
  AvmCategories,
} from '@core/types';

import { BalanceAggregatorService } from '~/services/balances/BalanceAggregatorService';
import { AccountsService } from '~/services/accounts/AccountsService';
import { AvalancheBalanceItem } from '~/api-clients/balance-api';
import { AVALANCHE_CHAIN_IDS } from '~/api-clients/constants';
import { TokenUnit } from '@avalabs/core-utils-sdk';

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

    const tokenUnit = Object.entries(atomicBalances).reduce(
      (bigAcc, [chainId, chainBalance]) => {
        return Object.entries(chainBalance).reduce(
          (acc, [accountAddress, atomicBalance]) => {
            if (!accountsOfInterest.includes(accountAddress)) {
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
              Object.values(atomicBalance.atomicMemoryUnlocked).map(
                (balance) => {
                  tempAcc = tempAcc.add(
                    new TokenUnit(
                      balance,
                      atomicBalance.nativeTokenBalance.decimals,
                      '',
                    ),
                  );
                },
              );
            }
            return tempAcc;
          },
          bigAcc,
        );
      },
      // TODO: we could pass in the Token symbol as a param for the handler
      new TokenUnit('0', 18, 'N/A'),
    );

    return {
      ...request,
      result: {
        sum: tokenUnit.toDisplay({ asNumber: true }),
      },
    };
  };
}
