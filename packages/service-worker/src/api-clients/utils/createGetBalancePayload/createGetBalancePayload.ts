import { chainIdToCaip } from '@core/common';
import { Account } from '@core/types';
import { Currency, GetBalancesRequestBody } from '~/api-clients/balance-api';
import { GetBalanceRequestItem } from '~/api-clients/types';
import { AddressResolver } from '~/services/secrets/AddressResolver';
import { SecretsService } from '~/services/secrets/SecretsService';
import { getAvalancheXPRequestItems } from './lib/getAvalancheXPRequestItems';
import { getCoreEthRequestItems } from './lib/getCoreEthRequestItems';
import { getNonAvalancheXPRequestItems } from './lib/getNonAvalancheXPRequestItems';
import { splitIntoMultipleRequests } from './lib/split';

interface CreateGetBalancePayloadParams {
  accounts: Account[];
  chainIds: number[];
  currency?: Currency;
  secretsService: SecretsService;
  addressResolver: AddressResolver;
}

export const createGetBalancePayload = async ({
  accounts,
  chainIds,
  currency = 'usd',
  secretsService,
  addressResolver,
}: CreateGetBalancePayloadParams): Promise<GetBalancesRequestBody[]> => {
  // TODO: coreth caip2 ID from extension
  const caip2Ids = chainIds.map(chainIdToCaip);

  const avalancheXpGetBalancesRequestItem = await getAvalancheXPRequestItems(
    accounts,
    caip2Ids,
    secretsService,
    addressResolver,
  );

  const nonAvalancheXPGetBalancePayload = getNonAvalancheXPRequestItems(
    accounts,
    caip2Ids,
  );

  const coreEthGetBalancePayload = getCoreEthRequestItems(accounts);

  const payload: GetBalanceRequestItem[] = [
    ...coreEthGetBalancePayload,
    ...nonAvalancheXPGetBalancePayload,
  ];

  if (avalancheXpGetBalancesRequestItem.references.length > 0) {
    payload.unshift(avalancheXpGetBalancesRequestItem);
  }

  return splitIntoMultipleRequests({
    data: payload,
    currency,
    showUntrustedTokens: true,
  });
};
