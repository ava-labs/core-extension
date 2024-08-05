import { ethErrors } from 'eth-rpc-errors';
import AutoPairingPostMessageConnection from '../utils/messaging/AutoPairingPostMessageConnection';
import { ChainAgnosticProvider } from './ChainAgnosticProvider';

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
    it('waits for message channel to be connected', async () => {
      const mockedChannel = new AutoPairingPostMessageConnection(false);

      const provider = new ChainAgnosticProvider(channelMock);
      expect(mockedChannel.connect).toHaveBeenCalled();
      expect(mockedChannel.request).not.toHaveBeenCalled();

      await provider.request({
        data: { method: 'some-method', params: [{ param1: 1 }] },
        sessionId: '00000000-0000-0000-0000-000000000000',
        chainId: '1',
      });
      expect(mockedChannel.request).toHaveBeenCalled();
    });
  });

  describe('request', () => {
    it('should use the rate limits on `eth_requestAccounts` requests', async () => {
      const provider = new ChainAgnosticProvider(channelMock);
      (channelMock.request as jest.Mock).mockResolvedValue('success');

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
          `Request of type eth_requestAccounts already pending for origin. Please wait.`
        )
      );
    });
    it('shoud not use the rate limits on `random_method` requests', async () => {
      const provider = new ChainAgnosticProvider(channelMock);
      (channelMock.request as jest.Mock).mockResolvedValue('success');

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

      await provider.request({
        data: { method: 'some-method', params: [{ param1: 1 }] },
        sessionId: '00000000-0000-0000-0000-000000000000',
        chainId: '1',
      });
      expect(channelMock.request).toHaveBeenCalled();
    });
    describe('CAIP-27', () => {
      it('should wrap the incoming request into CAIP-27 envelope and reuses the provided ID', async () => {
        const provider = new ChainAgnosticProvider(channelMock);
        // response for the actual call
        (channelMock.request as jest.Mock).mockResolvedValueOnce('success');

        provider.request({
          data: { method: 'some-method', params: [{ param1: 1 }] },
          sessionId: '00000000-0000-0000-0000-000000000000',
          chainId: '1',
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
