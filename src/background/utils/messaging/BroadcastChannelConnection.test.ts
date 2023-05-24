import BroadcastChannelConnection from './BroadcastChannelConnection';

describe('background/providers/utils/BroadcastChannelConnection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates broadcast channel with correct name', () => {
    new BroadcastChannelConnection('test-channel');

    expect(BroadcastChannel).toHaveBeenCalledTimes(1);
    expect(BroadcastChannel).toHaveBeenCalledWith('test-channel');
  });

  it('starts listening on messages after connect', () => {
    const bcc = new BroadcastChannelConnection('');
    const bcMock: BroadcastChannel = (
      BroadcastChannel as jest.Mock<BroadcastChannel>
    ).mock.results.pop()?.value;

    expect(bcMock.onmessage).toBeNull();

    bcc.connect();

    expect(bcMock.onmessage).not.toBeNull();
  });

  it('disconnects from broadcast channel', () => {
    const bcc = new BroadcastChannelConnection('');
    const bcMock: BroadcastChannel = (
      BroadcastChannel as jest.Mock<BroadcastChannel>
    ).mock.results.pop()?.value;
    bcc.connect();

    bcc.dispose();

    expect(bcMock.close).toHaveBeenCalledTimes(1);
  });

  it('sends messages through the connection', () => {
    const bcc = new BroadcastChannelConnection('');
    const bcMock: BroadcastChannel = (
      BroadcastChannel as jest.Mock<BroadcastChannel>
    ).mock.results.pop()?.value;

    expect(bcMock.postMessage).not.toHaveBeenCalled();

    bcc.message('message-data');

    expect(bcMock.postMessage).toHaveBeenCalledTimes(1);
    expect(bcMock.postMessage).toHaveBeenCalledWith({
      type: 'message',
      data: 'message-data',
    });
  });
});
