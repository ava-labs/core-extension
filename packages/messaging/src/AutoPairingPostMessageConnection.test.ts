import { AutoPairingPostMessageConnection } from './AutoPairingPostMessageConnection';

describe('background/providers/utils/AutoPairingPostMessageConnection', () => {
  const originalLocation = window.location;
  let postMessageSpy;

  beforeEach(() => {
    postMessageSpy = jest
      .spyOn(window, 'postMessage')
      .mockImplementation(jest.fn());
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...originalLocation,
      origin: 'core.app',
    });
  });

  afterEach(() => {
    (window as any).location = originalLocation;
    jest.clearAllMocks();
  });

  it('automatically emits connection id in leader mode', () => {
    new AutoPairingPostMessageConnection(true);

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        message: {
          connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
          type: 'initialize-post-message-connection',
        },
      },
      'core.app',
    );
  });

  it('ignores unkown messages', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    new AutoPairingPostMessageConnection(true);

    // starts listening on connection ID request messages
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          type: 'some message',
        },
      },
    });

    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: {
        someProp: 'totallydifferentformat',
      },
    });

    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: undefined,
    });

    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'cross-origin.app',
      data: {
        message: {
          type: 'initialize-post-message-connection',
        },
      },
    });

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
  });

  it('emits connection id in leader mode when requested', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    new AutoPairingPostMessageConnection(true);

    // starts listening on connection ID request messages
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          type: 'initialize-post-message-connection-request',
        },
      },
    });

    expect(postMessageSpy).toHaveBeenCalledTimes(2);
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        message: {
          connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
          type: 'initialize-post-message-connection',
        },
      },
      'core.app',
    );
  });

  it('requests connection id from any available leader immediately', () => {
    new AutoPairingPostMessageConnection(false);

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        message: {
          type: 'initialize-post-message-connection-request',
        },
      },
      'core.app',
    );
  });

  it('updates connection id when a new one is introduced', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const connection = new AutoPairingPostMessageConnection(false);
    const messageListener = jest.fn();
    connection.addListener('message', messageListener);

    // starts listening on connection ID messages
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    connection.connect();

    // added the event handler after connection
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);

    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
          type: 'initialize-post-message-connection',
        },
      },
    });

    // should let message through after connection pairing
    (addEventListenerSpy.mock.calls[1]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          type: 'message',
          data: {
            something: 1,
          },
        },
        connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
      },
    });
    expect(messageListener).toHaveBeenCalledTimes(1);
    expect(messageListener).toHaveBeenCalledWith({
      something: 1,
    });

    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          connectionId: 'PM-Connection-00000000-0000-0000-0000-111111111111',
          type: 'initialize-post-message-connection',
        },
      },
    });

    // should let message through after connection pairing
    (addEventListenerSpy.mock.calls[1]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          type: 'message',
          data: {
            something: 1,
          },
        },
        connectionId: 'PM-Connection-00000000-0000-0000-0000-111111111111',
      },
    });
    expect(messageListener).toHaveBeenCalledTimes(2);
  });

  it('starts handling messages only after receiving a connectionId', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const connection = new AutoPairingPostMessageConnection(false);
    const messageListener = jest.fn();
    connection.addListener('message', messageListener);

    // starts listening on connection ID messages
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    connection.connect();

    // added the event handler after connection
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);

    (addEventListenerSpy.mock.calls[1]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          type: 'message',
          data: {
            something: 1,
          },
        },
        connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
      },
    });

    // messages are ingnored till conneciton ID is received
    expect(messageListener).not.toHaveBeenCalled();

    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
          type: 'initialize-post-message-connection',
        },
      },
    });

    // should let message through after connection pairing
    (addEventListenerSpy.mock.calls[1]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          type: 'message',
          data: {
            something: 1,
          },
        },
        connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
      },
    });
    expect(messageListener).toHaveBeenCalledTimes(1);
    expect(messageListener).toHaveBeenCalledWith({
      something: 1,
    });
  });

  it('ignores messages for other connection Ids and origins', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const connection = new AutoPairingPostMessageConnection(false);
    const messageListener = jest.fn();
    connection.addListener('message', messageListener);

    // starts listening on connection ID messages
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    connection.connect();

    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
          type: 'initialize-post-message-connection',
        },
      },
    });

    // ignores message with different connection ID
    (addEventListenerSpy.mock.calls[1]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          type: 'message',
          data: {
            something: 1,
          },
        },
        connectionId: 'PM-Connection-00000000-0000-0000-0000-111111111111',
      },
    });
    expect(messageListener).not.toHaveBeenCalled();

    // ignores message with different origin
    (addEventListenerSpy.mock.calls[1]?.[1] as any)({
      origin: 'someother.app',
      data: {
        message: {
          type: 'message',
          data: {
            something: 1,
          },
        },
        connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
      },
    });
    expect(messageListener).not.toHaveBeenCalled();

    // ignores message with no origin
    (addEventListenerSpy.mock.calls[1]?.[1] as any)({
      origin: 'null',
      data: {
        message: {
          type: 'message',
          data: {
            something: 1,
          },
        },
        connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
      },
    });
    expect(messageListener).not.toHaveBeenCalled();

    // ignores message with different format
    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: {
        someProp: 'totallydifferentformat',
      },
    });
    expect(messageListener).not.toHaveBeenCalled();

    // ignores message with no data
    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: undefined,
    });
    expect(messageListener).not.toHaveBeenCalled();

    // lets correct messages through
    (addEventListenerSpy.mock.calls[1]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          type: 'message',
          data: {
            something: 1,
          },
        },
        connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
      },
    });
    expect(messageListener).toHaveBeenCalledTimes(1);
    expect(messageListener).toHaveBeenCalledWith({
      something: 1,
    });
  });

  it('starts listening on messages after connect', () => {
    const connection = new AutoPairingPostMessageConnection(false);

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    connection.connect().catch(jest.fn());

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
    );

    // clean up pending promise
    connection.dispose();
  });

  it('sends messages through the connection after connected', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const connection = new AutoPairingPostMessageConnection(false);

    // called with broadcast ID request
    expect(postMessageSpy).toHaveBeenCalledTimes(1);

    connection.message('message-data');
    expect(postMessageSpy).toHaveBeenCalledTimes(1);

    connection.connect();
    (addEventListenerSpy.mock.calls[0]?.[1] as any)({
      origin: 'core.app',
      data: {
        message: {
          connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
          type: 'initialize-post-message-connection',
        },
      },
    });

    connection.message('message-data');

    expect(postMessageSpy).toHaveBeenCalledTimes(2);
    expect(postMessageSpy).toHaveBeenCalledWith({
      connectionId: 'PM-Connection-00000000-0000-0000-0000-000000000000',
      message: { type: 'message', data: 'message-data' },
    });
  });

  it('disconnects from messaging channel', async () => {
    const connection = new AutoPairingPostMessageConnection(false);
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const connectReadySpy = jest.fn();
    const connectRejectSpy = jest.fn();
    connection.connect().then(connectReadySpy).catch(connectRejectSpy);

    connection.dispose();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    // check if same listener is removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      ...(addEventListenerSpy.mock.calls[1] as any),
    );

    await new Promise(process.nextTick);

    expect(connectRejectSpy).toHaveBeenCalled();
    expect(connectReadySpy).not.toHaveBeenCalled();
  });
});
