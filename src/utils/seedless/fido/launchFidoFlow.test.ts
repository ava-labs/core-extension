import { windows } from 'webextension-polyfill';

import { openPopup } from '@src/utils/extensionUtils';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

import { FIDOApiEndpoint, KeyType } from './types';
import { launchFidoFlow } from './launchFidoFlow';
import { convertRequest } from './convertRequest';
import { convertResult } from './convertResult';

jest.mock('webextension-polyfill', () => {
  const actual = jest.requireActual('webextension-polyfill');

  return {
    ...actual,
    windows: {
      ...actual.windows,
      onRemoved: {
        addListener: jest.fn(),
      },
      onFocusChanged: {
        addListener: jest.fn(),
      },
      remove: jest.fn(),
    },
  };
});
jest.mock('@src/monitoring/sentryCaptureException');
jest.mock('../../extensionUtils');
jest.mock('./convertRequest');

describe('src/utils/seedless/fido/launchFidoFlow', () => {
  const env = process.env;
  const baseUrl = 'https://fido-identity.core.app';
  const origin = 'chrome-extension://extension-id';
  const originalLocation = window.location;

  const popupId = 'popup-123';
  let popup, popupSubscription;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...env,
      SEEDLESS_FIDO_IDENTITY_URL: baseUrl,
    };

    jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ ...originalLocation, origin });

    popupSubscription = {
      unsubscribe: jest.fn(),
    };
    popup = {
      id: popupId,
      removed: {
        subscribe: jest.fn().mockReturnValue(popupSubscription),
      },
    };
    jest.mocked(openPopup).mockResolvedValueOnce(popup);
  });

  afterEach(() => {
    process.env = env;
  });

  it('throws an error if SEEDLESS_FIDO_IDENTITY_URL is not configured', async () => {
    process.env.SEEDLESS_FIDO_IDENTITY_URL = '';

    await expect(
      launchFidoFlow(FIDOApiEndpoint.Authenticate, {} as any)
    ).rejects.toThrow(new Error('FIDO Identity Service URL is not configured'));
  });

  it('throws an error if keyType is not provided for Register request', async () => {
    await expect(
      launchFidoFlow(FIDOApiEndpoint.Register, {} as any)
    ).rejects.toThrow(
      new Error('FIDO key type not defined for registration request')
    );
  });

  it('throws an error if given endpoint is not supported', async () => {
    jest.mocked(convertRequest).mockImplementationOnce(() => {
      throw new Error('Unsupported FIDO identity endpoint');
    });

    await expect(
      launchFidoFlow('this-does-not-work' as FIDOApiEndpoint, {} as any)
    ).rejects.toThrow(new Error('Unsupported FIDO identity endpoint'));
  });

  it('opens popup with the right URL & opener options', async () => {
    const request = { some: 'request' } as any;

    jest.mocked(convertRequest).mockReturnValueOnce(JSON.stringify(request));

    const url = `${baseUrl}/register?responseMode=post-message&origin=${encodeURIComponent(
      origin
    )}&options=${encodeURIComponent(JSON.stringify(request))}&keyType=yubikey`;

    launchFidoFlow(FIDOApiEndpoint.Register, request, KeyType.Yubikey);

    await new Promise(process.nextTick);

    expect(openPopup).toHaveBeenCalledWith({
      url,
      setSelfAsOpener: true,
      right: 70,
    });
  });

  it('closes the popup if the calling window gets closed', async () => {
    jest.spyOn(windows, 'remove');

    launchFidoFlow(FIDOApiEndpoint.Authenticate, {} as any);

    await new Promise(process.nextTick);

    window.dispatchEvent(new Event('beforeunload'));

    expect(windows.remove).toHaveBeenCalledWith(popupId);
  });

  it('raises an error if popup is closed prematurely', async () => {
    const promise = launchFidoFlow(FIDOApiEndpoint.Authenticate, {} as any);

    await new Promise(process.nextTick);

    const callback = popup.removed.subscribe.mock.calls[0][0];

    await callback();

    await expect(promise).rejects.toThrow('Popup closed');
  });

  it('waits for a valid response from valid origin', async () => {
    const promise = launchFidoFlow(FIDOApiEndpoint.Authenticate, {} as any);

    await new Promise(process.nextTick);

    // This spy is supposed to be called after we receive a successful response
    const completionSpy = jest.fn();
    promise.then(completionSpy);

    const messageInvalidOrigin = {
      origin: 'http://evil.com',
    };
    const messageInvalidPayload = {
      origin: baseUrl,
      data: JSON.stringify({ hehe: 'nope' }),
    };
    const validMessage = {
      origin: baseUrl,
      data: JSON.stringify({
        id: 'id',
        rawId: 'rawId',
        type: 'type',
        response: {
          authenticatorData: 'authenticatorData',
          clientDataJSON: 'clientDataJSON',
          signature: 'signature',
          userHandle: 'userHandle',
        },
      }),
    };

    window.dispatchEvent(new MessageEvent('message', messageInvalidOrigin));
    await new Promise(process.nextTick);
    expect(completionSpy).not.toHaveBeenCalled();

    window.dispatchEvent(new MessageEvent('message', messageInvalidPayload));
    await new Promise(process.nextTick);
    expect(completionSpy).not.toHaveBeenCalled();

    window.dispatchEvent(new MessageEvent('message', validMessage));
    await new Promise(process.nextTick);
    expect(completionSpy).toHaveBeenCalledWith(
      convertResult(JSON.parse(validMessage.data))
    );
  });

  it('reports invalid response errors to Sentry', async () => {
    jest.spyOn(windows, 'remove');

    launchFidoFlow(FIDOApiEndpoint.Authenticate, {} as any);
    await new Promise(process.nextTick);

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: baseUrl,
        data: JSON.stringify({ hehe: 'nope' }),
      })
    );
    await new Promise(process.nextTick);

    expect(sentryCaptureException).toHaveBeenCalledWith(
      new Error('Invalid Identity API response: "id" is required'),
      SentryExceptionTypes.SEEDLESS
    );
  });

  it('closes the popup after a valid response', async () => {
    jest.spyOn(windows, 'remove');

    launchFidoFlow(FIDOApiEndpoint.Authenticate, {} as any);
    await new Promise(process.nextTick);

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: baseUrl,
        data: JSON.stringify({
          id: 'id',
          rawId: 'rawId',
          type: 'type',
          response: {
            authenticatorData: 'authenticatorData',
            clientDataJSON: 'clientDataJSON',
            signature: 'signature',
            userHandle: 'userHandle',
          },
        }),
      })
    );
    await new Promise(process.nextTick);

    expect(windows.remove).toHaveBeenCalledWith(popupId);
  });
});
