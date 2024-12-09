import { serializeToJSON } from '@src/background/serialization/serialize';
import PortConnection from './PortConnection';

describe('background/providers/utils/PortConnection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const portMock = {
    disconnect: jest.fn(),
    postMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
    onDisconnect: {
      addListener: jest.fn(),
    },
  };

  it('disconnects from port', () => {
    const connection = new PortConnection(portMock as any);

    expect(portMock.disconnect).not.toHaveBeenCalled();

    connection.dispose();

    expect(portMock.disconnect).toHaveBeenCalledTimes(1);
  });

  it('subscribes for disconnect events and emits `disconnect` event', () => {
    const connection = new PortConnection(portMock as any);

    const callback = jest.fn();
    connection.addListener('disconnect', callback);

    expect(portMock.onDisconnect.addListener).toHaveBeenCalledTimes(1);
    portMock.onDisconnect.addListener.mock.calls[0]?.[0]();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('emits recevied messages after connection', () => {
    const connection = new PortConnection(portMock as any);

    const callback = jest.fn();
    connection.addListener('message', callback);

    expect(portMock.onMessage.addListener).not.toHaveBeenCalled();

    connection.connect();

    expect(portMock.onMessage.addListener).toHaveBeenCalledTimes(1);
    portMock.onMessage.addListener.mock.calls[0]?.[0](
      serializeToJSON({
        type: 'message',
        data: 'mock-message',
      }),
    );

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('mock-message');
  });

  it('sends messages through the connection', () => {
    const connection = new PortConnection(portMock as any);

    expect(portMock.postMessage).not.toHaveBeenCalled();

    connection.message('message-data');

    expect(portMock.postMessage).toHaveBeenCalledTimes(1);
    expect(portMock.postMessage).toHaveBeenCalledWith(
      serializeToJSON({
        type: 'message',
        data: 'message-data',
      }),
    );
  });

  it('serializes the message', () => {
    const connection = new PortConnection(portMock as any);

    expect(portMock.postMessage).not.toHaveBeenCalled();

    connection.message({ value: 1000n });

    expect(portMock.postMessage).toHaveBeenCalledTimes(1);
    expect(portMock.postMessage).toHaveBeenCalledWith(
      serializeToJSON({
        type: 'message',
        data: {
          value: {
            type: 'BigInt',
            value: '1000',
          },
        },
      }),
    );
  });
});
