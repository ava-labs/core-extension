import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { isNetworkValid } from './isNetworkValid';

// Mock i18next
jest.mock('i18next', () => ({
  t: (key: string) => key, // Return the key as the translation for testing
}));

describe('isNetworkValid', () => {
  const createValidNetwork = (): Network => ({
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.public.blastapi.io',
    networkToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoUri: 'https://example.com/eth-logo.png',
      description: 'Ethereum',
    },
    explorerUrl: 'https://etherscan.io',
    logoUri: 'https://example.com/eth-logo.png',
    vmName: NetworkVMType.EVM,
  });

  describe('Valid networks', () => {
    it('should return valid for a complete valid network', () => {
      const network = createValidNetwork();
      const result = isNetworkValid(network);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({
        rpcUrl: undefined,
        chainName: undefined,
        chainId: undefined,
        tokenSymbol: undefined,
        tokenName: undefined,
        explorerUrl: undefined,
        logoUrl: undefined,
        rpcHeaders: undefined,
      });
    });

    it('should return valid with minimal required fields', () => {
      const network: Network = {
        chainId: 42,
        chainName: 'Test Network',
        rpcUrl: 'http://localhost:8545',
        networkToken: {
          symbol: 'TEST',
          name: 'Test Token',
          decimals: 18,
          logoUri: '',
          description: '',
        },
        explorerUrl: '',
        logoUri: '',
        vmName: NetworkVMType.EVM,
      };

      const result = isNetworkValid(network);
      expect(result.isValid).toBe(true);
    });

    it('should accept different valid RPC URL protocols', () => {
      const protocols = [
        'https://example.com',
        'http://localhost:8545',
        'ipfs://example',
      ];

      protocols.forEach((rpcUrl) => {
        const network = { ...createValidNetwork(), rpcUrl };
        const result = isNetworkValid(network);
        expect(result.isValid).toBe(true);
        expect(result.errors.rpcUrl).toBeUndefined();
      });
    });
  });

  describe('Invalid RPC URLs', () => {
    it('should return error for empty RPC URL', () => {
      const network = { ...createValidNetwork(), rpcUrl: '' };
      const result = isNetworkValid(network);

      expect(result.isValid).toBe(false);
      expect(result.errors.rpcUrl).toBe('RPC URL is required');
    });

    it('should return error for invalid RPC URL protocol', () => {
      const invalidUrls = [
        'ftp://example.com',
        'ws://example.com',
        'invalid-url',
        'just-text',
        'mailto:test@example.com',
      ];

      invalidUrls.forEach((rpcUrl) => {
        const network = { ...createValidNetwork(), rpcUrl };
        const result = isNetworkValid(network);
        expect(result.isValid).toBe(false);
        expect(result.errors.rpcUrl).toBe('RPC URL must start with http');
      });
    });

    it('should return error for malformed URLs', () => {
      const malformedUrls = ['http://', 'https://', 'not-a-url-at-all'];

      malformedUrls.forEach((rpcUrl) => {
        const network = { ...createValidNetwork(), rpcUrl };
        const result = isNetworkValid(network);
        expect(result.isValid).toBe(false);
        expect(result.errors.rpcUrl).toBe('RPC URL must start with http');
      });
    });
  });

  describe('Invalid chain names', () => {
    it('should return error for empty chain name', () => {
      const network = { ...createValidNetwork(), chainName: '' };
      const result = isNetworkValid(network);

      expect(result.isValid).toBe(false);
      expect(result.errors.chainName).toBe('Chain name is required');
    });
  });

  describe('Invalid chain IDs', () => {
    it('should return error for zero chain ID', () => {
      const network = { ...createValidNetwork(), chainId: 0 };
      const result = isNetworkValid(network);

      expect(result.isValid).toBe(false);
      expect(result.errors.chainId).toBe('Chain ID is required');
    });

    it('should accept positive chain IDs', () => {
      const validChainIds = [1, 42, 137, 43114, 250];

      validChainIds.forEach((chainId) => {
        const network = { ...createValidNetwork(), chainId };
        const result = isNetworkValid(network);
        expect(result.isValid).toBe(true);
        expect(result.errors.chainId).toBeUndefined();
      });
    });
  });

  describe('Invalid token symbols', () => {
    it('should return error for empty token symbol', () => {
      const network = {
        ...createValidNetwork(),
        networkToken: {
          ...createValidNetwork().networkToken,
          symbol: '',
        },
      };
      const result = isNetworkValid(network);

      expect(result.isValid).toBe(false);
      expect(result.errors.tokenSymbol).toBe('Token symbol is required');
    });
  });

  describe('Invalid token names', () => {
    it('should return error for empty token name', () => {
      const network = {
        ...createValidNetwork(),
        networkToken: {
          ...createValidNetwork().networkToken,
          name: '',
        },
      };
      const result = isNetworkValid(network);

      expect(result.isValid).toBe(false);
      expect(result.errors.tokenName).toBe('Token name is required');
    });
  });

  describe('Multiple validation errors', () => {
    it('should return all validation errors when multiple fields are invalid', () => {
      const network: Network = {
        chainId: 0,
        chainName: '',
        rpcUrl: '',
        networkToken: {
          symbol: '',
          name: '',
          decimals: 18,
          logoUri: '',
          description: '',
        },
        explorerUrl: '',
        logoUri: '',
        vmName: NetworkVMType.EVM,
      };

      const result = isNetworkValid(network);

      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual({
        rpcUrl: 'RPC URL is required',
        chainName: 'Chain name is required',
        chainId: 'Chain ID is required',
        tokenSymbol: 'Token symbol is required',
        tokenName: 'Token name is required',
        explorerUrl: undefined,
        logoUrl: undefined,
        rpcHeaders: undefined,
      });
    });

    it('should return false when at least one field is invalid', () => {
      const network = {
        ...createValidNetwork(),
        rpcUrl: '', // Only RPC URL is invalid
      };

      const result = isNetworkValid(network);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Optional fields', () => {
    it('should not validate optional fields (explorerUrl, logoUrl, rpcHeaders)', () => {
      const network = {
        ...createValidNetwork(),
        explorerUrl: '', // Optional field
        logoUri: '', // Optional field
        customRpcHeaders: {}, // Optional field
      };

      const result = isNetworkValid(network);

      expect(result.isValid).toBe(true);
      expect(result.errors.explorerUrl).toBeUndefined();
      expect(result.errors.logoUrl).toBeUndefined();
      expect(result.errors.rpcHeaders).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle very long valid values', () => {
      const longButValidNetwork = {
        ...createValidNetwork(),
        chainName: 'A'.repeat(1000),
        networkToken: {
          ...createValidNetwork().networkToken,
          symbol: 'B'.repeat(100),
          name: 'C'.repeat(1000),
        },
      };

      const result = isNetworkValid(longButValidNetwork);
      expect(result.isValid).toBe(true);
    });
  });
});
