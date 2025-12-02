import { uniqBy, merge } from 'lodash';
import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';
import { Account, AtomicBalances, Balances } from '@core/types';
import {
  AvalancheXpGetBalancesRequestItem,
  AvmGetBalancesResponse,
  BtcGetBalancesRequestItem,
  BtcGetBalancesResponse,
  Currency,
  EvmGetBalancesResponse,
  GetBalancesRequestBody,
  GetBalancesResponse,
  PvmGetBalancesResponse,
  SvmGetBalancesRequestItem,
  SvmGetBalancesResponse,
  CorethGetBalancesResponse,
} from '~/api-clients/balance-api';
import {
  caipToChainId,
  chainIdToCaip,
  getNameSpaceFromScope,
} from '@core/common';
import {
  BalanceResponse,
  GetBalanceRequestItem,
  NameSpace,
  NotAvalancheRequestItem,
} from '~/api-clients/types';
import { normalizeXPAddress } from '~/api-clients/helpers';
import {
  mapErc20TokenBalance,
  mapSplTokenBalance,
  mapNativeTokenBalance,
} from '~/api-clients/mappers';
import {
  AVALANCHE_CHAIN_IDS,
  Caip2IdAccountTypeMap,
  CORE_ETH_CAIP2ID,
} from '~/api-clients/constants';

export const isErrorResponse = (
  response: GetBalancesResponse,
): response is { error: string } => !!response.error;

export const isEvmGetBalancesResponse = (
  response: GetBalancesResponse,
): response is EvmGetBalancesResponse => {
  return (response as EvmGetBalancesResponse).networkType === 'evm';
};

export const isAvmGetBalancesResponse = (
  response: GetBalancesResponse,
): response is AvmGetBalancesResponse => {
  return (response as AvmGetBalancesResponse).networkType === 'avm';
};

export const isBtcGetBalancesResponse = (
  response: GetBalancesResponse,
): response is BtcGetBalancesResponse => {
  return (response as BtcGetBalancesResponse).networkType === 'btc';
};

export const isPvmGetBalancesResponse = (
  response: GetBalancesResponse,
): response is PvmGetBalancesResponse => {
  return (response as PvmGetBalancesResponse).networkType === 'pvm';
};

export const isSvmGetBalancesResponse = (
  response: GetBalancesResponse,
): response is SvmGetBalancesResponse => {
  return (response as SvmGetBalancesResponse).networkType === 'svm';
};

export const isCorethGetBalancesResponse = (
  response: GetBalancesResponse,
): response is CorethGetBalancesResponse => {
  return (response as CorethGetBalancesResponse).networkType === 'coreth';
};

type PartialGetBalancePayload = Record<
  string, // the name space
  GetBalanceRequestItem
>;

interface GetChainSpecificPayloadObjectParams {
  nameSpace: NameSpace;
  address: string;
  reference: string;
}

const getChainSpecificPayloadObject = ({
  nameSpace,
  address,
  reference,
}: GetChainSpecificPayloadObjectParams): GetBalanceRequestItem => {
  switch (nameSpace) {
    case 'avax':
      return {
        namespace: nameSpace,
        references: [reference],
        addressDetails: [
          {
            addresses: [normalizeXPAddress(address)],
            walletId: normalizeXPAddress(address),
          },
        ],
      } as AvalancheXpGetBalancesRequestItem;
    case 'solana':
      return {
        namespace: nameSpace,
        references: [reference],
        addresses: [address],
      } as SvmGetBalancesRequestItem;
    case 'bip122':
      return {
        namespace: nameSpace,
        references: [reference],
        addresses: [address],
      } as BtcGetBalancesRequestItem;
    default:
      return {
        namespace: nameSpace,
        references: [reference],
        addresses: [address],
      };
  }
};

export const createGetBalancePayload = (
  accounts: Account[],
  chainIds: number[],
  currency: Currency = 'usd',
): GetBalancesRequestBody => {
  // TODO: coreth caip2 ID from extension
  const caip2Ids = chainIds.map(chainIdToCaip);
  const partialGetBalancePayload = accounts.reduce<PartialGetBalancePayload>(
    (accumulator, account) => {
      return caip2Ids.reduce<PartialGetBalancePayload>((acc, caip2Id) => {
        // when we don't have an address for the given account for the given chain, there is nothing to query
        const nameSpace = getNameSpaceFromScope(caip2Id) as
          | NameSpace
          | null
          | undefined;
        if (
          !nameSpace ||
          !Caip2IdAccountTypeMap[caip2Id] ||
          !account[Caip2IdAccountTypeMap[caip2Id]]
        ) {
          return acc;
        }

        const address = account[Caip2IdAccountTypeMap[caip2Id]]!;
        const [, reference] = caip2Id.split(':');
        // if the caip2Id is "malformed" we skip it
        if (!reference) {
          return acc;
        }

        const chainSpecificRequestItem = getChainSpecificPayloadObject({
          nameSpace,
          address,
          reference,
        });

        if (!acc[nameSpace]) {
          return {
            ...acc,
            [nameSpace]: {
              ...chainSpecificRequestItem,
            },
          };
        }

        if (nameSpace === 'avax') {
          return {
            ...acc,
            [nameSpace]: {
              references: Array.from(
                new Set([...acc[nameSpace].references, reference]),
              ),
              addressDetails: uniqBy(
                [
                  ...((acc[nameSpace] as AvalancheXpGetBalancesRequestItem)
                    .addressDetails ?? []),
                  ...((
                    chainSpecificRequestItem as AvalancheXpGetBalancesRequestItem
                  ).addressDetails ?? []),
                ],
                'walletId',
              ),
              namespace: nameSpace,
            },
          } as PartialGetBalancePayload;
        }

        return {
          ...acc,
          [nameSpace]: {
            namespace: nameSpace,
            references: Array.from(
              new Set([...acc[nameSpace].references, reference]),
            ),
            addresses: Array.from(
              new Set([
                ...(acc[nameSpace] as NotAvalancheRequestItem).addresses,
                address,
              ]),
            ),
          },
        } as PartialGetBalancePayload;
      }, accumulator);
    },
    {},
  );

  const coreEthGetBalancePayload = accounts.reduce<PartialGetBalancePayload>(
    (accumulator, account) => {
      const caip2Id = AvalancheCaip2ChainId.C;
      const nameSpace = getNameSpaceFromScope(caip2Id) as
        | NameSpace
        | null
        | undefined;
      if (
        !nameSpace ||
        !Caip2IdAccountTypeMap[caip2Id] ||
        !account[Caip2IdAccountTypeMap[caip2Id]]
      ) {
        return accumulator;
      }

      const address = account[Caip2IdAccountTypeMap[caip2Id]]!;
      const [, reference] = caip2Id.split(':');
      // if the caip2Id is "malformed" we skip it
      if (!reference) {
        return accumulator;
      }

      const chainSpecificRequestItem = getChainSpecificPayloadObject({
        nameSpace,
        address,
        reference,
      });

      if (!accumulator[nameSpace]) {
        return {
          ...accumulator,
          [nameSpace]: {
            ...chainSpecificRequestItem,
          },
        };
      }

      if (nameSpace === 'avax') {
        return {
          ...accumulator,
          [nameSpace]: {
            references: Array.from(
              new Set([...accumulator[nameSpace].references, reference]),
            ),
            addressDetails: uniqBy(
              [
                ...((
                  accumulator[nameSpace] as AvalancheXpGetBalancesRequestItem
                ).addressDetails ?? []),
                ...((
                  chainSpecificRequestItem as AvalancheXpGetBalancesRequestItem
                ).addressDetails ?? []),
              ],
              'walletId',
            ),
            namespace: nameSpace,
          },
        } as PartialGetBalancePayload;
      }

      return accumulator;
    },
    {},
  );
  return {
    data: [
      ...Object.entries(coreEthGetBalancePayload),
      ...Object.entries(partialGetBalancePayload),
    ].map(([nameSpace, { namespace, ...rest }]) => ({
      namespace: nameSpace,
      ...rest,
    })),
    currency,
  } as GetBalancesRequestBody;
};

export const convertBalanceResponsesToCacheBalanceObject = (
  balanceResponses: BalanceResponse[],
): Balances => {
  return balanceResponses.reduce<Balances>((accumulator, balanceResponse) => {
    let chainId: number = 0;
    try {
      chainId = caipToChainId(balanceResponse.caip2Id);
    } catch (error) {
      // if we are throwing error because of CoreEth, we are ignoring it
      if (
        !(error instanceof Error) ||
        !error.message.includes(CORE_ETH_CAIP2ID)
      ) {
        throw error;
      }
    }

    if (isEvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      const tokenBalanceMapper = mapErc20TokenBalance(chainId);

      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [balanceResponse.id]: {
            ...(accumulator[chainId]?.[balanceResponse.id] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
            ...balanceResponse.balances.erc20TokenBalances.reduce(
              (acc, tokenBalance) => ({
                ...acc,
                [tokenBalance.address]: tokenBalanceMapper(tokenBalance),
              }),
              {},
            ),
          },
        },
      };
    }

    if (isPvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
      const accountKey = `P-${balanceResponse.id}`;
      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [accountKey]: {
            ...(accumulator[chainId]?.[accountKey] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
          },
        },
      };
    }

    if (isAvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
      const accountKey = `X-${balanceResponse.id}`;
      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [accountKey]: {
            ...(accumulator[chainId]?.[accountKey] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
          },
        },
      };
    }

    if (isBtcGetBalancesResponse(balanceResponse) && chainId !== 0) {
      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [balanceResponse.id]: {
            ...(accumulator[chainId]?.[balanceResponse.id] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
          },
        },
      };
    }

    if (isSvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [balanceResponse.id]: {
            ...(accumulator[chainId]?.[balanceResponse.id] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
            ...balanceResponse.balances.splTokenBalances.reduce(
              (acc, tokenBalance) => {
                return {
                  ...acc,
                  [tokenBalance.address]: mapSplTokenBalance(tokenBalance),
                };
              },
              {},
            ),
          },
        },
      };
    }

    if (isCorethGetBalancesResponse(balanceResponse) && chainId === 0) {
      const mainNetC = AVALANCHE_CHAIN_IDS.MAINNET_C;
      return {
        ...accumulator,
        [mainNetC]: {
          ...(accumulator[mainNetC] ?? {}),
          [balanceResponse.id]: {
            ...(accumulator[mainNetC]?.[balanceResponse.id] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
            categories: {
              ...(accumulator[mainNetC]?.[balanceResponse.id]?.categories ??
                {}),
              ...balanceResponse.balances.categories,
            },
          },
        },
      } as Balances;
    }

    return accumulator;
  }, {});
};

export const convertBalanceResponseToAtomicCacheBalanceObject = (
  balanceResponses: BalanceResponse[],
): AtomicBalances => {
  return balanceResponses.reduce<AtomicBalances>(
    (accumulator, balanceResponse) => {
      let chainId: number = 0;
      try {
        chainId = caipToChainId(balanceResponse.caip2Id);
      } catch (error) {
        // if we are throwing error because of CoreEth, we are ignoring it
        if (
          !(error instanceof Error) ||
          !error.message.includes(CORE_ETH_CAIP2ID)
        ) {
          throw error;
        }
      }

      if (isPvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
        // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
        const accountKey = `P-${balanceResponse.id}`;
        const mergedAccountObject = merge(
          accumulator[chainId]?.[accountKey] ?? {},
          balanceResponse.balances.categories,
        );
        return {
          ...accumulator,
          [chainId]: {
            ...(accumulator[chainId] ?? {}),
            [accountKey]: {
              ...mergedAccountObject,
              nativeTokenBalance: balanceResponse.balances.nativeTokenBalance,
            },
          },
        };
      }

      if (isAvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
        // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
        const accountKey = `X-${balanceResponse.id}`;
        const mergedAccountObject = merge(
          accumulator[chainId]?.[accountKey] ?? {},
          balanceResponse.balances.categories,
        );
        return {
          ...accumulator,
          [chainId]: {
            ...(accumulator[chainId] ?? {}),
            [accountKey]: mergedAccountObject,
          },
        };
      }

      if (isCorethGetBalancesResponse(balanceResponse) && chainId === 0) {
        const mainNetC = AVALANCHE_CHAIN_IDS.MAINNET_C;
        const accountKey = `C-${balanceResponse.id}`;
        const mergedAccountObject = merge(
          accumulator[mainNetC]?.[accountKey] ?? {},
          balanceResponse.balances.categories,
        );
        return {
          ...accumulator,
          [mainNetC]: {
            ...(accumulator[mainNetC] ?? {}),
            [accountKey]: mergedAccountObject,
          },
        };
      }

      return accumulator;
    },
    {},
  );
};
