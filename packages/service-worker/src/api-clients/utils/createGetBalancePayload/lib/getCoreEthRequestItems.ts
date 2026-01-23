import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';
import { getNameSpaceFromScope } from '@core/common';
import { Account } from '@core/types';
import { uniqBy } from 'lodash';
import { AvalancheCorethGetBalancesRequestItem } from '~/api-clients/balance-api';
import {
  GetBalanceRequestItem,
  NameSpace,
  PartialGetBalancePayload,
} from '~/api-clients/types';
import { getAccountAddressFromCaip2IdOrNamesSpace } from './getAccountAddressFromCaip2IdOrNamesSpace';
import { getChainSpecificPayload } from './getChainSpecificPayload';

type CoreEthReference =
  AvalancheCorethGetBalancesRequestItem['references'][number];

function isAvaxNamespace(nameSpace: NameSpace): nameSpace is 'avax' {
  return nameSpace === 'avax';
}

function isAvalancheCorethRequestItem(
  requestItem: GetBalanceRequestItem,
): requestItem is AvalancheCorethGetBalancesRequestItem {
  return requestItem.namespace === 'avax';
}

export function getCoreEthRequestItems(
  accounts: Account[],
  filterOutDustUtxos: boolean,
) {
  const caip2Id = AvalancheCaip2ChainId.C;
  const nameSpace = getNameSpaceFromScope(caip2Id) as
    | NameSpace
    | null
    | undefined;

  if (!nameSpace) {
    return [];
  }

  const reduced = accounts.reduce<PartialGetBalancePayload>(
    (accumulator, account) => {
      const address = getAccountAddressFromCaip2IdOrNamesSpace({
        account,
        caip2Id,
        nameSpace,
      });
      const [, reference] = caip2Id.split(':') as [string, CoreEthReference];
      // if the caip2Id is "malformed" we skip it
      if (!reference || !address) {
        return accumulator;
      }

      const chainSpecificRequestItem = getChainSpecificPayload({
        nameSpace,
        address,
        reference,
        filterOutDustUtxos,
      }) as AvalancheCorethGetBalancesRequestItem;

      if (!accumulator[nameSpace]) {
        accumulator[nameSpace] = chainSpecificRequestItem;
        return accumulator;
      }

      if (
        !isAvaxNamespace(nameSpace) ||
        !isAvalancheCorethRequestItem(accumulator[nameSpace])
      ) {
        return accumulator;
      }

      accumulator[nameSpace].references.push(reference);
      accumulator[nameSpace].addressDetails.push(
        ...chainSpecificRequestItem.addressDetails,
      );

      return accumulator;
    },
    {},
  );

  const requestItems = Object.values(
    reduced,
  ) as AvalancheCorethGetBalancesRequestItem[];
  requestItems.forEach((requestItem) => {
    requestItem.references = Array.from(new Set(requestItem.references));
    requestItem.addressDetails = uniqBy(requestItem.addressDetails, 'id');
  });

  return requestItems;
}
