import { Contact } from '@avalabs/types';
import { Account, NetworkWithCaipId } from '@core/types';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { getAddressForNetwork } from './getAddressForNetwork';
import {
  getAddressForChain,
  getContactAddressForChain,
  stripAddressPrefix,
} from '@core/common';

// Mock the dependencies
jest.mock('@core/common', () => ({
  getAddressForChain: jest.fn(),
  getContactAddressForChain: jest.fn(),
  stripAddressPrefix: jest.fn((address) => address),
}));

// Import mocked functions with proper typing

const mockGetAddressForChain = getAddressForChain as jest.MockedFunction<
  typeof getAddressForChain
>;
const mockGetContactAddressForChain =
  getContactAddressForChain as jest.MockedFunction<
    typeof getContactAddressForChain
  >;
const mockStripAddressPrefix = stripAddressPrefix as jest.MockedFunction<
  typeof stripAddressPrefix
>;

describe('getAddressForNetwork', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockNetwork: NetworkWithCaipId = {
    chainId: 43114,
    caipId: 'eip155:43114',
    chainName: 'Avalanche C-Chain',
    vmName: NetworkVMType.EVM,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    logoUri: '',
    primaryColor: '',
    explorerUrl: 'https://snowtrace.io',
    isTestnet: false,
    networkToken: {
      name: 'Avalanche',
      symbol: 'AVAX',
      description: 'Avalanche',
      decimals: 18,
      logoUri: '',
    },
  };

  const mockAccount: Account = {
    id: 'account-1',
    name: 'Test Account',
    addressC: '0x1234567890123456789012345678901234567890',
    addressPVM: 'P-avax1234567890123456789012345678901234567890',
    addressBTC: 'bc1q1234567890123456789012345678901234567890',
    addressSVM: '11111111111111111111111111111111',
    type: 'primary' as any,
    index: 0,
  };

  const mockContact: Contact = {
    id: 'contact-1',
    name: 'Test Contact',
    address: '0x9876543210987654321098765432109876543210',
    addressBTC: 'bc1q9876543210987654321098765432109876543210',
    addressXP: 'avax9876543210987654321098765432109876543210',
    addressSVM: '22222222222222222222222222222222',
    isKnown: true,
  };

  describe('when account is undefined', () => {
    it('should return undefined', () => {
      const result = getAddressForNetwork(mockNetwork, undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('when account is null', () => {
    it('should return undefined', () => {
      const result = getAddressForNetwork(mockNetwork, null as any);
      expect(result).toBeUndefined();
    });
  });

  describe('when account is an Account type', () => {
    it('should call getAddressForChain and stripAddressPrefix', () => {
      const mockAddress = 'P-avax1234567890123456789012345678901234567890';
      mockGetAddressForChain.mockReturnValue(mockAddress);
      mockStripAddressPrefix.mockReturnValue(
        'avax1234567890123456789012345678901234567890',
      );

      const result = getAddressForNetwork(mockNetwork, mockAccount);

      expect(getAddressForChain).toHaveBeenCalledWith(mockNetwork, mockAccount);
      expect(stripAddressPrefix).toHaveBeenCalledWith(mockAddress);
      expect(result).toBe('avax1234567890123456789012345678901234567890');
    });

    it('should handle when getAddressForChain returns empty string', () => {
      mockGetAddressForChain.mockReturnValue('');
      mockStripAddressPrefix.mockReturnValue('');

      const result = getAddressForNetwork(mockNetwork, mockAccount);

      expect(getAddressForChain).toHaveBeenCalledWith(mockNetwork, mockAccount);
      expect(stripAddressPrefix).toHaveBeenCalledWith('');
      expect(result).toBe('');
    });
  });

  describe('when account is a Contact type', () => {
    it('should call getContactAddressForChain', () => {
      const mockContactAddress = '0x9876543210987654321098765432109876543210';
      mockGetContactAddressForChain.mockReturnValue(mockContactAddress);

      const result = getAddressForNetwork(mockNetwork, mockContact);

      expect(getContactAddressForChain).toHaveBeenCalledWith(
        mockNetwork,
        mockContact,
      );
      expect(getAddressForChain).not.toHaveBeenCalled();
      expect(stripAddressPrefix).not.toHaveBeenCalled();
      expect(result).toBe(mockContactAddress);
    });

    it('should handle when getContactAddressForChain returns empty string', () => {
      mockGetContactAddressForChain.mockReturnValue('');

      const result = getAddressForNetwork(mockNetwork, mockContact);

      expect(getContactAddressForChain).toHaveBeenCalledWith(
        mockNetwork,
        mockContact,
      );
      expect(result).toBe('');
    });
  });
});
