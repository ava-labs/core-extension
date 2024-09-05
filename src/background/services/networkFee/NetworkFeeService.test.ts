import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkFeeService } from './NetworkFeeService';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { NetworkWithCaipId } from '../network/models';
import { serializeToJSON } from '@src/background/serialization/serialize';

jest.mock('@src/utils/network/getProviderForNetwork');
jest.mock('@src/background/vmModules/ModuleManager');

describe('src/background/services/networkFee/NetworkFeeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('for EVM chains', () => {
    const provider = {
      getFeeData: jest.fn(),
    };
    const evm = {
      vmName: NetworkVMType.EVM,
      caipId: 'eip155:1',
    } as NetworkWithCaipId;
    const btc = {
      vmName: NetworkVMType.BITCOIN,
      caipId: 'bip122:whatever',
    } as NetworkWithCaipId;

    beforeEach(() => {
      jest.mocked(getProviderForNetwork).mockReturnValue(provider as any);
    });

    it('uses BitcoinModule for BTC fees', async () => {
      const getNetworkFee = jest.fn().mockResolvedValue({
        isFixedFee: false,
        low: { maxFeePerGas: 3n },
        medium: { maxFeePerGas: 4n },
        high: { maxFeePerGas: 5n },
      });

      const moduleManager = {
        loadModuleByNetwork: jest
          .fn()
          .mockResolvedValue({ getNetworkFee } as any),
      } as any;

      const service = new NetworkFeeService(moduleManager);

      const result = await service.getNetworkFee(btc);

      expect(moduleManager.loadModuleByNetwork).toHaveBeenCalledWith(btc);
      expect(getNetworkFee).toHaveBeenCalledWith(btc);

      // Jest has issues with objects containing BigInts, so we make it easier by using our own serializer
      expect(serializeToJSON(result)).toEqual(
        serializeToJSON({
          isFixedFee: false,
          low: { maxFee: 3n },
          medium: { maxFee: 4n },
          high: { maxFee: 5n },
          displayDecimals: 0,
        })
      );
    });

    it('provides base information and three rate presets', async () => {
      const maxFeePerGas = BigInt(30e9); // 30 gwei

      provider.getFeeData.mockResolvedValueOnce({ maxFeePerGas });

      const service = new NetworkFeeService({} as any);

      expect(await service.getNetworkFee(evm)).toEqual({
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
