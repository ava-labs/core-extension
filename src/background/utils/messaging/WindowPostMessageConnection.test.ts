import WindowPostMessageConnection from './WindowPostMessageConnection';

describe('background/providers/utils/WindowPostMessageConnection', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...originalLocation,
      origin: 'core.app',
    });
  });

  afterEach(() => {
    window.location = originalLocation;
    jest.clearAllMocks();
  });

  it('starts listening on messages after connect', () => {
    const connection = new WindowPostMessageConnection('');

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    expect(addEventListenerSpy).not.toHaveBeenCalled();

    connection.connect();

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    );
  });

  it('disconnects from messaging channel', () => {
    const connection = new WindowPostMessageConnection('');
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    connection.connect();

    connection.dispose();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    // check if same listener is removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      ...(addEventListenerSpy.mock.calls[0] as any)
    );
  });

  it('sends messages through the connection', () => {
    const connection = new WindowPostMessageConnection('connection name');
    const postMessageSpy = jest
      .spyOn(window, 'postMessage')
      .mockImplementation(jest.fn());

    expect(postMessageSpy).not.toHaveBeenCalled();

    connection.message('message-data');

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    expect(postMessageSpy).toHaveBeenCalledWith({
      connectionName: 'connection name',
      message: { type: 'message', data: 'message-data' },
    });
  });

  it('forwards messages to subscriber', () => {
    const connection = new WindowPostMessageConnection('connection name');
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    connection.connect();

    const messageListener = jest.fn();
    connection.addListener('message', messageListener);

    (addEventListenerSpy.mock.calls[0]?.[1] as any)?.({
      origin: 'core.app',
      data: {
        connectionName: 'connection name',
        message: {
          type: 'message',
          data: 'message-data',
        },
      },
    });

    expect(messageListener).toHaveBeenCalledTimes(1);
    expect(messageListener).toHaveBeenCalledWith('message-data');
  });

  it('ignores messages for other connections', () => {
    const connection = new WindowPostMessageConnection('connection name');
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    connection.connect();

    const messageListener = jest.fn();
    connection.addListener('message', messageListener);

    (addEventListenerSpy.mock.calls[0]?.[1] as any)?.({
      data: {
        message: {
          type: 'message',
          data: 'message-data',
        },
      },
    });

    expect(messageListener).not.toHaveBeenCalled();

    (addEventListenerSpy.mock.calls[0]?.[1] as any)?.({
      origin: 'core.app',
      data: {
        connectionName: 'some other connection',
        message: {
          type: 'message',
          data: 'message-data',
        },
      },
    });

    expect(messageListener).not.toHaveBeenCalled();
  });

  it('ignores messages for other origins', () => {
    const connection = new WindowPostMessageConnection('connection name');
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    connection.connect();

    const messageListener = jest.fn();
    connection.addListener('message', messageListener);

    (addEventListenerSpy.mock.calls[0]?.[1] as any)?.({
      origin: 'definitelynotcore.app',
      data: {
        connectionName: 'connection name',
        message: {
          type: 'message',
          data: 'message-data',
        },
      },
    });

    expect(messageListener).not.toHaveBeenCalled();
  });
});
