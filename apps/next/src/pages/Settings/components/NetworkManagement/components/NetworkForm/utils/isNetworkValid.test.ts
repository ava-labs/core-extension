import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { i18n } from 'webextension-polyfill';
import { isNetworkValid } from './isNetworkValid';

// Mock webextension-polyfill i18n
jest.mock('webextension-polyfill', () => ({
  i18n: {
    getMessage: jest.fn(),
  },
}));

const mockGetMessage = i18n.getMessage as jest.MockedFunction<
  typeof i18n.getMessage
>;

describe('isNetworkValid', () => {
  beforeEach(() => {
    mockGetMessage.mockClear();
    // Set up default mock return values
    mockGetMessage.mockImplementation((key: string) => key);
  });

  const createValidNetwork = (): Network => ({
    chainId: 1,
    chainName: 'Ethereum',
    vmName: NetworkVMType.EVM,
    rpcUrl: 'https://mainnet.infura.io/v3/your-project-id',
    explorerUrl: 'https://etherscan.io',
    networkToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      description: 'Ethereum native token',
      decimals: 18,
      logoUri: 'https://example.com/eth-logo.png',
    },
    logoUri: 'https://example.com/ethereum-logo.png',
    primaryColor: '#627EEA',
    isTestnet: false,
  });

  describe('valid networks', () => {
    it('should return valid for a complete network', () => {
      const network = createValidNetwork();

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: true,
        errors: {},
      });
    });

    it('should return valid for a network with minimal required fields', () => {
      const network: Network = {
        chainId: 1,
        chainName: 'Test Network',
        vmName: NetworkVMType.EVM,
        rpcUrl: 'https://rpc.test.com',
        explorerUrl: 'https://explorer.test.com',
        networkToken: {
          name: 'Test Token',
          symbol: 'TEST',
          description: '',
          decimals: 18,
          logoUri: '',
        },
        logoUri: '',
        primaryColor: '',
        isTestnet: true,
      };

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: true,
        errors: {},
      });
    });
  });

  describe('missing rpcUrl', () => {
    it('should return invalid when rpcUrl is missing', () => {
      const network = createValidNetwork();
      delete (network as any).rpcUrl;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'RPC URL is required',
      });
      expect(mockGetMessage).toHaveBeenCalledWith('RPC URL is required');
    });

    it('should return invalid when rpcUrl is empty string', () => {
      const network = createValidNetwork();
      network.rpcUrl = '';

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'RPC URL is required',
      });
    });

    it('should return invalid when rpcUrl is null', () => {
      const network = createValidNetwork();
      (network as any).rpcUrl = null;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'RPC URL is required',
      });
    });
  });

  describe('missing chainName', () => {
    it('should return invalid when chainName is missing', () => {
      const network = createValidNetwork();
      delete (network as any).chainName;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Chain name is required',
      });
      expect(mockGetMessage).toHaveBeenCalledWith('Chain name is required');
    });

    it('should return invalid when chainName is empty string', () => {
      const network = createValidNetwork();
      network.chainName = '';

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Chain name is required',
      });
    });

    it('should return invalid when chainName is null', () => {
      const network = createValidNetwork();
      (network as any).chainName = null;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Chain name is required',
      });
    });
  });

  describe('missing chainId', () => {
    it('should return invalid when chainId is missing', () => {
      const network = createValidNetwork();
      delete (network as any).chainId;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Chain ID is required',
      });
      expect(mockGetMessage).toHaveBeenCalledWith('Chain ID is required');
    });

    it('should return invalid when chainId is 0', () => {
      const network = createValidNetwork();
      network.chainId = 0;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Chain ID is required',
      });
    });

    it('should return invalid when chainId is null', () => {
      const network = createValidNetwork();
      (network as any).chainId = null;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Chain ID is required',
      });
    });
  });

  describe('missing networkToken.symbol', () => {
    it('should return invalid when networkToken.symbol is missing', () => {
      const network = createValidNetwork();
      (network.networkToken as any).symbol = undefined;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Token symbol is required',
      });
      expect(mockGetMessage).toHaveBeenCalledWith('Token symbol is required');
    });

    it('should return invalid when networkToken.symbol is empty string', () => {
      const network = createValidNetwork();
      network.networkToken.symbol = '';

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Token symbol is required',
      });
    });

    it('should return invalid when networkToken.symbol is null', () => {
      const network = createValidNetwork();
      (network.networkToken as any).symbol = null;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Token symbol is required',
      });
    });
  });

  describe('missing networkToken.name', () => {
    it('should return invalid when networkToken.name is missing', () => {
      const network = createValidNetwork();
      (network.networkToken as any).name = undefined;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Token name is required',
      });
      expect(mockGetMessage).toHaveBeenCalledWith('Token name is required');
    });

    it('should return invalid when networkToken.name is empty string', () => {
      const network = createValidNetwork();
      network.networkToken.name = '';

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Token name is required',
      });
    });

    it('should return invalid when networkToken.name is null', () => {
      const network = createValidNetwork();
      (network.networkToken as any).name = null;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Token name is required',
      });
    });
  });

  describe('missing networkToken object', () => {
    it('should throw error when networkToken is missing entirely', () => {
      const network = createValidNetwork();
      delete (network as any).networkToken;

      expect(() => isNetworkValid(network)).toThrow(
        "Cannot read properties of undefined (reading 'symbol')",
      );
    });

    it('should throw error when networkToken is null', () => {
      const network = createValidNetwork();
      (network as any).networkToken = null;

      expect(() => isNetworkValid(network)).toThrow(
        "Cannot read properties of null (reading 'symbol')",
      );
    });
  });

  describe('validation order', () => {
    it('should return rpcUrl error first when multiple fields are missing', () => {
      const network = createValidNetwork();
      delete (network as any).rpcUrl;
      delete (network as any).chainName;
      delete (network as any).chainId;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'RPC URL is required',
      });
    });

    it('should return chainName error when rpcUrl is present but chainName is missing', () => {
      const network = createValidNetwork();
      delete (network as any).chainName;
      delete (network as any).chainId;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Chain name is required',
      });
    });

    it('should return chainId error when rpcUrl and chainName are present but chainId is missing', () => {
      const network = createValidNetwork();
      delete (network as any).chainId;

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: false,
        reason: 'Chain ID is required',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace-only strings as valid (current behavior)', () => {
      const network = createValidNetwork();
      network.rpcUrl = '   ';

      const result = isNetworkValid(network);

      expect(result).toEqual({
        valid: true,
        errors: {},
      });
    });

    it('should validate different chainId types', () => {
      const network1 = createValidNetwork();
      network1.chainId = 1;
      expect(isNetworkValid(network1).valid).toBe(true);

      const network2 = createValidNetwork();
      network2.chainId = 43114; // Avalanche C-Chain
      expect(isNetworkValid(network2).valid).toBe(true);
    });
  });
});
