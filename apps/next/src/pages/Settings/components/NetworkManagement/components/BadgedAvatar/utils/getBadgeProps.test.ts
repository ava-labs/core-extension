import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { Network } from '@core/types';
import { getBadgeProps } from './getBadgeProps';

// Mock webextension-polyfill first (before other imports)
jest.mock('webextension-polyfill', () => ({
  i18n: {
    getMessage: jest.fn((key: string) => {
      const messages: Record<string, string> = {
        'Avalanche P-Chain': 'Avalanche P-Chain',
        'Avalanche X-Chain': 'Avalanche X-Chain',
      };
      return messages[key] || key;
    }),
  },
  runtime: {
    getManifest: jest.fn(() => ({ version: '1.0.0' })),
  },
}));

// Mock the assets
jest.mock('../assets/pChainLight.svg', () => 'pChainLight.svg');
jest.mock('../assets/pChainDark.svg', () => 'pChainDark.svg');
jest.mock('../assets/xChainLight.svg', () => 'xChainLight.svg');
jest.mock('../assets/xChainDark.svg', () => 'xChainDark.svg');

// Mock the common utilities
jest.mock('@core/common', () => ({
  isPchainNetwork: jest.fn((network) => network?.vmName === 'PVM'),
  isXchainNetwork: jest.fn((network) => network?.vmName === 'AVM'),
}));

describe('getBadgeProps', () => {
  const mockLightTheme = {
    palette: { mode: 'light' as const },
  } as any;

  const mockDarkTheme = {
    palette: { mode: 'dark' as const },
  } as any;

  const baseNetwork: Network = {
    chainName: 'Test Network',
    chainId: 12345,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'https://rpc.test.com',
    explorerUrl: 'https://explorer.test.com',
    networkToken: {
      name: 'Test Token',
      symbol: 'TEST',
      description: 'Test token description',
      decimals: 18,
      logoUri: 'https://test.com/logo.png',
    },
    logoUri: 'https://test.com/network-logo.png',
  };

  const pChainNetwork: Network = {
    ...baseNetwork,
    vmName: NetworkVMType.PVM,
    chainName: 'Avalanche P-Chain',
  };

  const xChainNetwork: Network = {
    ...baseNetwork,
    vmName: NetworkVMType.AVM,
    chainName: 'Avalanche X-Chain',
  };

  describe('when no network is provided', () => {
    it('should return original badge props in light mode', () => {
      const originalBadge = { alt: 'test badge', className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        theme: mockLightTheme,
      });

      expect(result).toEqual(originalBadge);
    });

    it('should return original badge props in dark mode', () => {
      const originalBadge = { alt: 'test badge', className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        theme: mockDarkTheme,
      });

      expect(result).toEqual(originalBadge);
    });

    it('should return empty object when no badge props provided', () => {
      const result = getBadgeProps({
        theme: mockLightTheme,
      });

      expect(result).toEqual({});
    });
  });

  describe('when P-chain network is provided', () => {
    it('should return P-chain light mode badge props', () => {
      const originalBadge = { className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: pChainNetwork },
        theme: mockLightTheme,
      });

      expect(result).toEqual({
        className: 'test-class',
        src: 'pChainLight.svg',
        alt: 'Avalanche P-Chain',
      });
    });

    it('should return P-chain dark mode badge props', () => {
      const originalBadge = { className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: pChainNetwork },
        theme: mockDarkTheme,
      });

      expect(result).toEqual({
        className: 'test-class',
        src: 'pChainDark.svg',
        alt: 'Avalanche P-Chain',
      });
    });

    it('should override existing alt property for P-chain', () => {
      const originalBadge = { alt: 'original alt', className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: pChainNetwork },
        theme: mockLightTheme,
      });

      expect(result).toEqual({
        alt: 'Avalanche P-Chain',
        className: 'test-class',
        src: 'pChainLight.svg',
      });
    });
  });

  describe('when X-chain network is provided', () => {
    it('should return X-chain light mode badge props', () => {
      const originalBadge = { className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: xChainNetwork },
        theme: mockLightTheme,
      });

      expect(result).toEqual({
        className: 'test-class',
        src: 'xChainLight.svg',
        alt: 'Avalanche X-Chain',
      });
    });

    it('should return X-chain dark mode badge props', () => {
      const originalBadge = { className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: xChainNetwork },
        theme: mockDarkTheme,
      });

      expect(result).toEqual({
        className: 'test-class',
        src: 'xChainDark.svg',
        alt: 'Avalanche X-Chain',
      });
    });

    it('should override existing src property for X-chain', () => {
      const originalBadge = {
        src: 'original-image.png',
        alt: 'original alt',
        className: 'test-class',
      };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: xChainNetwork },
        theme: mockLightTheme,
      });

      expect(result).toEqual({
        src: 'xChainLight.svg',
        alt: 'Avalanche X-Chain',
        className: 'test-class',
      });
    });
  });

  describe('when regular EVM network is provided', () => {
    it('should return original badge props for EVM network', () => {
      const originalBadge = { alt: 'test badge', className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: baseNetwork },
        theme: mockLightTheme,
      });

      expect(result).toEqual(originalBadge);
    });

    it('should return original badge props for EVM network in dark mode', () => {
      const originalBadge = { alt: 'test badge', className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: baseNetwork },
        theme: mockDarkTheme,
      });

      expect(result).toEqual(originalBadge);
    });
  });

  describe('when other VM types are provided', () => {
    it('should return original badge props for CoreEth network', () => {
      const coreEthNetwork: Network = {
        ...baseNetwork,
        vmName: NetworkVMType.CoreEth,
      };
      const originalBadge = { alt: 'test badge', className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: coreEthNetwork },
        theme: mockLightTheme,
      });

      expect(result).toEqual(originalBadge);
    });

    it('should return original badge props for SVM network', () => {
      const svmNetwork: Network = {
        ...baseNetwork,
        vmName: NetworkVMType.SVM,
      };
      const originalBadge = { alt: 'test badge', className: 'test-class' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: svmNetwork },
        theme: mockLightTheme,
      });

      expect(result).toEqual(originalBadge);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined override object', () => {
      const originalBadge = { alt: 'test badge' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: undefined,
        theme: mockLightTheme,
      });

      expect(result).toEqual(originalBadge);
    });

    it('should handle empty override object', () => {
      const originalBadge = { alt: 'test badge' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: {},
        theme: mockLightTheme,
      });

      expect(result).toEqual(originalBadge);
    });

    it('should handle override with undefined network', () => {
      const originalBadge = { alt: 'test badge' };
      const result = getBadgeProps({
        badge: originalBadge,
        override: { network: undefined },
        theme: mockLightTheme,
      });

      expect(result).toEqual(originalBadge);
    });

    it('should preserve all original badge properties for non-Avalanche chains', () => {
      const complexBadge = {
        alt: 'complex badge',
        className: 'badge-class',
        src: 'original.png',
        style: { border: '1px solid red' },
        'data-testid': 'badge-test',
      };
      const result = getBadgeProps({
        badge: complexBadge,
        override: { network: baseNetwork },
        theme: mockLightTheme,
      });

      expect(result).toEqual(complexBadge);
    });
  });
});
