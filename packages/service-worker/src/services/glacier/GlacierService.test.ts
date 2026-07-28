import { getAuthHeaders } from '../appcheck/utils/getAuthHeaders';
import { GlacierService } from './GlacierService';

import { Glacier } from '@avalabs/glacier-sdk';

jest.mock('@avalabs/glacier-sdk');
jest.mock('../appcheck/utils/getAuthHeaders');
jest.mock('@avalabs/core-utils-sdk', () => ({
  ...jest.requireActual('@avalabs/core-utils-sdk'),
  wait: jest.fn(),
}));
const listAddressChainsMock = jest.fn();
describe('src/background/services/glacier/GlacierService.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(getAuthHeaders).mockResolvedValue({ token: 'appcheckToken' });

    (Glacier as jest.Mock).mockReturnValue({
      evmChains: {
        listAddressChains: listAddressChainsMock,
      },
    });
  });

  describe('getEvmChainsForAddress', () => {
    it('uses correct endpoint', async () => {
      const glacierService = new GlacierService();
      await glacierService.getEvmChainsForAddress('address');

      expect(jest.mocked(getAuthHeaders)).toHaveBeenCalled();
      expect(listAddressChainsMock).toHaveBeenCalledWith({
        address: 'address',
      });
    });
  });
});
