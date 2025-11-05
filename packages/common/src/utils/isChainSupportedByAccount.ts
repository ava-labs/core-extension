import { Account, NetworkWithCaipId } from '@core/types';
import { getAddressForChain } from './getAddressForChain';

export const isChainSupportedByAccount = (
  network?: NetworkWithCaipId,
  account?: Account,
) => {
  const addressForNetwork = getAddressForChain(network, account);
  return Boolean(addressForNetwork);
};
