import { ExtensionRequest } from '@core/types';
import { LedgerEvent } from '@core/types';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  cleanup,
} from '@shared/tests/test-utils';
import React, { useState } from 'react';
import { Subject } from 'rxjs';
import { useConnectionContext } from '../ConnectionProvider';
import { LedgerAppType, LedgerContextProvider, useLedgerContext } from '.';
import { StatusCodes } from '@ledgerhq/hw-transport';
import { getLedgerTransport } from '../utils/getLedgerTransport';
import AppAvalanche from '@avalabs/hw-app-avalanche';
import {
  AppClient as Btc,
  DefaultWalletPolicy,
  WalletPolicy,
} from 'ledger-bitcoin';
import {
  DerivationPath,
  getLedgerAppInfo,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
  quitLedgerApp,
} from '@avalabs/core-wallets-sdk';
import { LockEvents } from '@core/types';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Eth from '@ledgerhq/hw-app-eth';
import Solana from '@ledgerhq/hw-app-solana';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { shouldUseWebHID } from '../utils/shouldUseWebHID';

jest.mock('../ConnectionProvider', () => {
  const connectionFunctions = {
    request: jest.fn(),
    events: jest.fn(),
  };
  return {
    useConnectionContext: () => connectionFunctions,
  };
});

jest.mock('@avalabs/core-wallets-sdk');
jest.mock('@avalabs/hw-app-avalanche');
jest.mock('@ledgerhq/hw-app-eth');
jest.mock('@ledgerhq/hw-app-solana');
jest.mock('ledger-bitcoin');
jest.mock('@ledgerhq/hw-transport-webusb');
jest.mock('@ledgerhq/hw-transport-webhid');
jest.mock('../utils/getLedgerTransport');
jest.mock('../utils/shouldUseWebHID');

const TestComponent = ({ methodParams }) => {
  const {
    initLedgerTransport,
    hasLedgerTransport,
    wasTransportAttempted,
    appType,
    avaxAppVersion,
    ledgerVersionWarningClosed,
    getExtendedPublicKey,
    getPublicKey,
    popDeviceSelection,
    getMasterFingerprint,
    closeCurrentApp,
    getBtcExtendedPublicKey,
    registerBtcWalletPolicy,
    updateLedgerVersionWarningClosed,
  } = useLedgerContext();

  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<unknown | undefined>();
  const methods = {
    initLedgerTransport,
    getExtendedPublicKey,
    getPublicKey,
    popDeviceSelection,
    getMasterFingerprint,
    closeCurrentApp,
    getBtcExtendedPublicKey,
    registerBtcWalletPolicy,
    updateLedgerVersionWarningClosed,
  };

  return (
    <>
      {Object.keys(methods).map((method) => (
        <button
          key={method}
          data-testid={method}
          onClick={async () => {
            try {
              setResult(await methods[method](...methodParams));
            } catch (err) {
              setError((err as Error).message);
            }
          }}
        >
          {method}
        </button>
      ))}

      <span data-testid="error">{`${error}`}</span>
      <span data-testid="result">{`${result}`}</span>

      <span data-testid="wasTransportAttempted">{`${wasTransportAttempted}`}</span>
      <span data-testid="hasLedgerTransport">{`${hasLedgerTransport}`}</span>
      <span data-testid="appType">{appType}</span>
      <span data-testid="avaxAppVersion">{avaxAppVersion}</span>
      <span data-testid="ledgerVersionWarningClosed">
        {`${ledgerVersionWarningClosed}`}
      </span>
    </>
  );
};

const renderTestComponent = (...args: unknown[]) => {
  return render(
    <LedgerContextProvider>
      <TestComponent methodParams={args}></TestComponent>
    </LedgerContextProvider>,
  );
};

describe('src/contexts/LedgerProvider.tsx', () => {
  const refMock = {
    send: jest.fn(),
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    const connectionMocks = useConnectionContext();
    (connectionMocks.request as jest.Mock).mockResolvedValue(undefined);
    (connectionMocks.events as jest.Mock).mockReturnValue(new Subject());
    jest.mocked(shouldUseWebHID).mockResolvedValue(false);

    jest.spyOn(React, 'useRef').mockReturnValue({
      current: refMock,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('event sending to ledger', () => {
    it('does not forward non-transport requests', async () => {
      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderTestComponent();

      eventSubject.next({
        name: 'some-non-transport-event',
        value: {},
      });

      await waitFor(() => {
        expect(refMock.send).not.toHaveBeenCalled();
        expect(connectionMocks.request).not.toHaveBeenCalledWith(
          expect.objectContaining({
            method: ExtensionRequest.LEDGER_RESPONSE,
          }),
        );
      });
    });

    it('does not forward requests upon instance ID missmatch', async () => {
      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderTestComponent();

      eventSubject.next({
        name: LedgerEvent.TRANSPORT_REQUEST,
        value: {
          connectionUUID: '1',
        },
      });

      await waitFor(() => {
        expect(refMock.send).not.toHaveBeenCalled();
        expect(connectionMocks.request).not.toHaveBeenCalledWith(
          expect.objectContaining({
            method: ExtensionRequest.LEDGER_RESPONSE,
          }),
        );
      });
    });

    it('forwards response errors properly', async () => {
      const error = new Error('some error');
      refMock.send.mockRejectedValueOnce(error);

      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderTestComponent();

      eventSubject.next({
        name: LedgerEvent.TRANSPORT_REQUEST,
        value: {
          requestId: '1',
          connectionUUID: '00000000-0000-0000-0000-000000000000',
          method: 'SEND',
          params: {
            cla: 1,
            ins: 2,
            p1: 3,
            p2: 4,
            data: '0x1',
            statusList: [StatusCodes.OK],
          },
        },
      });

      await waitFor(() => {
        expect(refMock.send).toHaveBeenCalledWith(
          1,
          2,
          3,
          4,
          Buffer.from('0x1'),
          [StatusCodes.OK],
        );
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_RESPONSE,
          params: [
            {
              requestId: '1',
              method: 'SEND',
              error: error.message,
            },
          ],
        });
      });
    });
    it('forwards errors with statusCode', async () => {
      const error = {
        statusCode: 0x123,
      };
      refMock.send.mockRejectedValueOnce(error);

      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderTestComponent();

      eventSubject.next({
        name: LedgerEvent.TRANSPORT_REQUEST,
        value: {
          requestId: '1',
          connectionUUID: '00000000-0000-0000-0000-000000000000',
          method: 'SEND',
          params: {
            cla: 1,
            ins: 2,
            p1: 3,
            p2: 4,
            data: '0x1',
            statusList: [StatusCodes.OK],
          },
        },
      });

      await waitFor(() => {
        expect(refMock.send).toHaveBeenCalledWith(
          1,
          2,
          3,
          4,
          Buffer.from('0x1'),
          [StatusCodes.OK],
        );
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_RESPONSE,
          params: [
            {
              requestId: '1',
              method: 'SEND',
              error: error.statusCode,
            },
          ],
        });
      });
    });

    it('forwards responses properly', async () => {
      const result = { foo: 'bar' };
      refMock.send.mockResolvedValueOnce(result);

      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderTestComponent();

      eventSubject.next({
        name: LedgerEvent.TRANSPORT_REQUEST,
        value: {
          requestId: '1',
          connectionUUID: '00000000-0000-0000-0000-000000000000',
          method: 'SEND',
          params: {
            cla: 1,
            ins: 2,
            p1: 3,
            p2: 4,
            data: '0x1',
            statusList: [StatusCodes.OK],
          },
        },
      });

      await waitFor(() => {
        expect(refMock.send).toHaveBeenCalledWith(
          1,
          2,
          3,
          4,
          Buffer.from('0x1'),
          [StatusCodes.OK],
        );
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_RESPONSE,
          params: [
            {
              requestId: '1',
              method: 'SEND',
              result,
            },
          ],
        });
      });
    });
  });

  describe('transport handling', () => {
    it('initializes a new transport only once', async () => {
      const connectionMocks = useConnectionContext();

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_INIT_TRANSPORT,
          params: ['00000000-0000-0000-0000-000000000000'],
        });
      });

      jest.clearAllMocks();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(connectionMocks.request).not.toHaveBeenCalledWith(
          expect.objectContaining({
            method: ExtensionRequest.LEDGER_INIT_TRANSPORT,
          }),
        );
      });
    });

    it('removes transport when window closes', async () => {
      jest.spyOn(window, 'addEventListener');
      const connectionMocks = useConnectionContext();

      renderTestComponent();

      await waitFor(() => {
        expect(window.addEventListener).toHaveBeenCalledWith(
          'beforeunload',
          expect.any(Function),
        );
        expect(connectionMocks.request).not.toHaveBeenCalledWith(
          expect.objectContaining({
            method: ExtensionRequest.LEDGER_REMOVE_TRANSPORT,
          }),
        );
      });

      const [, beforeUnloadCallback] = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((events) => events[0] === 'beforeunload');

      const eventMock = {
        preventDefault: jest.fn(),
      };

      // trigger window.beforeunload callback manually
      beforeUnloadCallback(eventMock);

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: ExtensionRequest.LEDGER_REMOVE_TRANSPORT,
            params: ['00000000-0000-0000-0000-000000000000'],
          }),
        );
      });
    });

    it('does not the close window if app is not initialized', async () => {
      jest.spyOn(window, 'close');
      (React.useRef as jest.Mock).mockReturnValue({
        current: {
          deviceModel: {
            id: '1',
          },
        },
      });
      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderTestComponent();

      eventSubject.next({
        name: LedgerEvent.TRANSPORT_CLOSE_REQUEST,
        value: {
          connectionUUID: '1',
        },
      });

      await waitFor(() => {
        expect(window.close).not.toHaveBeenCalled();
      });
    });

    it('does not close the window if transport is not used', async () => {
      jest.spyOn(window, 'close');
      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);
      const transportMock = { foo: 'bar' };
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockResolvedValue({
          appName: LedgerAppType.AVALANCHE,
          appVersion: '1.0',
        }),
      };
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);

      renderTestComponent();

      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(AppAvalanche).toHaveBeenCalledWith(transportMock);
      });

      eventSubject.next({
        name: LedgerEvent.TRANSPORT_CLOSE_REQUEST,
        value: {
          connectionUUID: '1',
        },
      });

      await waitFor(() => {
        expect(window.close).not.toHaveBeenCalled();
      });
    });

    it('closes the window if transport should be released', async () => {
      jest.spyOn(window, 'close').mockReturnValueOnce(undefined);
      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);
      const transportMock = {
        deviceModel: {
          id: '1',
        },
      };
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockResolvedValue({
          appName: LedgerAppType.AVALANCHE,
          appVersion: '1.0',
        }),
      };
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);

      renderTestComponent();

      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(AppAvalanche).toHaveBeenCalledWith(transportMock);
      });

      eventSubject.next({
        name: LedgerEvent.TRANSPORT_CLOSE_REQUEST,
        value: {
          connectionUUID: '1',
        },
      });

      await waitFor(() => {
        expect(window.close).toHaveBeenCalled();
      });
    });
  });

  describe('app init', () => {
    it('retries initializing app on transport error', async () => {
      (getLedgerTransport as jest.Mock).mockResolvedValue(undefined);

      const connectionMocks = useConnectionContext();

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
          params: [],
        });
      });

      await waitFor(() => {
        expect(getLedgerTransport).toHaveBeenCalled();
      });

      // Clear the AppAvalanche mock to ignore heartbeat calls
      (AppAvalanche as unknown as jest.Mock).mockClear();

      await waitFor(() => {
        expect(AppAvalanche).not.toHaveBeenCalled();
      });

      jest.clearAllMocks();
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
          params: [],
        });
        expect(getLedgerTransport).toHaveBeenCalled();
        expect(AppAvalanche).not.toHaveBeenCalled();
        expect(screen.getByTestId('wasTransportAttempted').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'false',
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.UNKNOWN,
        );
      });
    });

    it('retries initializing app on application error', async () => {
      const transportMock = { foo: 'bar' };
      const avalancheAppError = new Error('some avalanche error');
      const btcAppError = new Error('some btc error');
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockRejectedValue(avalancheAppError),
      };
      const btcAppMock = {
        name: 'Bitcoin',
      };
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (getLedgerAppInfo as jest.Mock).mockRejectedValue(btcAppError);
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);
      (Btc as unknown as jest.Mock).mockReturnValue(btcAppMock);

      const connectionMocks = useConnectionContext();

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
          params: [],
        });
        expect(getLedgerTransport).toHaveBeenCalled();
        expect(AppAvalanche).toHaveBeenCalledWith(transportMock);
        expect(Btc).toHaveBeenCalledWith(transportMock);
      });

      jest.clearAllMocks();
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
          params: [],
        });
        expect(getLedgerTransport).toHaveBeenCalled();
        expect(AppAvalanche).toHaveBeenCalledWith(transportMock);
        expect(Btc).toHaveBeenCalledWith(transportMock);
        expect(screen.getByTestId('wasTransportAttempted').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'false',
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.UNKNOWN,
        );
      });
    });

    it('initializes Avalanche app correctly', async () => {
      const transportMock = { foo: 'bar' };
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockResolvedValue({
          appName: LedgerAppType.AVALANCHE,
          appVersion: '1.0',
        }),
      };
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);

      const connectionMocks = useConnectionContext();

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
          params: [],
        });
        expect(getLedgerTransport).toHaveBeenCalled();
        expect(AppAvalanche).toHaveBeenCalledWith(transportMock);
        expect(Btc).not.toHaveBeenCalledWith(transportMock);
        expect(screen.getByTestId('wasTransportAttempted').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.AVALANCHE,
        );
        expect(screen.getByTestId('avaxAppVersion').textContent).toBe('1.0');
      });
    });

    it('initializes Ethereum app correctly', async () => {
      const transportMock = { foo: 'bar' };
      const avalancheAppMock = {
        name: 'Ethereum',
        getAppInfo: jest.fn().mockResolvedValue({
          appName: LedgerAppType.ETHEREUM,
          appVersion: '1.0',
        }),
      };
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);

      const connectionMocks = useConnectionContext();

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
          params: [],
        });
        expect(getLedgerTransport).toHaveBeenCalled();
        expect(AppAvalanche).toHaveBeenCalledWith(transportMock);
        expect(Eth).toHaveBeenCalledWith(transportMock);
        expect(Btc).not.toHaveBeenCalledWith(transportMock);
        expect(screen.getByTestId('wasTransportAttempted').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.ETHEREUM,
        );
      });
    });

    it('initializes Bitcoin app correctly', async () => {
      const transportMock = { foo: 'bar' };
      const avalancheAppError = new Error('some avalanche error');
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockRejectedValue(avalancheAppError),
      };
      const btcAppMock = {
        name: 'Bitcoin',
      };
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (getLedgerAppInfo as jest.Mock).mockResolvedValue({
        applicationName: LedgerAppType.BITCOIN,
      });
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);
      (Btc as unknown as jest.Mock).mockReturnValue(btcAppMock);

      const connectionMocks = useConnectionContext();

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
          params: [],
        });
        expect(getLedgerTransport).toHaveBeenCalled();
        expect(AppAvalanche).toHaveBeenCalledWith(transportMock);
        expect(Btc).toHaveBeenCalledWith(transportMock);
        expect(screen.getByTestId('wasTransportAttempted').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.BITCOIN,
        );
      });
    });

    it('initializes Solana app correctly', async () => {
      const transportMock = { foo: 'bar' };
      const avalancheAppError = new Error('some avalanche error');
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockRejectedValue(avalancheAppError),
      };
      const btcAppMock = {
        name: 'Bitcoin',
      };
      const solanaAppMock = {
        name: 'Solana',
      };
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (getLedgerAppInfo as jest.Mock).mockResolvedValue({
        applicationName: LedgerAppType.SOLANA,
      });
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);
      (Btc as unknown as jest.Mock).mockReturnValue(btcAppMock);
      (Solana as unknown as jest.Mock).mockReturnValue(solanaAppMock);

      const connectionMocks = useConnectionContext();

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
          params: [],
        });
        expect(getLedgerTransport).toHaveBeenCalled();
        expect(AppAvalanche).toHaveBeenCalledWith(transportMock);
        expect(Btc).toHaveBeenCalledWith(transportMock);
        expect(Solana).toHaveBeenCalledWith(transportMock);
        expect(screen.getByTestId('wasTransportAttempted').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.SOLANA,
        );
      });
    });
  });

  describe('ledger version warning', () => {
    it('sets show warning flag properly', async () => {
      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockImplementation(
        async (param) => {
          if (param.method === ExtensionRequest.SHOW_LEDGER_VERSION_WARNING) {
            return true;
          }
        },
      );

      renderTestComponent();

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.SHOW_LEDGER_VERSION_WARNING,
        });
        expect(
          screen.getByTestId('ledgerVersionWarningClosed').textContent,
        ).toBe('true');
      });
    });

    it('sets show warning flag to false when extension gets locked', async () => {
      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderTestComponent();

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.SHOW_LEDGER_VERSION_WARNING,
        });
        eventSubject.next({
          name: LockEvents.LOCK_STATE_CHANGED,
          value: true,
        });
        expect(
          screen.getByTestId('ledgerVersionWarningClosed').textContent,
        ).toBe('false');
      });
    });
  });

  describe('getExtendedPublicKey', () => {
    it('throws error if transport is missing', async () => {
      (React.useRef as jest.Mock).mockReturnValue({ current: undefined });
      renderTestComponent();

      fireEvent.click(screen.getByTestId('getExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'no device detected',
        );
        expect(getLedgerExtendedPublicKey).not.toHaveBeenCalled();
      });
    });

    it('throws error if the device thrown an error', async () => {
      const path = "m/44'/60'/0'";
      const error = new Error('some error');
      (getLedgerExtendedPublicKey as jest.Mock).mockRejectedValueOnce(error);
      renderTestComponent(path);

      fireEvent.click(screen.getByTestId('getExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(error.toString());
        expect(getLedgerExtendedPublicKey).toHaveBeenCalledWith(
          refMock,
          false,
          path,
        );
      });
    });

    it('returns the extended public key correctly', async () => {
      const path = "m/44'/60'/0'";
      const xPub = '0x1';
      (getLedgerExtendedPublicKey as jest.Mock).mockResolvedValueOnce(xPub);
      renderTestComponent(path);

      fireEvent.click(screen.getByTestId('getExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe(xPub);
        expect(getLedgerExtendedPublicKey).toHaveBeenCalledWith(
          refMock,
          false,
          path,
        );
      });
    });
  });

  describe('getPublicKey', () => {
    it('throws error if transport is missing', async () => {
      (React.useRef as jest.Mock).mockReturnValue({ current: undefined });
      renderTestComponent();

      fireEvent.click(screen.getByTestId('getPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'no device detected',
        );
        expect(getPubKeyFromTransport).not.toHaveBeenCalled();
      });
    });

    it('returns the public key correctly', async () => {
      const pubkey = '0x1';
      (getPubKeyFromTransport as jest.Mock).mockResolvedValueOnce(pubkey);
      renderTestComponent(1, DerivationPath.BIP44, 'EVM');

      fireEvent.click(screen.getByTestId('getPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe(pubkey);
        expect(getPubKeyFromTransport).toHaveBeenCalledWith(
          refMock,
          1,
          DerivationPath.BIP44,
          'EVM',
        );
      });
    });
  });

  describe('popDeviceSelection', () => {
    it('does nothing if app has been already initialized', async () => {
      const transportMock = { foo: 'bar' };
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockResolvedValue({
          appName: LedgerAppType.AVALANCHE,
          appVersion: '1.0',
        }),
      };
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(AppAvalanche).toHaveBeenCalledWith(transportMock);
      });

      fireEvent.click(screen.getByTestId('popDeviceSelection'));

      await waitFor(() => {
        expect(TransportWebUSB.request).not.toHaveBeenCalled();
        expect(screen.getByTestId('result').textContent).toBe('true');
      });
    });

    it('throws on transport error', async () => {
      (TransportWebUSB.request as jest.Mock).mockRejectedValueOnce(
        'some error',
      );

      renderTestComponent();
      fireEvent.click(screen.getByTestId('popDeviceSelection'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'Ledger device selection failed',
        );
      });
    });

    it('pops up usb device selection properly', async () => {
      (TransportWebUSB.request as jest.Mock).mockResolvedValueOnce({});

      renderTestComponent();
      fireEvent.click(screen.getByTestId('popDeviceSelection'));

      await waitFor(() => {
        expect(TransportWebUSB.request).toHaveBeenCalled();
        expect(screen.getByTestId('result').textContent).toBe('true');
      });
    });

    it('pops up hid device selection properly', async () => {
      jest.mocked(shouldUseWebHID).mockResolvedValue(true);
      (TransportWebHID.request as jest.Mock).mockResolvedValueOnce({});

      renderTestComponent();
      fireEvent.click(screen.getByTestId('popDeviceSelection'));

      await waitFor(() => {
        expect(TransportWebHID.request).toHaveBeenCalled();
        expect(screen.getByTestId('result').textContent).toBe('true');
      });
    });
  });

  describe('getMasterFingerprint', () => {
    it('throws if app type is not Bitcoin', async () => {
      renderTestComponent();

      fireEvent.click(screen.getByTestId('getMasterFingerprint'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('wrong app');
      });
    });

    it('returns the master fingerprint correctly', async () => {
      const masterFingerprint = '0x1';
      const transportMock = { foo: 'bar' };
      const avalancheAppError = new Error('some avalanche error');
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockRejectedValue(avalancheAppError),
      };
      const btcAppMock = new Btc({} as any);
      (btcAppMock.getMasterFingerprint as jest.Mock).mockResolvedValueOnce(
        masterFingerprint,
      );
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (getLedgerAppInfo as jest.Mock).mockResolvedValue({
        applicationName: LedgerAppType.BITCOIN,
      });
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);
      (Btc as unknown as jest.Mock).mockReturnValue(btcAppMock);

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(Btc).toHaveBeenCalledWith(transportMock);
      });

      fireEvent.click(screen.getByTestId('getMasterFingerprint'));

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe(
          masterFingerprint,
        );
      });
    });
  });

  describe('closeCurrentApp', () => {
    it('does nothing if transport is missing', async () => {
      (React.useRef as jest.Mock).mockResolvedValue({ current: undefined });
      renderTestComponent();

      fireEvent.click(screen.getByTestId('closeCurrentApp'));

      await waitFor(() => {
        expect(getLedgerAppInfo).not.toHaveBeenCalled();
        expect(quitLedgerApp).not.toHaveBeenCalled();
      });
    });

    it('closes the app properly', async () => {
      renderTestComponent();

      fireEvent.click(screen.getByTestId('closeCurrentApp'));

      await waitFor(() => {
        expect(getLedgerAppInfo).toHaveBeenCalledWith(refMock);
        expect(quitLedgerApp).toHaveBeenCalledWith(refMock);
      });
    });
  });

  describe('getBtcExtendedPublicKey', () => {
    it('throws if app type is not Bitcoin', async () => {
      renderTestComponent();

      fireEvent.click(screen.getByTestId('getBtcExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('wrong app');
      });
    });

    it('returns the extended public key correctly', async () => {
      const path = "m/44'/60'/0'";
      const xPub = '0x1';
      const transportMock = { foo: 'bar' };
      const avalancheAppError = new Error('some avalanche error');
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockRejectedValue(avalancheAppError),
      };
      const btcAppMock = new Btc({} as any);
      (btcAppMock.getExtendedPubkey as jest.Mock).mockResolvedValueOnce(xPub);
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (getLedgerAppInfo as jest.Mock).mockResolvedValue({
        applicationName: LedgerAppType.BITCOIN,
      });
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);
      (Btc as unknown as jest.Mock).mockReturnValue(btcAppMock);

      renderTestComponent(path);
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(Btc).toHaveBeenCalledWith(transportMock);
      });

      fireEvent.click(screen.getByTestId('getBtcExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe(xPub);
        expect(btcAppMock.getExtendedPubkey).toHaveBeenCalledWith(path, true);
      });
    });
  });

  describe('registerBtcWalletPolicy', () => {
    it('throws if app type is not Bitcoin', async () => {
      renderTestComponent();

      fireEvent.click(screen.getByTestId('getBtcExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('wrong app');
      });
    });

    it('returns the extended public key correctly', async () => {
      const result = Buffer.from('0x0');
      const xPub = '0x1';
      const masterFingerprint = '0x2';
      const path = "m/44'/60'/0'";
      const name = 'test policy';
      const transportMock = { foo: 'bar' };
      const avalancheAppError = new Error('some avalanche error');
      const avalancheAppMock = {
        name: 'Avalanche',
        getAppInfo: jest.fn().mockRejectedValue(avalancheAppError),
      };
      const btcAppMock = new Btc({} as any);
      (btcAppMock.registerWallet as jest.Mock).mockResolvedValueOnce(result);
      (getLedgerTransport as jest.Mock).mockResolvedValue(transportMock);
      (getLedgerAppInfo as jest.Mock).mockResolvedValue({
        applicationName: LedgerAppType.BITCOIN,
      });
      (AppAvalanche as unknown as jest.Mock).mockReturnValue(avalancheAppMock);
      (Btc as unknown as jest.Mock).mockReturnValue(btcAppMock);

      const defaultWalletPolicyMock = { keys: [1, 2, 3] };
      (DefaultWalletPolicy as jest.Mock).mockReturnValueOnce(
        defaultWalletPolicyMock,
      );

      const walletPolicyMock = { foo: 'bar' };
      (WalletPolicy as jest.Mock).mockReturnValueOnce(walletPolicyMock);

      renderTestComponent(xPub, masterFingerprint, path, name);
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(Btc).toHaveBeenCalledWith(transportMock);
      });

      fireEvent.click(screen.getByTestId('registerBtcWalletPolicy'));

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe(
          result.toString(),
        );
        expect(btcAppMock.registerWallet).toHaveBeenCalledWith(
          walletPolicyMock,
        );
        expect(DefaultWalletPolicy).toHaveBeenCalledWith(
          'wpkh(@0/**)',
          `[${masterFingerprint}/${path}]${xPub}`,
        );
        expect(WalletPolicy).toHaveBeenCalledWith(
          name,
          'wpkh(@0/**)',
          defaultWalletPolicyMock.keys,
        );
      });
    });
  });

  describe('updateLedgerVersionWarningClosed', () => {
    it('sets show warning flag correctly', async () => {
      const connectionMocks = useConnectionContext();
      renderTestComponent();
      fireEvent.click(screen.getByTestId('updateLedgerVersionWarningClosed'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_VERSION_WARNING_CLOSED,
        });
      });
    });
  });
});
