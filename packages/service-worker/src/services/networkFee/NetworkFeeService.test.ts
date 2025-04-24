import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkFeeService } from './NetworkFeeService';
import { getProviderForNetwork } from '@core/utils';
import { NetworkWithCaipId } from '@core/types';
import { serializeToJSON } from '@core/messaging';

jest.mock('@core/utils');
jest.mock('@/vmModules/ModuleManager');

describe('src/background/services/networkFee/NetworkFeeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('for EVM chains', () => {
    const provider = {
      getFeeData: jest.fn(),
      getNetworkFee: jest.fn(),
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
          low: { maxFeePerGas: 3n },
          medium: { maxFeePerGas: 4n },
          high: { maxFeePerGas: 5n },
          displayDecimals: 0,
        }),
      );
    });

    it('provides base information and three rate presets', async () => {
      const networkFees = {
        isFixedFee: false,
        low: { maxFeePerGas: 3n },
        medium: { maxFeePerGas: 4n },
        high: { maxFeePerGas: 5n },
        displayDecimals: 9,
      };
      const getNetworkFee = jest.fn().mockResolvedValue(networkFees);

      const moduleManager = {
        loadModuleByNetwork: jest
          .fn()
          .mockResolvedValue({ getNetworkFee } as any),
      } as any;

      const service = new NetworkFeeService(moduleManager);

      const fees = await service.getNetworkFee(evm);

      expect(moduleManager.loadModuleByNetwork).toHaveBeenCalledWith(evm);

      expect(fees).toEqual(networkFees);
    });
  });
});
