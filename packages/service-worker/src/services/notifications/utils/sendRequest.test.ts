import { container } from 'tsyringe';
import { sendRequest } from './sendRequest';

describe('sendRequest', () => {
  const realEnv = process.env;
  const realFetch = global.fetch;
  const appCheckTokenMock = 'appCheckTokenMock';

  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(container, 'resolve').mockReturnValue({
      getAppcheckToken: jest
        .fn()
        .mockResolvedValue({ token: appCheckTokenMock }),
    });

    global.fetch = jest.fn();
    process.env = {
      ...realEnv,
      NOTIFICATION_SENDER_SERVICE_URL: 'https://test.com',
    };
  });

  afterAll(() => {
    global.fetch = realFetch;
    process.env = realEnv;
  });

  it('should throw an error when NOTIFICATION_SENDER_SERVICE_URL is missing', async () => {
    delete process.env.NOTIFICATION_SENDER_SERVICE_URL;

    await expect(sendRequest({ path: 'foo', payload: {} })).rejects.toThrow(
      'Missing environment variable "NOTIFICATION_SENDER_SERVICE_URL"',
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should throw an error when appCheckToken is missing', async () => {
    jest.mocked(container.resolve).mockReturnValueOnce({
      getAppcheckToken: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(sendRequest({ path: 'foo', payload: {} })).rejects.toThrow(
      'Error while sending request to "foo": Missing appCheckToken',
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should throw an error when the request fails', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: jest.fn().mockResolvedValue('Invalid payload'),
    } as unknown as Response);

    await expect(sendRequest({ path: 'foo', payload: {} })).rejects.toThrow(
      'Error while sending request to "foo": 400 Bad Request - Invalid payload',
    );
  });

  it('should return the response when the request is successful', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ foo: 'bar' }),
    } as unknown as Response);

    const result = await sendRequest({ path: 'foo', payload: {} });

    expect(result).toEqual({ foo: 'bar' });
  });
});
