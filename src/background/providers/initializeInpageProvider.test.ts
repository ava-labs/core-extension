import { CoreProvider } from './CoreProvider';
import { createMultiWalletProxy } from './MultiWalletProviderProxy';
import { initializeProvider } from './initializeInpageProvider';

jest.mock('./CoreProvider', () => ({
  CoreProvider: jest.fn().mockImplementation(() => ({ isAvalanche: true })),
}));
jest.mock('./MultiWalletProviderProxy', () => ({
  createMultiWalletProxy: jest.fn(),
}));

describe('src/background/providers/initializeInpageProvider', () => {
  let windowMock: any;
  const mockMultiWalletProxy = { defaultProvider: {}, addProvider: jest.fn() };
  beforeEach(() => {
    windowMock = {
      dispatchEvent: jest.fn(),
    } as any;
    (createMultiWalletProxy as jest.Mock).mockReturnValue(mockMultiWalletProxy);
  });

  it('initializes CoreProvider with the correct channel name', () => {
    const provider = initializeProvider('some-channel', 10, windowMock);
    expect(CoreProvider).toHaveBeenCalledWith({
      channelName: 'some-channel',
      maxListeners: 10,
    });
    expect(provider.isAvalanche).toBe(true);
  });

  it('wraps the provider in a proxy to prevent deletions', () => {
    const provider = initializeProvider('some-channel', 10, windowMock);

    expect(provider.isAvalanche).toBe(true);
    delete (provider as any).isAvalanche;
    expect(provider.isAvalanche).toBe(true);
  });

  describe('EIP-1193', () => {
    it('creates the window.ethereum object', () => {
      const provider = initializeProvider('some-channel', 10, windowMock);

      expect(createMultiWalletProxy).toHaveBeenCalledTimes(1);
      expect(createMultiWalletProxy).toHaveBeenCalledWith(provider);

      expect(windowMock.ethereum).toBe(mockMultiWalletProxy);
    });

    it('adds other wallets to proxy when trying to set window.ethereum', () => {
      initializeProvider('some-channel', 10, windowMock);

      const provider2 = { isMetaMask: true };

      windowMock.ethereum = provider2;

      expect(mockMultiWalletProxy.addProvider).toHaveBeenCalledTimes(1);
      expect(mockMultiWalletProxy.addProvider).toHaveBeenCalledWith(provider2);

      expect(windowMock.ethereum).toBe(mockMultiWalletProxy);
    });

    it('dispatches ethereum#initialized event', () => {
      initializeProvider('some-channel', 10, windowMock);

      expect(windowMock.ethereum).toBe(mockMultiWalletProxy);
      expect(windowMock.dispatchEvent).toHaveBeenCalledWith(
        new Event('ethereum#initialized')
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
      const provider = initializeProvider('some-channel', 10, windowMock);

      expect(windowMock.ethereum).toBe(otherWalletMock);
      expect(setMock).toHaveBeenCalledWith(provider);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    describe('legacy support: window.web3', () => {
      it('sets window.web3 object', () => {
        const provider = initializeProvider('some-channel', 10, windowMock);

        expect(createMultiWalletProxy).toHaveBeenCalledTimes(1);
        expect(createMultiWalletProxy).toHaveBeenCalledWith(provider);

        expect(windowMock.web3).toStrictEqual({
          currentProvider: mockMultiWalletProxy,
        });
      });

      // some legacy libraries like to decorate window.web3 like crazy
      it('lets setting properties on window.web3 except the metamask shim', () => {
        initializeProvider('some-channel', 10, windowMock);

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

  describe('EIP-5749', () => {
    it('sets window.evmproviders if not defined and adds core', () => {
      const provider = initializeProvider('some-channel', 10, windowMock);

      expect(windowMock.evmproviders).toStrictEqual({ core: provider });
    });
    it('adds Core to window.evmproviders if already defined', () => {
      windowMock.evmproviders = {
        MetaMask: { isMetaMask: true },
      };
      const provider = initializeProvider('some-channel', 10, windowMock);

      expect(windowMock.evmproviders).toStrictEqual({
        MetaMask: { isMetaMask: true },
        core: provider,
      });
    });
  });

  describe('window.avalanche', () => {
    it('creates the window.avalanche object', () => {
      const provider = initializeProvider('some-channel', 10, windowMock);

      expect(windowMock.avalanche).toBe(provider);
    });

    it('dispatches avalanche#initialized event', () => {
      const provider = initializeProvider('some-channel', 10, windowMock);

      expect(windowMock.avalanche).toBe(provider);
      expect(windowMock.dispatchEvent).toHaveBeenCalledWith(
        new Event('avalanche#initialized')
      );
    });

    it('makes window.avalanche non writable', () => {
      initializeProvider('some-channel', 10, windowMock);
      try {
        windowMock.avalanche = { isMetaMask: true };
      } catch (e) {
        expect((e as Error).message).toBe(
          `Cannot assign to read only property 'avalanche' of object '#<Object>'`
        );
      }
    });
  });
});
