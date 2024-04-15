import { NetworkVMType } from '@avalabs/chains-sdk';
import { NetworkFeeService } from './NetworkFeeService';

describe('src/background/services/networkFee/NetworkFeeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('for EVM chains', () => {
    const provider = {
      getFeeData: jest.fn(),
    };
    const networkService = {
      activeNetwork: { vmName: NetworkVMType.EVM },
      getProviderForNetwork: jest.fn(),
    } as any;

    beforeEach(() => {
      networkService.getProviderForNetwork.mockReturnValue(provider);
    });

    it('provides base information and three rate presets', async () => {
      const maxFeePerGas = BigInt(30e9); // 30 gwei

      provider.getFeeData.mockResolvedValueOnce({ maxFeePerGas });

      const service = new NetworkFeeService(networkService as any);

      expect(await service.getNetworkFee()).toEqual({
        displayDecimals: 9, // use Gwei to display amount
        baseMaxFee: maxFeePerGas,
        low: {
          maxFee: maxFeePerGas + BigInt(5e8),
          maxTip: BigInt(5e8),
        },
        medium: {
          maxFee: maxFeePerGas + BigInt(2e9),
          maxTip: BigInt(2e9),
        },
        high: {
          maxFee: maxFeePerGas + BigInt(3e9),
          maxTip: BigInt(3e9),
        },
        isFixedFee: false,
      });
    });
  });
});