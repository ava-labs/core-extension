import { GlacierService } from './GlacierService';

import { AppCheckService } from '../appcheck/AppCheckService';
import { Glacier } from '@avalabs/glacier-sdk';

jest.mock('@avalabs/glacier-sdk');
jest.mock('@avalabs/core-utils-sdk', () => ({
  ...jest.requireActual('@avalabs/core-utils-sdk'),
  wait: jest.fn(),
}));
const getAppcheckToken = jest.fn();
const appCheckService = { getAppcheckToken } as unknown as AppCheckService;
const listAddressChainsMock = jest.fn();
describe('src/background/services/glacier/GlacierService.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    getAppcheckToken.mockResolvedValue({ token: 'appcheckToken' });

    (Glacier as jest.Mock).mockReturnValue({
      evmChains: {
        listAddressChains: listAddressChainsMock,
      },
    });
  });

  describe('getEvmChainsForAddress', () => {
    it('uses correct endpoint', async () => {
      const glacierService = new GlacierService(appCheckService);
      await glacierService.getEvmChainsForAddress('address');

      expect(getAppcheckToken).toHaveBeenCalled();
      expect(listAddressChainsMock).toHaveBeenCalledWith({
        address: 'address',
      });
    });
  });
});
