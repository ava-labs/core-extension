import { createHash, Hash } from 'crypto';
import { sendRequest } from './sendRequest';
import verifyChallenge from './verifyChallenge';

jest.mock('./sendRequest');
jest.mock('crypto');

describe('verifyChallenge', () => {
  const realFetch = global.fetch;

  const params = {
    challengeId: 'challengeId',
    path: 'path',
    nonce: 'nonce',
  };

  const fileResponseMock = {
    ok: true,
    arrayBuffer: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();

    jest
      .mocked(fileResponseMock.arrayBuffer)
      .mockResolvedValue(Buffer.from('test', 'utf-8'));
    jest
      .mocked(global.fetch)
      .mockResolvedValue(fileResponseMock as unknown as Response);

    jest
      .mocked(createHash)
      .mockImplementationOnce(
        () =>
          ({
            update: jest.fn().mockReturnValueOnce({
              digest: jest.fn().mockReturnValue('checksum'),
            }),
          }) as unknown as Hash,
      )
      .mockImplementationOnce(
        () =>
          ({
            update: jest.fn().mockReturnValueOnce({
              digest: jest.fn().mockReturnValue('solution'),
            }),
          }) as unknown as Hash,
      );
  });

  afterAll(() => {
    global.fetch = realFetch;
  });

  it('throws when challenge verification fails', async () => {
    jest.mocked(sendRequest).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'internal error',
    } as Response);

    await expect(verifyChallenge(params)).rejects.toThrow(
      '[AppCheck] challenge verification error "verification failed with status 500: internal error"',
    );

    expect(sendRequest).toHaveBeenCalledWith({
      path: 'v2/ext/verify',
      payload: {
        challengeId: 'challengeId',
        solution: 'solution',
      },
      timeout: 10_000,
    });
  });

  it('verifies challenge successfully', async () => {
    const appcheckResponseMock = { foo: 'bar' };

    jest.mocked(sendRequest).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(appcheckResponseMock),
    } as Response);

    await expect(verifyChallenge(params)).resolves.toStrictEqual(
      appcheckResponseMock,
    );

    expect(sendRequest).toHaveBeenCalledWith({
      path: 'v2/ext/verify',
      payload: {
        challengeId: 'challengeId',
        solution: 'solution',
      },
      timeout: 10_000,
    });
  });
});
