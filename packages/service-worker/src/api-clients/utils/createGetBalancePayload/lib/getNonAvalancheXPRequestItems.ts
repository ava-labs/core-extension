import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';
import { getNameSpaceFromScope } from '@core/common';
import { Account } from '@core/types';
import {
  NameSpace,
  NonAvalancheRequestItem,
  PartialGetBalancePayload,
} from '~/api-clients/types';
import { getAccountAddressFromCaip2IdOrNamesSpace } from './getAccountAddressFromCaip2IdOrNamesSpace';
import { getChainSpecificPayload } from './getChainSpecificPayload';

const xpCaip2Ids: string[] = [
  AvalancheCaip2ChainId.P,
  AvalancheCaip2ChainId.X,
  AvalancheCaip2ChainId.P_TESTNET,
  AvalancheCaip2ChainId.X_TESTNET,
];

export function getNonAvalancheXPRequestItems(
  accounts: Account[],
  caip2Ids: string[],
) {
  const reduced = accounts.reduce<PartialGetBalancePayload>(
    (accumulator, account) => {
      return caip2Ids.reduce<PartialGetBalancePayload>((acc, caip2Id) => {
        if (xpCaip2Ids.includes(caip2Id)) {
          return acc;
        }

        const nameSpace = getNameSpaceFromScope(caip2Id) as
          | NameSpace
          | null
          | undefined;

        if (!nameSpace) {
          return acc;
        }

        const address = getAccountAddressFromCaip2IdOrNamesSpace({
          account,
          nameSpace,
          caip2Id,
        });

        // when we don't have an address for the given account for the given chain, there is nothing to query
        if (!address) {
          return acc;
        }

        const [, reference] = caip2Id.split(':');
        // if the caip2Id is "malformed" we skip it
        if (!reference) {
          return acc;
        }

        if (!acc[nameSpace]) {
          acc[nameSpace] = getChainSpecificPayload({
            nameSpace,
            address,
            reference,
          });
          return acc;
        }

        const requestItem = acc[nameSpace] as NonAvalancheRequestItem;
        (requestItem.references as string[]).push(reference);
        requestItem.addresses.push(address);
        return acc;
      }, accumulator);
    },
    {},
  );

  const requestItems = Object.values(reduced) as NonAvalancheRequestItem[];
  requestItems.forEach((requestItem) => {
    requestItem.references = Array.from(new Set(requestItem.references));
    requestItem.addresses = Array.from(new Set(requestItem.addresses));
  });

  return requestItems;
}
