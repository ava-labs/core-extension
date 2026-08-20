import {
  Action,
  ACTION_HANDLED_BY_MODULE,
  Actions,
  ActionStatus,
  ActionType,
} from '@core/types';
import browser from 'webextension-polyfill';

import { ApprovalController } from '~/vmModules/ApprovalController';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import { ActionsService } from './ActionsService';

jest.mock('webextension-polyfill', () => ({
  windows: {
    remove: jest.fn().mockResolvedValue(undefined),
    getAll: jest.fn().mockResolvedValue([]),
    onRemoved: { addListener: jest.fn() },
    onFocusChanged: { addListener: jest.fn() },
  },
  tabs: {
    onRemoved: { addListener: jest.fn() },
    onUpdated: { addListener: jest.fn() },
  },
  runtime: {
    id: 'testid',
    getManifest: () => ({ version: '0.0.0' }),
    getURL: (path: string) => path,
  },
  i18n: {
    getMessage: () => 'Core Test',
  },
}));

const mockedWindows = browser.windows as unknown as {
  remove: jest.Mock;
  getAll: jest.Mock;
};

const VICTIM_TAB = 1;
const OTHER_TAB = 2;

const buildAction = (overrides: Partial<Action> = {}): Action =>
  ({
    [ACTION_HANDLED_BY_MODULE]: true,
    type: ActionType.Single,
    id: 'request-id',
    method: 'personal_sign',
    scope: 'eip155:43114',
    status: ActionStatus.PENDING,
    displayData: {},
    tabId: VICTIM_TAB,
    dappInfo: { url: 'https://dapp.example/login', name: 'dApp', icon: '' },
    ...overrides,
  }) as unknown as Action;

describe('ActionsService.cancelPendingActionsForConnection', () => {
  let actionsService: ActionsService;
  let approvalController: jest.Mocked<ApprovalController>;
  let stored: Actions;

  const setActions = (actions: Actions) => {
    stored = actions;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    stored = {};

    const storageService = {
      load: jest.fn(async () => stored),
      save: jest.fn(async (_key, value) => {
        stored = value as Actions;
      }),
      loadFromSessionStorage: jest.fn(async () => ({})),
      saveToSessionStorage: jest.fn(async () => undefined),
      removeFromSessionStorage: jest.fn(async () => undefined),
    } as unknown as StorageService;

    const lockService = { locked: false } as unknown as LockService;

    approvalController = {
      onApproved: jest.fn(),
      onRejected: jest.fn(),
    } as unknown as jest.Mocked<ApprovalController>;

    actionsService = new ActionsService(
      [],
      storageService,
      lockService,
      approvalController,
    );
  });

  it('rejects a pending action whose dApp connection went away', async () => {
    setActions({ 'action-1': buildAction({ actionId: 'action-1' }) });

    await actionsService.cancelPendingActionsForConnection({
      tabId: VICTIM_TAB,
      domain: 'dapp.example',
    });

    expect(approvalController.onRejected).toHaveBeenCalledTimes(1);
    expect(stored['action-1']).toBeUndefined();
  });

  it('closes the orphaned approval window', async () => {
    setActions({
      'action-1': buildAction({ actionId: 'action-1', popupWindowId: 42 }),
    });

    await actionsService.cancelPendingActionsForConnection({
      tabId: VICTIM_TAB,
      domain: 'dapp.example',
    });

    expect(browser.windows.remove).toHaveBeenCalledWith(42);
  });

  it('swallows the error when the approval window is already gone', async () => {
    mockedWindows.remove.mockRejectedValueOnce(new Error('No window'));
    setActions({
      'action-1': buildAction({ actionId: 'action-1', popupWindowId: 42 }),
    });

    await expect(
      actionsService.cancelPendingActionsForConnection({
        tabId: VICTIM_TAB,
        domain: 'dapp.example',
      }),
    ).resolves.toBeUndefined();

    expect(stored['action-1']).toBeUndefined();
  });

  it('leaves actions from a different tab alone', async () => {
    setActions({
      'action-1': buildAction({ actionId: 'action-1', tabId: OTHER_TAB }),
    });

    await actionsService.cancelPendingActionsForConnection({
      tabId: VICTIM_TAB,
      domain: 'dapp.example',
    });

    expect(approvalController.onRejected).not.toHaveBeenCalled();
    expect(stored['action-1']).toBeDefined();
  });

  it('leaves actions from a different origin in the same tab alone', async () => {
    setActions({
      'action-1': buildAction({
        actionId: 'action-1',
        dappInfo: {
          url: 'https://other.example',
          name: 'Other',
          icon: '',
        } as Action['dappInfo'],
      }),
    });

    await actionsService.cancelPendingActionsForConnection({
      tabId: VICTIM_TAB,
      domain: 'dapp.example',
    });

    expect(approvalController.onRejected).not.toHaveBeenCalled();
    expect(stored['action-1']).toBeDefined();
  });

  it('leaves an already-approved (submitting) action alone', async () => {
    setActions({
      'action-1': buildAction({
        actionId: 'action-1',
        status: ActionStatus.SUBMITTING,
      }),
    });

    await actionsService.cancelPendingActionsForConnection({
      tabId: VICTIM_TAB,
      domain: 'dapp.example',
    });

    expect(approvalController.onRejected).not.toHaveBeenCalled();
    expect(stored['action-1']).toBeDefined();
  });

  it('matches legacy actions that carry the origin on site metadata', async () => {
    setActions({
      'action-1': buildAction({
        actionId: 'action-1',
        tabId: undefined,
        dappInfo: undefined,
        site: { domain: 'dapp.example', tabId: VICTIM_TAB },
      } as Partial<Action>),
    });

    await actionsService.cancelPendingActionsForConnection({
      tabId: VICTIM_TAB,
      domain: 'dapp.example',
    });

    expect(stored['action-1']).toBeUndefined();
  });

  it('does nothing without both a tab and a domain', async () => {
    setActions({ 'action-1': buildAction({ actionId: 'action-1' }) });

    await actionsService.cancelPendingActionsForConnection({
      tabId: VICTIM_TAB,
      domain: undefined,
    });
    await actionsService.cancelPendingActionsForConnection({
      tabId: undefined,
      domain: 'dapp.example',
    });

    expect(approvalController.onRejected).not.toHaveBeenCalled();
    expect(stored['action-1']).toBeDefined();
  });
});
