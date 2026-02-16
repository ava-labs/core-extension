import { AutoPairingPostMessageConnection } from '@core/messaging';
import { createMultiWalletProxy } from './MultiWalletProviderProxy';
import { initializeProvider } from './initializeInpageProvider';
import { EVMProvider } from '@avalabs/evm-module/dist/provider';
import { SolanaWalletProvider } from '@avalabs/svm-module/dist/provider';

jest.mock('@avalabs/evm-module/dist/provider', () => ({
  EVMProvider: jest
    .fn()
    .mockImplementation(() => ({ isAvalanche: true, info: { name: 'name' } })),
}));
jest.mock('@avalabs/svm-module/dist/provider', () => ({
  SolanaWalletProvider: jest.fn().mockImplementation(() => ({})),
  initialize: jest.fn(),
}));
jest.mock('./MultiWalletProviderProxy', () => ({
  createMultiWalletProxy: jest.fn(),
}));

describe('src/background/providers/initializeInpageProvider', () => {
  const connectionMock = new AutoPairingPostMessageConnection(false);
  let windowMock: any;
  const mockMultiWalletProxy = { defaultProvider: {}, addProvider: jest.fn() };
  beforeEach(() => {
    windowMock = {
      addEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    } as any;
    (createMultiWalletProxy as jest.Mock).mockReturnValue(mockMultiWalletProxy);
  });

  it('initializes CoreProvider with the correct channel name', () => {
    const provider = initializeProvider(connectionMock, 10, windowMock);
    expect(EVMProvider).toHaveBeenCalledWith(
      expect.objectContaining({ maxListeners: 10 }),
    );
    expect(SolanaWalletProvider).toHaveBeenCalled();
    expect(provider.isAvalanche).toBe(true);
  });

  it('wraps the provider in a proxy to prevent deletions', () => {
    const provider = initializeProvider(connectionMock, 10, windowMock);

    expect(provider.isAvalanche).toBe(true);
    delete (provider as any).isAvalanche;
    expect(provider.isAvalanche).toBe(true);
  });

  describe('EIP-1193', () => {
    it('creates the window.ethereum object', () => {
      const provider = initializeProvider(connectionMock, 10, windowMock);

      expect(createMultiWalletProxy).toHaveBeenCalledTimes(1);
      expect(createMultiWalletProxy).toHaveBeenCalledWith(provider);

      expect(windowMock.ethereum).toBe(mockMultiWalletProxy);
    });

    it('dispatches ethereum#initialized event', () => {
      initializeProvider(connectionMock, 10, windowMock);

      expect(windowMock.ethereum).toBe(mockMultiWalletProxy);
      expect(windowMock.dispatchEvent).toHaveBeenCalledWith(
        new Event('ethereum#initialized'),
      );
    });

    it(`trys to simply set window.ethereum if fails to claim in case it's a proxy already`, () => {
      const setMock = jest.fn();
      const otherWalletMock = { isMetaMask: true };
      Object.defineProperty(windowMock, 'ethereum', {
        get: () => otherWalletMock,
        set: setMock,
      });

      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        //do nothing
      });
      const provider = initializeProvider(connectionMock, 10, windowMock);

      expect(windowMock.ethereum).toBe(otherWalletMock);
      expect(setMock).toHaveBeenCalledWith(provider);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    it(`catches error when setting window.ethereum on fallback`, () => {
      const otherWalletMock = { isMetaMask: true };
      Object.defineProperty(windowMock, 'ethereum', {
        get: () => otherWalletMock,
      });

      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        //do nothing
      });
      initializeProvider(connectionMock, 10, windowMock);

      expect(windowMock.ethereum).toBe(otherWalletMock);
      expect(errorSpy).toHaveBeenCalledTimes(2);
    });

    describe('legacy support: window.web3', () => {
      it('sets window.web3 object', () => {
        const provider = initializeProvider(connectionMock, 10, windowMock);

        expect(createMultiWalletProxy).toHaveBeenCalledTimes(1);
        expect(createMultiWalletProxy).toHaveBeenCalledWith(provider);

        expect(windowMock.web3).toStrictEqual({
          currentProvider: mockMultiWalletProxy,
        });
      });

      // some legacy libraries like to decorate window.web3 like crazy
      it('lets setting properties on window.web3 except the metamask shim', () => {
        initializeProvider(connectionMock, 10, windowMock);

        windowMock.web3.someData = { data: true };

        expect(windowMock.web3).toStrictEqual({
          currentProvider: mockMultiWalletProxy,
          someData: { data: true },
        });

        windowMock.web3 = { __isMetaMaskShim__: true };

        expect(windowMock.web3).toStrictEqual({
          currentProvider: mockMultiWalletProxy,
          someData: { data: true },
        });
      });
    });
  });

  describe('window.avalanche', () => {
    it('creates the window.avalanche object', () => {
      const provider = initializeProvider(connectionMock, 10, windowMock);

      expect(windowMock.avalanche).toBe(provider);
    });

    it('dispatches avalanche#initialized event', () => {
      const provider = initializeProvider(connectionMock, 10, windowMock);

      expect(windowMock.avalanche).toBe(provider);
      expect(windowMock.dispatchEvent).toHaveBeenCalledWith(
        new Event('avalanche#initialized'),
      );
    });

    it('makes window.avalanche non writable', () => {
      initializeProvider(connectionMock, 10, windowMock);
      try {
        windowMock.avalanche = { isMetaMask: true };
      } catch (e) {
        expect((e as Error).message).toBe(
          `Cannot assign to read only property 'avalanche' of object '#<Object>'`,
        );
      }
    });
  });

  describe('EIP-6963', () => {
    it('announces core provider with eip6963:announceProvider', () => {
      const provider = initializeProvider(connectionMock, 10, windowMock);

      expect(windowMock.dispatchEvent).toHaveBeenCalledTimes(4);
      expect(windowMock.dispatchEvent.mock.calls[2][0].type).toEqual(
        'eip6963:announceProvider',
      );
      expect(windowMock.dispatchEvent.mock.calls[2][0].detail).toStrictEqual(
        expect.objectContaining({
          info: provider.info,
          provider: provider,
        }),
      );
    });
    it('re-announces on eip6963:requestProvider', () => {
      initializeProvider(connectionMock, 10, windowMock);

      expect(windowMock.dispatchEvent).toHaveBeenCalledTimes(4);

      expect(windowMock.addEventListener).toHaveBeenCalledTimes(3);
      expect(windowMock.addEventListener).toHaveBeenCalledWith(
        'eip6963:requestProvider',
        expect.anything(),
      );

      windowMock.addEventListener.mock.calls[1][1]();

      expect(windowMock.dispatchEvent).toHaveBeenCalledTimes(5);

      expect(windowMock.dispatchEvent.mock.calls[2][0].type).toEqual(
        'eip6963:announceProvider',
      );
    });
  });
  describe('core-wallet ', () => {
    it('should announce chainagnostic provider with core-wallet:announceProvider', () => {
      initializeProvider(connectionMock, 10, windowMock);

      expect(windowMock.dispatchEvent.mock.calls[3][0].type).toEqual(
        'core-wallet:announceProvider',
      );
    });
  });
});
