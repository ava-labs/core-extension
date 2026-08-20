import { Runtime } from 'webextension-polyfill';

import { ActionsService } from '../../services/actions/ActionsService';
import { DAppConnectionController } from './DAppConnectionController';

jest.mock('webextension-polyfill', () => ({
  runtime: {
    id: 'testid',
    getManifest: () => ({ version: '0.0.0' }),
    getURL: (path: string) => path,
  },
  windows: {
    onRemoved: { addListener: jest.fn() },
    onFocusChanged: { addListener: jest.fn() },
  },
  tabs: {
    onRemoved: { addListener: jest.fn() },
    onUpdated: { addListener: jest.fn() },
  },
  i18n: { getMessage: () => 'Core Test' },
}));

const buildPort = (url?: string, tabId?: number) => {
  const disconnectListeners: Array<() => void> = [];

  const port = {
    name: 'provider',
    sender: {
      url,
      tab: typeof tabId === 'number' ? { id: tabId } : undefined,
    },
    onMessage: { addListener: jest.fn() },
    onDisconnect: {
      addListener: jest.fn((listener: () => void) => {
        disconnectListeners.push(listener);
      }),
    },
    postMessage: jest.fn(),
    disconnect: jest.fn(),
  } as unknown as Runtime.Port;

  return {
    port,
    fireDisconnect: () => disconnectListeners.forEach((listener) => listener()),
  };
};

describe('DAppConnectionController disconnect', () => {
  let actionsService: jest.Mocked<ActionsService>;

  const buildController = () => {
    actionsService = {
      cancelPendingActionsForConnection: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ActionsService>;

    return new DAppConnectionController(
      [],
      [],
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      actionsService,
    );
  };

  it("cancels the connection's pending approvals when the page goes away", () => {
    const controller = buildController();
    const { port, fireDisconnect } = buildPort('https://dapp.example/app', 7);

    controller.connect(port);
    fireDisconnect();

    expect(
      actionsService.cancelPendingActionsForConnection,
    ).toHaveBeenCalledWith({
      domain: 'dapp.example',
      tabId: 7,
    });
  });

  it('uses the sender origin rather than anything the page reported', () => {
    const controller = buildController();
    const { port, fireDisconnect } = buildPort(
      'https://real.example/path?q=https://spoofed.example',
      3,
    );

    controller.connect(port);
    fireDisconnect();

    expect(
      actionsService.cancelPendingActionsForConnection,
    ).toHaveBeenCalledWith({
      domain: 'real.example',
      tabId: 3,
    });
  });

  it('does not throw when the sender has no usable url', () => {
    const controller = buildController();
    const { port, fireDisconnect } = buildPort(undefined, 3);

    controller.connect(port);

    expect(() => fireDisconnect()).not.toThrow();
    expect(
      actionsService.cancelPendingActionsForConnection,
    ).toHaveBeenCalledWith({
      domain: undefined,
      tabId: 3,
    });
  });
});
