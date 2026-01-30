import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';
import { getNameSpaceFromScope } from '@core/common';
import { Account } from '@core/types';
import { uniqBy } from 'lodash';
import { AvalancheCorethGetBalancesRequestItem } from '~/api-clients/balance-api';
import { NameSpace, PartialGetBalancePayload } from '~/api-clients/types';
import { getAccountAddressForCaip2Identifier } from './getAccountAddressFromCaip2IdOrNamesSpace';
import { getChainSpecificPayload } from './getChainSpecificPayload';

type CoreEthReference =
  AvalancheCorethGetBalancesRequestItem['references'][number];

function isAvaxNamespace(nameSpace: NameSpace): nameSpace is 'avax' {
  return nameSpace === 'avax';
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

  const [, reference] = caip2Id.split(':') as [string, CoreEthReference];

  // if the caip2Id is "malformed" we skip it
  if (!nameSpace || !reference) {
    return [];
  }

  const reduced = accounts.reduce<PartialGetBalancePayload>(
    (accumulator, account) => {
      const address = getAccountAddressForCaip2Identifier({
        account,
        caip2Id,
        nameSpace,
      });
      if (!address) {
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

      if (!isAvaxNamespace(nameSpace)) {
        return accumulator;
      }

      const requestItem = accumulator[
        nameSpace
      ] as AvalancheCorethGetBalancesRequestItem;
      requestItem.references.push(reference);
      requestItem.addressDetails.push(
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
