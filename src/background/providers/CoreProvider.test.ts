import { ethErrors } from 'eth-rpc-errors';
import { CoreProvider } from './CoreProvider';
import onDomReady from './utils/onDomReady';
import { DAppProviderRequest } from '../connections/dAppConnection/models';
import AutoPairingPostMessageConnection from '../utils/messaging/AutoPairingPostMessageConnection';

jest.mock('../utils/messaging/AutoPairingPostMessageConnection', () => {
  const mocks = {
    connect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    request: jest.fn().mockResolvedValue({}),
  };
  return jest.fn().mockReturnValue(mocks);
});

jest.mock('./utils/onDomReady');

describe('src/background/providers/CoreProvider', () => {
  const channelMock = new AutoPairingPostMessageConnection(false);

  beforeEach(() => {
    jest.mocked(channelMock.connect).mockResolvedValueOnce(undefined);

    (channelMock.request as jest.Mock).mockResolvedValueOnce({
      isUnlocked: true,
      chainId: '0x1',
      networkVersion: '1',
      accounts: ['0x00000'],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('EIP-5749', () => {
    it('sets the ProviderInfo', () => {
      const provider = new CoreProvider({ connection: channelMock });
      expect(provider.info).toEqual({
        description: 'EVM_PROVIDER_INFO_DESCRIPTION',
        icon: 'EVM_PROVIDER_INFO_ICON',
        name: 'EVM_PROVIDER_INFO_NAME',
        uuid: 'EVM_PROVIDER_INFO_UUID',
      });
    });
  });

  describe('EIP-1193', () => {
    describe('request', () => {
      it('collects pending requests till the dom is ready', async () => {
        const provider = new CoreProvider({ connection: channelMock });

        // wait for init to finish
        await new Promise(process.nextTick);

        expect(channelMock.request).toHaveBeenCalledTimes(1);
        expect(channelMock.request).toHaveBeenCalledWith({
          method: DAppProviderRequest.INIT_DAPP_STATE,
        });

        // response for domain metadata send
        (channelMock.request as jest.Mock).mockResolvedValueOnce({});
        // response for 'some-method'
        (channelMock.request as jest.Mock).mockResolvedValueOnce('success');
        const rpcResultCallback = jest.fn();
        provider
          .request({
            method: 'some-method',
            params: [{ param1: 1 }],
          })
          .then(rpcResultCallback);
        await new Promise(process.nextTick);

        // no domReady happened yet, still only one call sent
        expect(channelMock.request).toHaveBeenCalledTimes(1);

        // domReady triggers sending pending requests as well
        (onDomReady as jest.Mock).mock.calls[0][0]();
        await new Promise(process.nextTick);

        expect(channelMock.request).toHaveBeenCalledTimes(3);
        expect(channelMock.request).toHaveBeenCalledWith({
          method: 'some-method',
          params: [{ param1: 1 }],
        });

        expect(rpcResultCallback).toHaveBeenCalledWith('success');
      });

      it('rate limits `eth_requestAccounts` requests', async () => {
        const provider = new CoreProvider({ connection: channelMock });

        // wait for init to finish
        await new Promise(process.nextTick);

        expect(channelMock.request).toHaveBeenCalledTimes(1);
        expect(channelMock.request).toHaveBeenCalledWith({
          method: DAppProviderRequest.INIT_DAPP_STATE,
        });

        // response for domain metadata send
        (channelMock.request as jest.Mock).mockResolvedValueOnce({});
        // response for 'eth_requestAccounts'
        (channelMock.request as jest.Mock).mockResolvedValue('success');
        const firstCallCallback = jest.fn();
        const secondCallCallback = jest.fn();
        provider
          .request({
            method: 'eth_requestAccounts',
          })
          .then(firstCallCallback)
          .catch(firstCallCallback);
        provider
          .request({
            method: 'eth_requestAccounts',
          })
          .then(secondCallCallback)
          .catch(secondCallCallback);
        await new Promise(process.nextTick);

        // no domReady happened yet, still only one call sent
        expect(channelMock.request).toHaveBeenCalledTimes(1);

        // domReady triggers sending pending requests as well
        (onDomReady as jest.Mock).mock.calls[0][0]();
        await new Promise(process.nextTick);

        expect(channelMock.request).toHaveBeenCalledTimes(3);
        expect(channelMock.request).toHaveBeenCalledWith({
          method: 'eth_requestAccounts',
        });

        expect(firstCallCallback).toHaveBeenCalledWith('success');
        expect(secondCallCallback).toHaveBeenCalledWith(
          ethErrors.rpc.resourceUnavailable(
            `Request of type eth_requestAccounts already pending for origin. Please wait.`
          )
        );
      });

      it('always returns JSON RPC-compatible error', async () => {
        const provider = new CoreProvider({ connection: channelMock });

        // wait for init to finish
        await new Promise(process.nextTick);

        expect(channelMock.request).toHaveBeenCalledTimes(1);
        expect(channelMock.request).toHaveBeenCalledWith({
          method: DAppProviderRequest.INIT_DAPP_STATE,
        });

        // response for domain metadata send
        (channelMock.request as jest.Mock).mockResolvedValueOnce({});
        // response for 'eth_requestAccounts'
        (channelMock.request as jest.Mock).mockRejectedValueOnce(
          new Error('non RPC error')
        );
        const callCallback = jest.fn();
        provider
          .request({
            method: 'eth_requestAccounts',
          })
          .catch(callCallback);
        await new Promise(process.nextTick);

        // no domReady happened yet, still only one call sent
        expect(channelMock.request).toHaveBeenCalledTimes(1);

        // domReady triggers sending pending requests as well
        (onDomReady as jest.Mock).mock.calls[0][0]();
        await new Promise(process.nextTick);

        expect(channelMock.request).toHaveBeenCalledTimes(3);
        expect(channelMock.request).toHaveBeenCalledWith({
          method: 'eth_requestAccounts',
        });

        expect(callCallback).toHaveBeenCalledWith({
          code: -32603,
          data: {
            originalError: {},
          },
          message: 'non RPC error',
        });
      });

      it('does not double wraps JSON RPC errors', async () => {
        const provider = new CoreProvider({ connection: channelMock });

        // wait for init to finish
        await new Promise(process.nextTick);

        expect(channelMock.request).toHaveBeenCalledTimes(1);
        expect(channelMock.request).toHaveBeenCalledWith({
          method: DAppProviderRequest.INIT_DAPP_STATE,
        });

        // response for domain metadata send
        (channelMock.request as jest.Mock).mockResolvedValueOnce({});
        // response for 'eth_requestAccounts'
        (channelMock.request as jest.Mock).mockRejectedValueOnce({
          code: 4902,
          message:
            'Unrecognized chain ID "0x3FF82". Try adding the chain using wallet_addEthereumChain first.',
          stack: 'Error: Unrecognized chain ID "0x3FF82"',
        });
        const callCallback = jest.fn();
        provider
          .request({
            method: 'eth_requestAccounts',
          })
          .catch(callCallback);
        await new Promise(process.nextTick);

        // no domReady happened yet, still only one call sent
        expect(channelMock.request).toHaveBeenCalledTimes(1);

        // domReady triggers sending pending requests as well
        (onDomReady as jest.Mock).mock.calls[0][0]();
        await new Promise(process.nextTick);

        expect(channelMock.request).toHaveBeenCalledTimes(3);
        expect(channelMock.request).toHaveBeenCalledWith({
          method: 'eth_requestAccounts',
        });

        expect(callCallback).toHaveBeenCalledWith({
          code: 4902,
          message:
            'Unrecognized chain ID "0x3FF82". Try adding the chain using wallet_addEthereumChain first.',
          stack: 'Error: Unrecognized chain ID "0x3FF82"',
        });
      });
    });

    describe('events', () => {
      describe(`connect`, () => {
        it('emits `connect` when chainId first set', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const connectSubscription = jest.fn();
          provider.addListener('connect', connectSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(1);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: DAppProviderRequest.INIT_DAPP_STATE,
          });

          expect(connectSubscription).toHaveBeenCalledTimes(1);
          expect(connectSubscription).toHaveBeenCalledWith({ chainId: '0x1' });
        });

        it('does not emit connect if chain is still loading', async () => {
          (channelMock.request as jest.Mock).mockReset();
          (channelMock.request as jest.Mock).mockResolvedValue({
            isUnlocked: true,
            chainId: '0x0',
            networkVersion: 'loading',
            accounts: ['0x00000'],
          });
          const provider = new CoreProvider({ connection: channelMock });
          const connectSubscription = jest.fn();
          provider.addListener('connect', connectSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(1);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: DAppProviderRequest.INIT_DAPP_STATE,
          });

          expect(connectSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x1', networkVersion: '1' },
          });
          expect(connectSubscription).toHaveBeenCalledTimes(1);
          expect(connectSubscription).toHaveBeenCalledWith({
            chainId: '0x1',
          });
        });

        it('emits connect on re-connect after disconnected', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const connectSubscription = jest.fn();
          const disconnectSubscription = jest.fn();
          provider.addListener('connect', connectSubscription);
          provider.addListener('disconnect', disconnectSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(connectSubscription).toHaveBeenCalledTimes(1);
          expect(connectSubscription).toHaveBeenCalledWith({
            chainId: '0x1',
          });
          expect(disconnectSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'disconnect',
          });

          expect(disconnectSubscription).toHaveBeenCalledTimes(1);

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x2', networkVersion: '2' },
          });

          expect(connectSubscription).toHaveBeenCalledTimes(2);
          expect(connectSubscription).toHaveBeenCalledWith({
            chainId: '0x2',
          });
        });
      });

      describe('disconnect', () => {
        it('emits disconnect event with error', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const disconnectSubscription = jest.fn();
          provider.addListener('disconnect', disconnectSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(provider._isConnected).toBe(true);
          expect(provider._state.isConnected).toBe(true);
          expect(provider._state.accounts).toStrictEqual(['0x00000']);
          expect(provider.selectedAddress).toStrictEqual('0x00000');

          expect(disconnectSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'disconnect',
          });

          expect(provider._isConnected).toBe(false);
          expect(provider._state.isConnected).toBe(false);
          expect(provider._state.accounts).toBe(null);
          expect(provider.selectedAddress).toBe(null);

          expect(disconnectSubscription).toHaveBeenCalledTimes(1);
          expect(disconnectSubscription).toHaveBeenCalledWith(
            ethErrors.provider.disconnected()
          );
        });
      });

      describe('chainChanged', () => {
        it('does not emit `chainChanged` on initialization', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const chainChangedSubscription = jest.fn();
          provider.addListener('chainChanged', chainChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(chainChangedSubscription).not.toHaveBeenCalled();
        });

        it('emits `chainChanged` when gets connected to a chain later', async () => {
          (channelMock.request as jest.Mock).mockReset();
          (channelMock.request as jest.Mock).mockResolvedValue({
            isUnlocked: true,
            chainId: '0x0',
            networkVersion: 'loading',
            accounts: ['0x00000'],
          });
          const provider = new CoreProvider({ connection: channelMock });
          const chainChangedSubscription = jest.fn();
          provider.addListener('chainChanged', chainChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(chainChangedSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x1', networkVersion: '1' },
          });
          expect(chainChangedSubscription).toHaveBeenCalledTimes(1);
          expect(chainChangedSubscription).toHaveBeenCalledWith('0x1');
        });

        it('does not emit `chainChanged` when chain is set to the same value', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const chainChangedSubscription = jest.fn();
          provider.addListener('chainChanged', chainChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(chainChangedSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x1', networkVersion: '1' },
          });
          expect(chainChangedSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x1', networkVersion: '1' },
          });
          expect(chainChangedSubscription).not.toHaveBeenCalled();
        });

        it('emits `chainChanged` when chain is set to new value', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const chainChangedSubscription = jest.fn();
          provider.addListener('chainChanged', chainChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(chainChangedSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x2', networkVersion: '1' },
          });
          expect(chainChangedSubscription).toHaveBeenCalledTimes(1);
          expect(chainChangedSubscription).toHaveBeenCalledWith('0x2');

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x1', networkVersion: '1' },
          });
          expect(chainChangedSubscription).toHaveBeenCalledTimes(2);
          expect(chainChangedSubscription).toHaveBeenCalledWith('0x1');
        });
      });

      describe('accountsChanged', () => {
        it('emits `accountsChanged` on initialization', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const accountsChangedSubscription = jest.fn();
          provider.addListener('accountsChanged', accountsChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(accountsChangedSubscription).toHaveBeenCalledTimes(1);
          expect(accountsChangedSubscription).toHaveBeenCalledWith(['0x00000']);
          expect(provider._state.accounts).toStrictEqual(['0x00000']);
          expect(provider.selectedAddress).toStrictEqual('0x00000');
        });

        it('emits `accountsChanged` on initialization with empty array if no accounts', async () => {
          (channelMock.request as jest.Mock).mockReset();
          (channelMock.request as jest.Mock).mockResolvedValue({
            isUnlocked: true,
            chainId: '0x1',
            networkVersion: '1',
            accounts: undefined,
          });
          const provider = new CoreProvider({ connection: channelMock });
          const accountsChangedSubscription = jest.fn();
          provider.addListener('accountsChanged', accountsChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(accountsChangedSubscription).toHaveBeenCalledTimes(1);
          expect(accountsChangedSubscription).toHaveBeenCalledWith([]);
        });

        it('does not emit `accountsChanged` when account is set to the same value', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const accountsChangedSubscription = jest.fn();
          provider.addListener('accountsChanged', accountsChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(accountsChangedSubscription).toHaveBeenCalledTimes(1);
          expect(accountsChangedSubscription).toHaveBeenCalledWith(['0x00000']);

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'accountsChanged',
            params: ['0x00000'],
          });
          expect(accountsChangedSubscription).toHaveBeenCalledTimes(1);
        });

        it('emits `accountsChanged` when account is set to new value', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const accountsChangedSubscription = jest.fn();
          provider.addListener('accountsChanged', accountsChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(accountsChangedSubscription).toHaveBeenCalledTimes(1);
          expect(accountsChangedSubscription).toHaveBeenCalledWith(['0x00000']);

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'accountsChanged',
            params: ['0x10000'],
          });
          expect(accountsChangedSubscription).toHaveBeenCalledTimes(2);
          expect(accountsChangedSubscription).toHaveBeenCalledWith(['0x10000']);
          expect(provider._state.accounts).toStrictEqual(['0x10000']);
          expect(provider.selectedAddress).toStrictEqual('0x10000');
        });
      });
    });

    describe('legacy', () => {
      describe('sendAsync', () => {
        it('collects pending requests till the dom is ready', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for domain metadata send
          (channelMock.request as jest.Mock).mockResolvedValueOnce(undefined);
          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValueOnce('success');
          const rpcResultCallback = jest.fn();
          provider.sendAsync(
            {
              method: 'some-method',
              params: [{ param1: 1 }],
            },
            rpcResultCallback
          );
          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(3);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'some-method',
            params: [{ param1: 1 }],
          });

          expect(rpcResultCallback).toHaveBeenCalledWith(null, {
            method: 'some-method',
            result: 'success',
          });
        });

        it('rate limits `eth_requestAccounts` requests', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for domain metadata send
          (channelMock.request as jest.Mock).mockResolvedValueOnce({});
          // response for 'eth_requestAccounts'
          (channelMock.request as jest.Mock).mockResolvedValue('success');
          const firstCallCallback = jest.fn();
          const secondCallCallback = jest.fn();
          provider.sendAsync(
            {
              method: 'eth_requestAccounts',
            },
            firstCallCallback
          );
          provider.sendAsync(
            {
              method: 'eth_requestAccounts',
            },
            secondCallCallback
          );
          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(3);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'eth_requestAccounts',
          });

          expect(firstCallCallback).toHaveBeenCalledWith(null, {
            method: 'eth_requestAccounts',
            result: 'success',
          });
          expect(secondCallCallback).toHaveBeenCalledWith(
            ethErrors.rpc.resourceUnavailable(
              `Request of type eth_requestAccounts already pending for origin. Please wait.`
            ),
            {
              method: 'eth_requestAccounts',
              error: ethErrors.rpc.resourceUnavailable(
                `Request of type eth_requestAccounts already pending for origin. Please wait.`
              ),
            }
          );
        });

        it('supports batched requets', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValue('success');
          const rpcResultCallback = jest.fn();
          provider.sendAsync(
            [
              {
                method: 'some-method',
                params: [{ param1: 1 }],
              },
              {
                method: 'some-method2',
                params: [{ param1: 2 }],
              },
            ],
            rpcResultCallback
          );
          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(4);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'some-method',
            params: [{ param1: 1 }],
          });
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'some-method2',
            params: [{ param1: 2 }],
          });

          expect(rpcResultCallback).toHaveBeenCalledWith(null, [
            { method: 'some-method', result: 'success' },
            { method: 'some-method2', result: 'success' },
          ]);
        });
      });

      describe('send', () => {
        it('collects pending requests till the dom is ready', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for domain metadata send
          (channelMock.request as jest.Mock).mockResolvedValueOnce({});
          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValueOnce('success');
          const rpcResultCallback = jest.fn();
          provider.send(
            {
              method: 'some-method',
              params: [{ param1: 1 }],
            },
            rpcResultCallback
          );
          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(3);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'some-method',
            params: [{ param1: 1 }],
          });

          expect(rpcResultCallback).toHaveBeenCalledWith(null, {
            method: 'some-method',
            result: 'success',
          });
        });

        it('rate limits `eth_requestAccounts` requests', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for domain metadata send
          (channelMock.request as jest.Mock).mockResolvedValueOnce({});
          // response for 'eth_requestAccounts'
          (channelMock.request as jest.Mock).mockResolvedValue('success');
          const firstCallCallback = jest.fn();
          const secondCallCallback = jest.fn();
          provider.send(
            {
              method: 'eth_requestAccounts',
            },
            firstCallCallback
          );
          provider.send(
            {
              method: 'eth_requestAccounts',
            },
            secondCallCallback
          );
          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(3);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'eth_requestAccounts',
          });

          expect(firstCallCallback).toHaveBeenCalledWith(null, {
            method: 'eth_requestAccounts',
            result: 'success',
          });
          expect(secondCallCallback).toHaveBeenCalledWith(
            ethErrors.rpc.resourceUnavailable(
              `Request of type eth_requestAccounts already pending for origin. Please wait.`
            ),
            {
              method: 'eth_requestAccounts',
              error: ethErrors.rpc.resourceUnavailable(
                `Request of type eth_requestAccounts already pending for origin. Please wait.`
              ),
            }
          );
        });

        it('supports batched requets', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValue('success');
          const rpcResultCallback = jest.fn();
          provider.send(
            [
              {
                method: 'some-method',
                params: [{ param1: 1 }],
              },
              {
                method: 'some-method2',
                params: [{ param1: 2 }],
              },
            ],
            rpcResultCallback
          );
          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(4);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'some-method',
            params: [{ param1: 1 }],
          });
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'some-method2',
            params: [{ param1: 2 }],
          });

          expect(rpcResultCallback).toHaveBeenCalledWith(null, [
            { method: 'some-method', result: 'success' },
            { method: 'some-method2', result: 'success' },
          ]);
        });

        it('supports method as the only param', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValue('success');
          const rpcResultCallback = jest.fn();
          const promise = provider.send('some-method');
          expect(typeof (promise as Promise<unknown>).then).toBe('function');

          (promise as Promise<unknown>).then(rpcResultCallback);

          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(3);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'some-method',
            params: undefined,
          });
          expect(rpcResultCallback).toHaveBeenCalledWith({
            id: undefined,
            jsonrpc: '2.0',
            result: 'success',
          });
        });

        it('supports method with params', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValue('success');
          const rpcResultCallback = jest.fn();
          const promise = provider.send('some-method', [{ someparam: 1 }]);
          expect(typeof (promise as Promise<unknown>).then).toBe('function');

          (promise as Promise<unknown>).then(rpcResultCallback);

          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(3);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'some-method',
            params: [{ someparam: 1 }],
          });
          expect(rpcResultCallback).toHaveBeenCalledWith({
            id: undefined,
            jsonrpc: '2.0',
            result: 'success',
          });
        });

        it('returns eth_accounts response syncronously', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValue('success');
          const result = provider.send({ method: 'eth_accounts' });
          expect(result).toStrictEqual({
            id: undefined,
            jsonrpc: undefined,
            result: ['0x00000'],
          });
        });

        it('returns eth_coinbase response syncronously', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValue('success');
          const result = provider.send({ method: 'eth_coinbase', id: 1 });
          expect(result).toStrictEqual({
            id: 1,
            jsonrpc: undefined,
            result: '0x00000',
          });
        });

        it('throws error if method not supported syncronously', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValue('success');
          try {
            const result = provider.send({
              method: 'some-unsupported-method',
              id: 1,
            });
            expect(result).not.toBeDefined();
          } catch (error) {
            expect(error).toStrictEqual(
              new Error(
                'Sync method not supported. Please provide a callback or use the `request` function.'
              )
            );
          }
        });
      });

      describe('enable', () => {
        it('collects pending requests till the dom is ready', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for domain metadata send
          (channelMock.request as jest.Mock).mockResolvedValueOnce(undefined);
          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValueOnce(['0x0000']);
          const rpcResultCallback = jest.fn();
          provider.enable().then(rpcResultCallback);
          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(3);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'eth_requestAccounts',
          });

          expect(rpcResultCallback).toHaveBeenCalledWith(['0x0000']);
        });

        it('rate limits enable calls', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for domain metadata send
          (channelMock.request as jest.Mock).mockResolvedValueOnce(undefined);
          // response for 'eth_requestAccounts'
          (channelMock.request as jest.Mock).mockResolvedValue(['0x0000']);
          const firstCallCallback = jest.fn();
          const secondCallCallback = jest.fn();
          provider.enable().then(firstCallCallback).catch(firstCallCallback);
          provider.enable().then(secondCallCallback).catch(secondCallCallback);
          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(3);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'eth_requestAccounts',
          });

          expect(firstCallCallback).toHaveBeenCalledWith(['0x0000']);
          expect(secondCallCallback).toHaveBeenCalledWith(
            ethErrors.rpc.resourceUnavailable(
              `Request of type eth_requestAccounts already pending for origin. Please wait.`
            )
          );
        });
      });

      describe('net_version', () => {
        it('supports net_version call', async () => {
          const provider = new CoreProvider({ connection: channelMock });

          // wait for init to finish
          await new Promise(process.nextTick);

          // response for domain metadata send
          (channelMock.request as jest.Mock).mockResolvedValueOnce(undefined);
          // response for 'some-method'
          (channelMock.request as jest.Mock).mockResolvedValueOnce('1');
          const rpcResultCallback = jest.fn();
          provider.net_version().then(rpcResultCallback);
          await new Promise(process.nextTick);

          // no domReady happened yet, still only one call sent
          expect(channelMock.request).toHaveBeenCalledTimes(1);

          // domReady triggers sending pending requests as well
          (onDomReady as jest.Mock).mock.calls[0][0]();
          await new Promise(process.nextTick);

          expect(channelMock.request).toHaveBeenCalledTimes(3);
          expect(channelMock.request).toHaveBeenCalledWith({
            method: 'net_version',
          });

          expect(rpcResultCallback).toHaveBeenCalledWith('1');
        });
      });

      describe('close event', () => {
        it('emits close event with error', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const closeSubscription = jest.fn();
          provider.on('close', closeSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(provider._isConnected).toBe(true);
          expect(provider._state.isConnected).toBe(true);
          expect(provider._state.accounts).toStrictEqual(['0x00000']);
          expect(provider.selectedAddress).toStrictEqual('0x00000');

          expect(closeSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'disconnect',
          });

          expect(provider._isConnected).toBe(false);
          expect(provider._state.isConnected).toBe(false);
          expect(provider._state.accounts).toBe(null);
          expect(provider.selectedAddress).toBe(null);

          expect(closeSubscription).toHaveBeenCalledTimes(1);
          expect(closeSubscription).toHaveBeenCalledWith(
            ethErrors.provider.disconnected()
          );
        });
      });

      describe('networkChanged event', () => {
        it('does not emit `networkChanged` on initialization', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const networkChangedSubscription = jest.fn();
          provider.addListener('networkChanged', networkChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(networkChangedSubscription).not.toHaveBeenCalled();
        });

        it('emits `networkChanged` when gets connected to a chain later', async () => {
          (channelMock.request as jest.Mock).mockReset();
          (channelMock.request as jest.Mock).mockResolvedValue({
            isUnlocked: true,
            chainId: '0x0',
            networkVersion: 'loading',
            accounts: ['0x00000'],
          });
          const provider = new CoreProvider({ connection: channelMock });
          const networkChangedSubscription = jest.fn();
          provider.addListener('networkChanged', networkChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(networkChangedSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x1', networkVersion: '1' },
          });
          expect(networkChangedSubscription).toHaveBeenCalledTimes(1);
          expect(networkChangedSubscription).toHaveBeenCalledWith('1');
        });

        it('does not emit `networkChanged` when chain is set to the same value', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const networkChangedSubscription = jest.fn();
          provider.addListener('networkChanged', networkChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(networkChangedSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x1', networkVersion: '1' },
          });
          expect(networkChangedSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x1', networkVersion: '1' },
          });
          expect(networkChangedSubscription).not.toHaveBeenCalled();
        });

        it('emits `chainChanged` when chain is set to new value', async () => {
          const provider = new CoreProvider({ connection: channelMock });
          const networkChangedSubscription = jest.fn();
          provider.addListener('networkChanged', networkChangedSubscription);

          // wait for init to finish
          await new Promise(process.nextTick);

          expect(networkChangedSubscription).not.toHaveBeenCalled();

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x2', networkVersion: '2' },
          });
          expect(networkChangedSubscription).toHaveBeenCalledTimes(1);
          expect(networkChangedSubscription).toHaveBeenCalledWith('2');

          (channelMock.on as jest.Mock).mock.calls[0][1]({
            method: 'chainChanged',
            params: { chainId: '0x1', networkVersion: '1' },
          });
          expect(networkChangedSubscription).toHaveBeenCalledTimes(2);
          expect(networkChangedSubscription).toHaveBeenCalledWith('1');
        });
      });
    });
  });

  describe('init', () => {
    it('waits for message channel to be connected', async () => {
      const mockedChannel = new AutoPairingPostMessageConnection(false);
      let resolve;
      const promise = new Promise<void>((res) => {
        resolve = res;
      });

      jest.mocked(mockedChannel.connect).mockReturnValue(promise);

      new CoreProvider({ connection: mockedChannel });
      expect(mockedChannel.connect).toHaveBeenCalled();
      expect(mockedChannel.request).not.toHaveBeenCalled();

      resolve();
      await new Promise(process.nextTick);
      expect(mockedChannel.request).toHaveBeenCalled();
    });

    it('loads provider state from the background', async () => {
      const mockedChannel = new AutoPairingPostMessageConnection(false);

      jest.mocked(mockedChannel.connect).mockResolvedValueOnce(undefined);
      (mockedChannel.request as jest.Mock).mockResolvedValueOnce({
        isUnlocked: true,
        chainId: '0x1',
        networkVersion: '1',
        accounts: ['0x00000'],
      });
      const provider = new CoreProvider({ connection: mockedChannel });
      const initializedSubscription = jest.fn();
      provider.addListener('_initialized', initializedSubscription);
      await new Promise(process.nextTick);

      expect(mockedChannel.request).toHaveBeenCalledTimes(1);
      expect(mockedChannel.request).toHaveBeenCalledWith({
        method: DAppProviderRequest.INIT_DAPP_STATE,
      });

      await new Promise(process.nextTick);
      expect(provider._isUnlocked).toBe(true);
      expect(provider._state.isUnlocked).toBe(true);
      expect(provider._state.accounts).toStrictEqual(['0x00000']);
      expect(provider.chainId).toBe('0x1');
      expect(provider.networkVersion).toBe('1');
      expect(provider._initialized).toBe(true);
      expect(provider._state.initialized).toBe(true);
      expect(provider._isReady).toBe(true);
      expect(initializedSubscription).toHaveBeenCalledTimes(1);
    });
  });

  describe('Metamask compatibility', () => {
    it('supports _metamask.isUnlocked', async () => {
      const provider = new CoreProvider({ connection: channelMock });

      expect(await provider._metamask.isUnlocked()).toBe(false);

      // wait for init to finish
      await new Promise(process.nextTick);
      expect(await provider._metamask.isUnlocked()).toBe(true);
    });
    it('isMetamask is true', () => {
      const provider = new CoreProvider({ connection: channelMock });
      expect(provider.isMetaMask).toBe(true);
    });
    it('isAvalanche is true', async () => {
      const provider = new CoreProvider({ connection: channelMock });
      expect(provider.isAvalanche).toBe(true);
    });
  });
});
