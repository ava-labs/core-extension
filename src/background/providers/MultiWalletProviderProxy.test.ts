import { EventEmitter } from 'stream';
import { CoreProvider } from './CoreProvider';
import {
  MultiWalletProviderProxy,
  createMultiWalletProxy,
} from './MultiWalletProviderProxy';

jest.mock('./CoreProvider', () => ({
  CoreProvider: jest.fn().mockImplementation(() => ({
    isAvalanche: true,
    removeAllListeners: jest.fn(),
  })),
}));

describe('src/background/providers/MultiWalletProviderProxy', () => {
  describe('init', () => {
    it('initializes with the default provider', () => {
      const provider = new CoreProvider({ channelName: '' });

      const mwpp = new MultiWalletProviderProxy(provider);

      expect(mwpp.defaultProvider).toBe(provider);
      expect(mwpp.providers).toStrictEqual([provider]);
    });

    it('relays events from the deafult provider', () => {
      const provider = new EventEmitter();
      const mwpp = new MultiWalletProviderProxy(provider as CoreProvider);

      const eventSub = jest.fn();
      mwpp.on('chainChanged', eventSub);

      expect(eventSub).not.toHaveBeenCalled();

      provider.emit('chainChanged', { chainId: '0x1' });

      expect(eventSub).toHaveBeenCalledTimes(1);
      expect(eventSub).toHaveBeenCalledWith({ chainId: '0x1' });
    });
  });

  describe('addProvider', () => {
    it('adds new providers from coinbase proxy', () => {
      const provider = new CoreProvider({ channelName: '' });
      const mwpp = new MultiWalletProviderProxy(provider);

      expect(mwpp.defaultProvider).toBe(provider);
      expect(mwpp.providers).toStrictEqual([provider]);

      const mockProvider = {
        providerMap: new Map([
          ['core', provider],
          ['otherprovider', { isMetaMask: true }],
          ['thirdprovider', { isRabby: true }],
        ] as any),
      };

      mwpp.addProvider(mockProvider);

      expect(mwpp.defaultProvider).toBe(provider);
      expect(mwpp.providers).toEqual([
        mwpp,
        { isMetaMask: true },
        { isRabby: true },
      ]);

      expect((mwpp.providers[0] as any).isMetaMask).toBeTruthy();
    });

    it('does not add extra coinbase proxy', () => {
      const provider = new CoreProvider({ channelName: '' });
      const mwpp = new MultiWalletProviderProxy(provider);

      expect(mwpp.defaultProvider).toBe(provider);
      expect(mwpp.providers).toStrictEqual([provider]);

      const mockProvider = {
        coinbaseWalletInstalls: {},
      };

      mwpp.addProvider(mockProvider);

      expect(mwpp.defaultProvider).toBe(provider);
      expect(mwpp.providers).toStrictEqual([provider]);
    });

    it('adds new provider', () => {
      const provider = new CoreProvider({ channelName: '' });
      const mwpp = new MultiWalletProviderProxy(provider);

      expect(mwpp.defaultProvider).toBe(provider);
      expect(mwpp.providers).toStrictEqual([provider]);

      const mockProvider = { isMetaMask: true };

      mwpp.addProvider(mockProvider);

      expect(mwpp.defaultProvider).toBe(provider);
      expect(mwpp.providers).toEqual([mwpp, mockProvider]);
    });
  });

  describe('wallet selection', () => {
    it('toggles wallet selection on `eth_requestAccounts` call if multiple providers', async () => {
      const provider = new CoreProvider({ channelName: '' });
      const provider2 = { isMetaMask: true, request: jest.fn() };
      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // user selects metamask
      provider.request = jest.fn().mockResolvedValue(1);
      provider2.request.mockResolvedValue(['0x000000']);

      const requestAccountsCallback = jest.fn();
      mwpp
        .request({ method: 'eth_requestAccounts' })
        .then(requestAccountsCallback);

      expect(requestAccountsCallback).not.toHaveBeenCalled();

      expect(provider2.request).not.toHaveBeenCalled();
      expect(provider.request).toHaveBeenCalledTimes(1);
      expect(provider.request).toHaveBeenCalledWith({
        method: 'avalanche_selectWallet',
        params: [
          [
            {
              index: 0,
              type: 'CORE',
            },
            {
              index: 1,
              type: 'METAMASK',
            },
          ],
        ],
      });
      await new Promise(process.nextTick);

      expect(provider2.request).toHaveBeenCalledTimes(1);
      expect(provider2.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      });

      await new Promise(process.nextTick);
      expect(requestAccountsCallback).toHaveBeenCalledTimes(1);
      expect(requestAccountsCallback).toHaveBeenCalledWith(['0x000000']);
      expect(mwpp.defaultProvider).toBe(provider2);
    });

    it('does not toggle wallet selection if only core is available', async () => {
      const provider = new CoreProvider({ channelName: '' });
      const mwpp = new MultiWalletProviderProxy(provider);

      provider.request = jest.fn().mockResolvedValueOnce(['0x000000']);

      const requestAccountsCallback = jest.fn();
      mwpp
        .request({ method: 'eth_requestAccounts' })
        .then(requestAccountsCallback);

      expect(requestAccountsCallback).not.toHaveBeenCalled();

      expect(provider.request).toHaveBeenCalledTimes(1);
      expect(provider.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      });

      await new Promise(process.nextTick);
      expect(requestAccountsCallback).toHaveBeenCalledTimes(1);
      expect(requestAccountsCallback).toHaveBeenCalledWith(['0x000000']);
    });

    it('does not toggle wallet selection if wallet is already selected', async () => {
      const provider = new CoreProvider({ channelName: '' });
      const provider2 = { isMetaMask: true, request: jest.fn() };
      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // user selects core
      provider.request = jest
        .fn()
        .mockResolvedValueOnce(0)
        .mockResolvedValue(['0x000000']);

      const requestAccountsCallback = jest.fn();
      mwpp
        .request({ method: 'eth_requestAccounts' })
        .then(requestAccountsCallback);

      expect(requestAccountsCallback).not.toHaveBeenCalled();

      expect(provider2.request).not.toHaveBeenCalled();
      expect(provider.request).toHaveBeenCalledTimes(1);
      expect(provider.request).toHaveBeenCalledWith({
        method: 'avalanche_selectWallet',
        params: [
          [
            {
              index: 0,
              type: 'CORE',
            },
            {
              index: 1,
              type: 'METAMASK',
            },
          ],
        ],
      });
      await new Promise(process.nextTick);

      expect(provider.request).toHaveBeenCalledTimes(2);
      expect(provider.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      });

      await new Promise(process.nextTick);
      expect(requestAccountsCallback).toHaveBeenCalledTimes(1);
      expect(requestAccountsCallback).toHaveBeenCalledWith(['0x000000']);

      mwpp
        .request({ method: 'eth_requestAccounts' })
        .then(requestAccountsCallback);

      await new Promise(process.nextTick);
      expect(requestAccountsCallback).toHaveBeenCalledTimes(2);
      expect(requestAccountsCallback).toHaveBeenCalledWith(['0x000000']);
    });

    it('wallet selection works with legacy functions: enable', async () => {
      const provider = new CoreProvider({ channelName: '' });
      const provider2 = { isMetaMask: true, enable: jest.fn() };
      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // user selects metamask
      provider.request = jest.fn().mockResolvedValue(1);
      provider2.enable.mockResolvedValue(['0x000000']);

      const requestAccountsCallback = jest.fn();
      mwpp.enable().then(requestAccountsCallback);

      expect(requestAccountsCallback).not.toHaveBeenCalled();

      expect(provider2.enable).not.toHaveBeenCalled();
      expect(provider.request).toHaveBeenCalledTimes(1);
      expect(provider.request).toHaveBeenCalledWith({
        method: 'avalanche_selectWallet',
        params: [
          [
            {
              index: 0,
              type: 'CORE',
            },
            {
              index: 1,
              type: 'METAMASK',
            },
          ],
        ],
      });
      await new Promise(process.nextTick);

      expect(provider2.enable).toHaveBeenCalledTimes(1);

      await new Promise(process.nextTick);
      expect(requestAccountsCallback).toHaveBeenCalledTimes(1);
      expect(requestAccountsCallback).toHaveBeenCalledWith(['0x000000']);
      expect(mwpp.defaultProvider).toBe(provider2);
    });

    it('wallet selection works with legacy functions: sendAsync', async () => {
      const provider = new CoreProvider({ channelName: '' });
      const provider2 = { isMetaMask: true, request: jest.fn() };
      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // user selects metamask
      provider.request = jest.fn().mockResolvedValue(1);
      provider2.request.mockResolvedValue(['0x000000']);

      const requestAccountsCallback = jest.fn();
      mwpp.sendAsync(
        { method: 'eth_requestAccounts', jsonrpc: '2.0', id: '1' },
        requestAccountsCallback
      );

      expect(requestAccountsCallback).not.toHaveBeenCalled();

      expect(provider2.request).not.toHaveBeenCalled();
      expect(provider.request).toHaveBeenCalledTimes(1);
      expect(provider.request).toHaveBeenCalledWith({
        method: 'avalanche_selectWallet',
        params: [
          [
            {
              index: 0,
              type: 'CORE',
            },
            {
              index: 1,
              type: 'METAMASK',
            },
          ],
        ],
      });
      await new Promise(process.nextTick);

      expect(provider2.request).toHaveBeenCalledTimes(1);

      await new Promise(process.nextTick);
      expect(requestAccountsCallback).toHaveBeenCalledTimes(1);
      expect(requestAccountsCallback).toHaveBeenCalledWith(null, {
        id: '1',
        jsonrpc: '2.0',
        method: 'eth_requestAccounts',
        result: ['0x000000'],
      });
      expect(mwpp.defaultProvider).toBe(provider2);
    });

    it('wallet selection works with legacy functions: send with callback', async () => {
      const provider = new CoreProvider({ channelName: '' });
      const provider2 = { isMetaMask: true, request: jest.fn() };
      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // user selects metamask
      provider.request = jest.fn().mockResolvedValue(1);
      provider2.request.mockResolvedValue(['0x000000']);

      const requestAccountsCallback = jest.fn();
      mwpp.send(
        { method: 'eth_requestAccounts', jsonrpc: '2.0', id: '1' },
        requestAccountsCallback
      );

      expect(requestAccountsCallback).not.toHaveBeenCalled();

      expect(provider2.request).not.toHaveBeenCalled();
      expect(provider.request).toHaveBeenCalledTimes(1);
      expect(provider.request).toHaveBeenCalledWith({
        method: 'avalanche_selectWallet',
        params: [
          [
            {
              index: 0,
              type: 'CORE',
            },
            {
              index: 1,
              type: 'METAMASK',
            },
          ],
        ],
      });
      await new Promise(process.nextTick);

      expect(provider2.request).toHaveBeenCalledTimes(1);

      await new Promise(process.nextTick);
      expect(requestAccountsCallback).toHaveBeenCalledTimes(1);
      expect(requestAccountsCallback).toHaveBeenCalledWith(null, {
        id: '1',
        jsonrpc: '2.0',
        method: 'eth_requestAccounts',
        result: ['0x000000'],
      });
      expect(mwpp.defaultProvider).toBe(provider2);
    });
  });

  describe('createMultiWalletProxy', () => {
    it('creates proxy with property deletion disabled', () => {
      const provider = new CoreProvider({ channelName: '' });
      const mwpp = createMultiWalletProxy(provider);

      expect(mwpp.defaultProvider).toBe(provider);
      delete (mwpp as any).defaultProvider;
      expect(mwpp.defaultProvider).toBe(provider);
    });

    it('allows setting extra params without changing the provider', () => {
      const provider = new CoreProvider({ channelName: '' });
      const mwpp = createMultiWalletProxy(provider);

      (mwpp as any).somePromerty = true;
      expect((mwpp as any).somePromerty).toBe(true);
      expect((provider as any).somePromerty).not.toBeDefined();
    });

    it('does not overwrite provider properties', () => {
      const provider = { isAvalanche: true };
      const mwpp = createMultiWalletProxy(provider as CoreProvider);

      (mwpp as any).isAvalanche = false;
      expect((mwpp as any).isAvalanche).toBe(true);
    });

    it('calls the proxy properties first', () => {
      const provider = { defaultProvider: true };
      const mwpp = createMultiWalletProxy(provider as any);

      expect((mwpp as any).defaultProvider).toBe(provider);
    });

    it('maintains the providers list properly', () => {
      const provider = new CoreProvider({ channelName: '' });
      const mwpp = createMultiWalletProxy(provider);
      const fooMock = () => 'bar';
      const bizMock = () => 'baz';

      const mockProvider = {
        providerMap: new Map([
          ['core', provider],
          ['otherprovider', { isMetaMask: true, foo: fooMock }],
          ['thirdprovider', { isRabby: true, biz: bizMock }],
        ] as any),
      };

      mwpp.addProvider(mockProvider);

      expect((mwpp.providers[0] as any).isMetaMask).toBe(true);
      expect((mwpp.providers[0] as any).someUndefinedProperty).toBe(undefined);
      expect((mwpp.providers[0] as any)['#isWalletSelected']).toBe(undefined);

      expect(mwpp.providers[1] as any).toEqual({
        isMetaMask: true,
        foo: fooMock,
      });

      expect(mwpp.providers[2] as any).toEqual({
        isMetaMask: undefined,
        isRabby: true,
        biz: bizMock,
      });
    });
  });
});
