import { stripAddressPrefix } from '@core/common/src/utils/stripAddressPrefix';
import {
  AvalancheCorethGetBalancesRequestItem,
  BtcGetBalancesRequestItem,
  SvmGetBalancesRequestItem,
} from '~/api-clients/balance-api';
import { GetBalanceRequestItem, NameSpace } from '~/api-clients/types';

interface ChainPayloadParams {
  nameSpace: NameSpace;
  address: string;
  reference: string;
  /**
   * @description Only supported on avax namespace.
   */
  filterOutDustUtxos?: boolean;
}

export const getChainSpecificPayload = ({
  nameSpace,
  address,
  reference,
  filterOutDustUtxos = false,
}: ChainPayloadParams): GetBalanceRequestItem => {
  switch (nameSpace) {
    case 'avax':
      return {
        namespace: nameSpace,
        references: [reference],
        filterOutDustUtxos,
        addressDetails: [
          {
            addresses: [stripAddressPrefix(address)],
            id: stripAddressPrefix(address),
          },
        ],
      } as AvalancheCorethGetBalancesRequestItem;
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
