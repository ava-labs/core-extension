import { ethErrors } from 'eth-rpc-errors';
import AutoPairingPostMessageConnection from '../utils/messaging/AutoPairingPostMessageConnection';
import { ChainAgnosticProvider } from './ChainAgnosticProvider';
import onDomReady from './utils/onDomReady';
import { DAppProviderRequest } from '../connections/dAppConnection/models';

jest.mock('../utils/messaging/AutoPairingPostMessageConnection', () => {
  const mocks = {
    connect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    request: jest.fn().mockResolvedValue({}),
  };
  return jest.fn().mockReturnValue(mocks);
});

export const matchingPayload = (payload) =>
  expect.objectContaining({
    data: expect.objectContaining(payload),
  });

jest.mock('./utils/onDomReady');
jest.mock('../utils/messaging/AutoPairingPostMessageConnection', () => {
  const mocks = {
    connect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    request: jest.fn().mockResolvedValue({}),
  };
  return jest.fn().mockReturnValue(mocks);
});
describe('src/background/providers/ChainAgnosticProvider', () => {
  const channelMock = new AutoPairingPostMessageConnection(false);

  describe('initialization', () => {
    it('should connect to the backgroundscript', async () => {
      new ChainAgnosticProvider(channelMock);

      expect(channelMock.connect).toHaveBeenCalled();
      expect(channelMock.request).not.toHaveBeenCalled();
    });
    it('should wait for message channel to be connected', async () => {
      const mockedChannel = new AutoPairingPostMessageConnection(false);

      const provider = new ChainAgnosticProvider(channelMock);

      await new Promise(process.nextTick);

      (onDomReady as jest.Mock).mock.calls[0][0]();

      expect(mockedChannel.connect).toHaveBeenCalled();
      expect(mockedChannel.request).not.toHaveBeenCalled();

      await provider.request({
        data: { method: 'some-method', params: [{ param1: 1 }] },
        sessionId: '00000000-0000-0000-0000-000000000000',
        scope: '1',
      });
      expect(mockedChannel.request).toHaveBeenCalled();
    });
    it('should call the `DOMAIN_METADATA_METHOD` adter domReady', async () => {
      new ChainAgnosticProvider(channelMock);
      await new Promise(process.nextTick);
      expect(channelMock.request).toHaveBeenCalledTimes(0);
      (onDomReady as jest.Mock).mock.calls[0][0]();
      await new Promise(process.nextTick);

      expect(channelMock.request).toHaveBeenCalledTimes(1);

      expect(channelMock.request).toHaveBeenCalledWith(
        // matchingPayload({
        //   method: DAppProviderRequest.INIT_DAPP_STATE,
        // })
        expect.objectContaining({
          params: expect.objectContaining({
            request: expect.objectContaining({
              method: DAppProviderRequest.DOMAIN_METADATA_METHOD,
            }),
          }),
        }),
      );
    });
  });

  describe('request', () => {
    it('should collect pending requests till the dom is ready', async () => {
      const provider = new ChainAgnosticProvider(channelMock);
      // wait for init to finish
      await new Promise(process.nextTick);

      expect(channelMock.request).toHaveBeenCalledTimes(0);

      (channelMock.request as jest.Mock).mockResolvedValue('success');
      const rpcResultCallback = jest.fn();
      provider
        .request({
          data: {
            method: 'some-method',
            params: [{ param1: 1 }],
          },
        })
        .then(rpcResultCallback);
      await new Promise(process.nextTick);

      expect(channelMock.request).toHaveBeenCalledTimes(0);

      // domReady triggers sending pending requests as well
      (onDomReady as jest.Mock).mock.calls[0][0]();
      await new Promise(process.nextTick);

      expect(channelMock.request).toHaveBeenCalledTimes(2);

      expect(rpcResultCallback).toHaveBeenCalledWith('success');
    });
    it('should use the rate limits on `eth_requestAccounts` requests', async () => {
      const provider = new ChainAgnosticProvider(channelMock);
      (channelMock.request as jest.Mock).mockResolvedValue('success');

      await new Promise(process.nextTick);

      (onDomReady as jest.Mock).mock.calls[0][0]();

      const firstCallCallback = jest.fn();
      const secondCallCallback = jest.fn();
      provider
        .request({
          data: { method: 'eth_requestAccounts' },
        } as any)
        .then(firstCallCallback)
        .catch(firstCallCallback);
      provider
        .request({
          data: { method: 'eth_requestAccounts' },
        } as any)
        .then(secondCallCallback)
        .catch(secondCallCallback);

      await new Promise(process.nextTick);
      expect(firstCallCallback).toHaveBeenCalledWith('success');
      expect(secondCallCallback).toHaveBeenCalledWith(
        ethErrors.rpc.resourceUnavailable(
          `Request of type eth_requestAccounts already pending for origin. Please wait.`,
        ),
      );
    });
    it('shoud not use the rate limits on `random_method` requests', async () => {
      const provider = new ChainAgnosticProvider(channelMock);
      (channelMock.request as jest.Mock).mockResolvedValue('success');

      await new Promise(process.nextTick);

      (onDomReady as jest.Mock).mock.calls[0][0]();

      const firstCallCallback = jest.fn();
      const secondCallCallback = jest.fn();
      provider
        .request({
          data: { method: 'random_method' },
        } as any)
        .then(firstCallCallback)
        .catch(firstCallCallback);
      provider
        .request({
          data: { method: 'random_method' },
        } as any)
        .then(secondCallCallback)
        .catch(secondCallCallback);

      await new Promise(process.nextTick);
      expect(firstCallCallback).toHaveBeenCalledWith('success');
      expect(secondCallCallback).toHaveBeenCalledWith('success');
    });

    it('should call the request of the connection', async () => {
      const provider = new ChainAgnosticProvider(channelMock);
      (channelMock.request as jest.Mock).mockResolvedValueOnce('success');

      await new Promise(process.nextTick);

      (onDomReady as jest.Mock).mock.calls[0][0]();

      await provider.request({
        data: { method: 'some-method', params: [{ param1: 1 }] },
        sessionId: '00000000-0000-0000-0000-000000000000',
        scope: '1',
      });
      expect(channelMock.request).toHaveBeenCalled();
    });
    describe('CAIP-27', () => {
      it('should wrap the incoming request into CAIP-27 envelope and reuses the provided ID', async () => {
        const provider = new ChainAgnosticProvider(channelMock);
        // response for the actual call
        (channelMock.request as jest.Mock).mockResolvedValueOnce('success');

        await new Promise(process.nextTick);

        (onDomReady as jest.Mock).mock.calls[0][0]();

        provider.request({
          data: { method: 'some-method', params: [{ param1: 1 }] },
          sessionId: '00000000-0000-0000-0000-000000000000',
          scope: 'eip155:1',
        });

        await new Promise(process.nextTick);

        expect(channelMock.request).toHaveBeenCalledWith({
          jsonrpc: '2.0',
          method: 'provider_request',
          params: {
            scope: 'eip155:1',
            sessionId: '00000000-0000-0000-0000-000000000000',
            request: {
              method: 'some-method',
              params: [{ param1: 1 }],
            },
          },
        });
      });
    });
  });
});
