import { chunk } from 'lodash';
import { GetBalancesRequestBody } from '~/api-clients/balance-api';
import { GetBalanceRequestItem } from '~/api-clients/types';

export const splitIntoMultipleRequests = (
  request: GetBalancesRequestBody,
): GetBalancesRequestBody[] => {
  const splittedRequest: GetBalancesRequestBody = {
    ...request,
    data: splitByReferences(splitByAddresses(request.data)),
  };

  return chunk(splittedRequest.data, 5).map((dataChunk) => ({
    ...splittedRequest,
    data: dataChunk,
  }));
};

const splitByReferences = (
  items: GetBalanceRequestItem[],
): GetBalanceRequestItem[] => {
  return items.flatMap(({ references, ...rest }) => {
    return chunk(references, 20).flatMap(
      (referencesChunk) =>
        ({
          ...rest,
          references: referencesChunk,
        }) as GetBalanceRequestItem,
    );
  });
};

const splitByAddresses = (
  items: GetBalanceRequestItem[],
): GetBalanceRequestItem[] => {
  const CHUNK_SIZE = 50;
  return items.flatMap((item) => {
    if ('addresses' in item) {
      return chunk(item.addresses, CHUNK_SIZE).flatMap(
        (addressesChunk) =>
          ({
            ...item,
            addresses: addressesChunk,
          }) as GetBalanceRequestItem,
      );
    } else if ('extendedPublicKeyDetails' in item) {
      return chunk(
        item.extendedPublicKeyDetails,
        50,
      ).flatMap<GetBalanceRequestItem>((extendedPublicKeyDetailsChunk) => ({
        ...item,
        extendedPublicKeyDetails: extendedPublicKeyDetailsChunk,
      }));
    } else if ('addressDetails' in item) {
      return chunk(item.addressDetails, 50).flatMap<GetBalanceRequestItem>(
        (addressDetailsChunk) => ({
          ...item,
          addressDetails: addressDetailsChunk,
        }),
      );
    }

    return item;
  });
};
