import { EventEmitter } from 'stream';
import {
  MultiWalletProviderProxy,
  createMultiWalletProxy,
} from './MultiWalletProviderProxy';
import { EVMProvider } from '@avalabs/evm-module/dist/provider';
import { EIP6963ProviderInfo } from '@avalabs/vm-module-types';

jest.mock('@avalabs/evm-module/dist/provider', () => ({
  EVMProvider: jest.fn().mockImplementation(({ info, ...rest }) => ({
    isAvalanche: info.uuid ? false : true,
    removeAllListeners: jest.fn(),
    info: {
      ...info,
      uuid: info.uuid ?? 'default-uuid',
    },
    ...rest,
  })),
}));

const providerInfo = {
  description: 'EVM_PROVIDER_INFO_DESCRIPTION',
  icon: 'EVM_PROVIDER_INFO_ICON',
  name: 'EVM_PROVIDER_INFO_NAME',
  uuid: 'EVM_PROVIDER_INFO_UUID',
  rdns: 'EVM_PROVIDER_INFO_RDNS',
} as unknown as EIP6963ProviderInfo;

describe('src/background/providers/MultiWalletProviderProxy', () => {
  // });
  describe('init', () => {
    it('initializes with the default provider', () => {
      const provider = new EVMProvider({ info: providerInfo });

      const mwpp = new MultiWalletProviderProxy(provider);

      expect(mwpp.defaultProvider).toBe(provider);
      expect(mwpp.providers).toStrictEqual([provider]);
    });

    it('relays events from the deafult provider', () => {
      const provider = new EventEmitter();
      const mwpp = new MultiWalletProviderProxy(provider as EVMProvider);

      const eventSub = jest.fn();
      mwpp.on('chainChanged', eventSub);

      expect(eventSub).not.toHaveBeenCalled();

      provider.emit('chainChanged', { chainId: '0x1' });

      expect(eventSub).toHaveBeenCalledTimes(1);
      expect(eventSub).toHaveBeenCalledWith({ chainId: '0x1' });
    });
  });

  describe('addProvider', () => {
    it('should add new providers', () => {
      const provider = new EVMProvider({ info: providerInfo });
      const mwpp = new MultiWalletProviderProxy(provider);

      expect(mwpp.defaultProvider).toBe(provider);
      expect(mwpp.providers).toStrictEqual([provider]);

      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
      });
      const provider3 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-3' },
      });

      mwpp.addProvider(provider2);
      mwpp.addProvider(provider3);

      expect(mwpp.defaultProvider).toBe(provider);

      expect((mwpp.providers[0] as any).info.uuid).toBe(EVM_PROVIDER_INFO_UUID);
      expect((mwpp.providers[1] as any).info.uuid).toBe('uuid-2');
      expect((mwpp.providers[2] as any).info.uuid).toBe('uuid-3');
    });

    it('should not add a new provider because it has been already registered', () => {
      const provider = new EVMProvider({ info: providerInfo });
      const mwpp = new MultiWalletProviderProxy(provider);

      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
      });
      const provider3 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
      });
      mwpp.addProvider(provider2);
      mwpp.addProvider(provider3);

      expect(mwpp.providers.length as any).toBe(2);
      expect((mwpp.providers[0] as any).info.uuid).toBe(EVM_PROVIDER_INFO_UUID);
      expect((mwpp.providers[1] as any).info.uuid).toBe('uuid-2');
    });
  });

  describe('wallet selection', () => {
    it('toggles wallet selection on `eth_requestAccounts` call if multiple providers', async () => {
      const provider = new EVMProvider({
        info: providerInfo,
        request: jest.fn().mockResolvedValue(1),
      } as any);
      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
        isMetaMask: true,
        request: jest.fn().mockResolvedValue(2),
      } as any);

      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

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
              info: providerInfo,
            },
            {
              index: 1,
              info: { ...providerInfo, uuid: 'uuid-2' },
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
      expect(requestAccountsCallback).toHaveBeenCalledWith(2);
      expect(mwpp.defaultProvider).toBe(provider2);
    });

    it('does not toggle wallet selection if only core is available', async () => {
      const provider = new EVMProvider({ info: providerInfo });
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
      const provider = new EVMProvider({ info: providerInfo });
      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
        request: jest.fn(),
      } as any);
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
              info: providerInfo,
            },
            {
              index: 1,
              info: { ...providerInfo, uuid: 'uuid-2' },
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
      const provider = new EVMProvider({ info: providerInfo });
      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
        enable: jest.fn().mockResolvedValue(['0x000000']),
      } as any);
      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // user selects metamask
      provider.request = jest.fn().mockResolvedValue(1);

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
              info: providerInfo,
            },
            {
              index: 1,
              info: { ...providerInfo, uuid: 'uuid-2' },
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
      const provider = new EVMProvider({ info: providerInfo });
      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
        request: jest.fn().mockResolvedValue(['0x000000']),
      } as any);
      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // user selects metamask
      provider.request = jest.fn().mockResolvedValue(1);

      const requestAccountsCallback = jest.fn();
      mwpp.sendAsync(
        {
          method: 'eth_requestAccounts',
          id: '1',
          params: [],
        },
        requestAccountsCallback,
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
              info: providerInfo,
            },
            {
              index: 1,
              info: { ...providerInfo, uuid: 'uuid-2' },
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
        method: 'eth_requestAccounts',
        params: [],
        result: ['0x000000'],
      });
      expect(mwpp.defaultProvider).toBe(provider2);
    });

    it('wallet selection works with legacy functions: send with callback', async () => {
      const provider = new EVMProvider({ info: providerInfo });
      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
        request: jest.fn().mockResolvedValue(['0x000000']),
      } as any);
      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // user selects metamask
      provider.request = jest.fn().mockResolvedValue(1);

      const requestAccountsCallback = jest.fn();
      mwpp.send(
        { method: 'eth_requestAccounts', id: '1', params: [] },
        requestAccountsCallback,
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
              info: providerInfo,
            },
            {
              index: 1,
              info: { ...providerInfo, uuid: 'uuid-2' },
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
        params: [],
        method: 'eth_requestAccounts',
        result: ['0x000000'],
      });
      expect(mwpp.defaultProvider).toBe(provider2);
    });

    it('toggles wallet selection on `wallet_requestPermissions` call if multiple providers', async () => {
      const provider = new EVMProvider({
        info: providerInfo,
        request: jest.fn().mockResolvedValue(1),
      } as any);
      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
        request: jest
          .fn()
          .mockResolvedValue([{ parentCapability: 'eth_accounts' }]),
      } as any);

      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      const requestPermissionsCallback = jest.fn();
      mwpp
        .request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        })
        .then(requestPermissionsCallback);

      expect(requestPermissionsCallback).not.toHaveBeenCalled();
      expect(provider2.request).not.toHaveBeenCalled();
      expect(provider.request).toHaveBeenCalledTimes(1);

      expect(provider.request).toHaveBeenCalledWith({
        method: 'avalanche_selectWallet',
        params: [
          [
            {
              index: 0,
              info: providerInfo,
            },
            {
              index: 1,
              info: { ...providerInfo, uuid: 'uuid-2' },
            },
          ],
        ],
      });
      await new Promise(process.nextTick);

      expect(provider2.request).toHaveBeenCalledTimes(1);
      expect(provider2.request).toHaveBeenCalledWith({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      await new Promise(process.nextTick);
      expect(requestPermissionsCallback).toHaveBeenCalledTimes(1);
      expect(requestPermissionsCallback).toHaveBeenCalledWith([
        { parentCapability: 'eth_accounts' },
      ]);
      expect(mwpp.defaultProvider).toBe(provider2);
    });

    it('does not toggle wallet selection if selection is already pending', async () => {
      let resolveFirstSelection: (value: number) => void;
      const firstSelectionPromise = new Promise<number>((resolve) => {
        resolveFirstSelection = resolve;
      });

      const provider = new EVMProvider({
        info: providerInfo,
        request: jest
          .fn()
          // First call: wallet selection (returns promise we control)
          .mockReturnValueOnce(firstSelectionPromise)
          // Second call: eth_requestAccounts from second request (skipped selection)
          .mockResolvedValue(['0x000000']),
      } as any);
      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
        request: jest.fn().mockResolvedValue(['0x111111']),
      } as any);

      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // Start first request - this will trigger wallet selection
      mwpp.request({ method: 'eth_requestAccounts' });

      // Start second request while first is still pending - should skip wallet selection
      // but still proceed to call eth_requestAccounts on the current default provider
      mwpp.request({ method: 'eth_requestAccounts' });

      // Allow microtasks to run so the second request proceeds past the skipped selection
      await new Promise(process.nextTick);

      // First call should be wallet selection
      expect(provider.request).toHaveBeenNthCalledWith(1, {
        method: 'avalanche_selectWallet',
        params: [
          [
            { index: 0, info: providerInfo },
            { index: 1, info: { ...providerInfo, uuid: 'uuid-2' } },
          ],
        ],
      });

      // Second call should be eth_requestAccounts (not another wallet selection!)
      // This proves the pending flag prevented duplicate wallet selection
      expect(provider.request).toHaveBeenNthCalledWith(2, {
        method: 'eth_requestAccounts',
      });

      // Verify only 2 calls so far (1 wallet selection + 1 eth_requestAccounts)
      expect(provider.request).toHaveBeenCalledTimes(2);

      // Resolve the wallet selection - user selects provider2
      resolveFirstSelection!(1);
      await new Promise(process.nextTick);
      await new Promise(process.nextTick);

      // First request should now complete with provider2's result
      expect(provider2.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      });
    });

    it('resets pending state when wallet selection fails', async () => {
      const provider = new EVMProvider({
        info: providerInfo,
        request: jest
          .fn()
          // First call: wallet selection fails
          .mockRejectedValueOnce(new Error('User rejected'))
          // Second call: eth_requestAccounts after failed selection (falls through)
          .mockResolvedValueOnce(['0x000000'])
          // Third call: wallet selection succeeds (selects Core - index 0)
          .mockResolvedValueOnce(0)
          // Fourth call: eth_requestAccounts after successful selection
          .mockResolvedValue(['0x000000']),
      } as any);
      const provider2 = new EVMProvider({
        info: { ...providerInfo, uuid: 'uuid-2' },
        request: jest.fn().mockResolvedValue(['0x111111']),
      } as any);

      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2);

      // First request - wallet selection fails, but request still goes through
      await mwpp.request({ method: 'eth_requestAccounts' });

      // 1 failed selection + 1 eth_requestAccounts on default provider
      expect(provider.request).toHaveBeenCalledTimes(2);

      // Second request should be able to trigger wallet selection again
      // (pending flag was reset by the catch handler)
      const result = await mwpp.request({ method: 'eth_requestAccounts' });

      // 2 previous + 1 wallet selection + 1 eth_requestAccounts = 4 total
      expect(provider.request).toHaveBeenCalledTimes(4);
      expect(result).toEqual(['0x000000']);
    });

    it('handles providers without addListener method when switching wallets', async () => {
      const provider = new EventEmitter() as EVMProvider & EventEmitter;
      (provider as any).info = providerInfo;
      (provider as any).isAvalanche = true;
      (provider as any).removeAllListeners = jest.fn();
      (provider as any).request = jest.fn().mockResolvedValue(1); // Select provider2

      // Provider without addListener method (some external wallets may not have it)
      const provider2 = {
        info: { ...providerInfo, uuid: 'uuid-2' },
        request: jest.fn().mockResolvedValue(['0x000000']),
        // No addListener method - this is intentional
      };

      const mwpp = new MultiWalletProviderProxy(provider);
      mwpp.addProvider(provider2 as any);

      // Subscribe to an event before switching
      const eventCallback = jest.fn();
      mwpp.on('accountsChanged', eventCallback);

      // Should not throw even though provider2 doesn't have addListener
      const result = await mwpp.request({ method: 'eth_requestAccounts' });

      expect(result).toEqual(['0x000000']);
      expect(mwpp.defaultProvider).toBe(provider2);
    });
  });

  describe('createMultiWalletProxy', () => {
    it('creates proxy with property deletion disabled', () => {
      const provider = new EVMProvider({ info: providerInfo });
      const mwpp = createMultiWalletProxy(provider);

      expect(mwpp.defaultProvider).toBe(provider);
      delete (mwpp as any).defaultProvider;
      expect(mwpp.defaultProvider).toBe(provider);
    });

    it('allows setting extra params without changing the provider', () => {
      const provider = new EVMProvider({ info: providerInfo });
      const mwpp = createMultiWalletProxy(provider);

      (mwpp as any).somePromerty = true;
      expect((mwpp as any).somePromerty).toBe(true);
      expect((provider as any).somePromerty).not.toBeDefined();
    });

    it('does not overwrite provider properties', () => {
      const provider = { isAvalanche: true };
      const mwpp = createMultiWalletProxy(provider as EVMProvider);

      (mwpp as any).isAvalanche = false;
      expect((mwpp as any).isAvalanche).toBe(true);
    });

    it('calls the proxy properties first', () => {
      const provider = { defaultProvider: true };
      const mwpp = createMultiWalletProxy(provider as any);

      expect((mwpp as any).defaultProvider).toBe(provider);
    });
  });
});
