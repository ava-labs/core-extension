import { uniqBy } from 'lodash';
import { AvalancheXpGetBalancesRequestItem } from '~/api-clients/balance-api';

import { getNameSpaceFromScope, stripAddressPrefix } from '@core/common';
import { Account, AccountType } from '@core/types';
import { NameSpace } from '~/api-clients/types';
import { AddressResolver } from '~/services/secrets/AddressResolver';
import { SecretsService } from '~/services/secrets/SecretsService';
import { getAccountAddressFromCaip2IdOrNamesSpace } from './getAccountAddressFromCaip2IdOrNamesSpace';

async function getCoreXPRequestItems(
  accounts: Account[],
  caip2Ids: string[],
  secretsService: SecretsService,
  addressResolver: AddressResolver,
  filterOutDustUtxos: boolean,
) {
  const result = await Promise.all(
    accounts.flatMap((account) => {
      return caip2Ids.flatMap(async (caip2Id) => {
        const nameSpace = getNameSpaceFromScope(caip2Id) as
          | NameSpace
          | null
          | undefined;
        if (!nameSpace || nameSpace !== 'avax') {
          return null;
        }
        const [, reference] = caip2Id.split(':');

        const address = getAccountAddressFromCaip2IdOrNamesSpace({
          account,
          caip2Id,
          nameSpace,
        });

        if (!address) {
          return null;
        }

        const strippedAddress = stripAddressPrefix(address);

        if (account.type === AccountType.PRIMARY) {
          const xpub = await secretsService.getAvalancheExtendedPublicKey(
            account.walletId,
            account.index,
          );
          const legacyAddresses = xpub
            ? { externalAddresses: [], internalAddresses: [] }
            : await addressResolver.getXPAddressesForAccountIndex(
                account.walletId,
                account.index,
                'AVM',
              );

          if (!xpub && !legacyAddresses.externalAddresses.length) {
            return null;
          }

          return {
            namespace: nameSpace,
            references: [reference],
            filterOutDustUtxos,
            extendedPublicKeyDetails: xpub
              ? [
                  {
                    id: strippedAddress,
                    extendedPublicKey: xpub.key,
                  },
                ]
              : undefined,
            addressDetails:
              legacyAddresses.externalAddresses.length > 0
                ? [
                    {
                      id: strippedAddress,
                      addresses: legacyAddresses.externalAddresses.map(
                        (a) => a.address,
                      ),
                    },
                  ]
                : undefined,
          } as AvalancheXpGetBalancesRequestItem;
        } else {
          return {
            namespace: nameSpace,
            references: [reference],
            filterOutDustUtxos,
            addressDetails: [
              {
                id: strippedAddress,
                addresses: [strippedAddress],
              },
            ],
          } as AvalancheXpGetBalancesRequestItem;
        }
      });
    }),
  );

  return result.filter((x) => x != null);
}

export async function getAvalancheXPRequestItems(
  accounts: Account[],
  caip2Ids: string[],
  secretsService: SecretsService,
  addressResolver: AddressResolver,
  filterOutDustUtxos: boolean,
) {
  const coreXPRequestItems = await getCoreXPRequestItems(
    accounts,
    caip2Ids,
    secretsService,
    addressResolver,
    filterOutDustUtxos,
  );
  const avalancheXPRequestItems = coreXPRequestItems.reduce(
    (accumulator, requestPayloadItem) => {
      accumulator.references.push(...requestPayloadItem.references);
      if (requestPayloadItem.extendedPublicKeyDetails) {
        accumulator.extendedPublicKeyDetails ??= [];
        accumulator.extendedPublicKeyDetails.push(
          ...requestPayloadItem.extendedPublicKeyDetails,
        );
      }

      if (requestPayloadItem.addressDetails) {
        accumulator.addressDetails ??= [];
        accumulator.addressDetails.push(...requestPayloadItem.addressDetails);
      }

      return accumulator;
    },
    {
      namespace: 'avax',
      references: [],
      extendedPublicKeyDetails: [],
      addressDetails: [],
      filterOutDustUtxos,
    },
  );

  avalancheXPRequestItems.references = Array.from(
    new Set(avalancheXPRequestItems.references),
  );
  avalancheXPRequestItems.addressDetails = uniqBy(
    avalancheXPRequestItems.addressDetails,
    'id',
  );
  avalancheXPRequestItems.extendedPublicKeyDetails = uniqBy(
    avalancheXPRequestItems.extendedPublicKeyDetails,
    'id',
  );

  if (avalancheXPRequestItems.addressDetails.length === 0) {
    delete avalancheXPRequestItems.addressDetails;
  }

  if (avalancheXPRequestItems.extendedPublicKeyDetails.length === 0) {
    delete avalancheXPRequestItems.extendedPublicKeyDetails;
  }

  return avalancheXPRequestItems;
}
