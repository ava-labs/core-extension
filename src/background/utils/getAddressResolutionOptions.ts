import { NetworkService } from '../services/network/NetworkService';
import { AddressResolutionOptions } from '../models';

export const getAddressResolutionOptions = async (
  networkService: NetworkService
): Promise<AddressResolutionOptions> => ({
  isMainnet: networkService.isMainnet(),
  providerXP: await networkService.getAvalanceProviderXP(),
});
