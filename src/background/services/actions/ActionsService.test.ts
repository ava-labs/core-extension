import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { ethErrors } from 'eth-rpc-errors';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import { ActionsService } from './ActionsService';
import {
  Action,
  ActionCompletedEventType,
  ActionsEvent,
  ActionStatus,
  ACTIONS_STORAGE_KEY,
} from './models';
import { filterStaleActions } from './utils';

jest.mock('../storage/StorageService');
jest.mock('../lock/LockService');
jest.mock('./utils', () => ({
  filterStaleActions: jest.fn(),
}));

describe('background/services/actions/ActionsService.ts', () => {
  const handlerWithCallback: DAppRequestHandler = {
    methods: ['handler_with_callback'] as any,
    onActionApproved: jest.fn(),
    handleAuthenticated: jest.fn(),
    handleUnauthenticated: jest.fn(),
  };

  const handlerWithoutCallback: DAppRequestHandler = {
    methods: ['handler_without_callback'] as any,
    handleAuthenticated: jest.fn(),
    handleUnauthenticated: jest.fn(),
  };

  const storageService = new StorageService({} as any);
  const lockService = new LockService({} as any, {} as any);
  Object.defineProperty(lockService, 'locked', {
    writable: true,
  });

  let actionsService: ActionsService;

  const mockAction: Action = {
    id: '1',
    method: 'handler_with_callback' as any,
    time: 123123123,
    status: ActionStatus.PENDING,
    displayData: {},
    actionId: 'uuid',
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    // jest is having issues mocking non static getters
    (lockService as any).locked = false;

    actionsService = new ActionsService(
      [handlerWithCallback, handlerWithoutCallback],
      storageService,
      lockService
    );
    (filterStaleActions as jest.Mock).mockImplementation((a) => a);
  });

  describe('getActions', () => {
    it('gets actions from storage and session when unlocked', async () => {
      const actions = {
        1: mockAction,
        2: { ...mockAction, id: 2 },
      };
      const actions2 = {
        3: { ...mockAction, id: 3 },
      };
      (storageService.load as jest.Mock).mockResolvedValue(actions);
      (storageService.loadFromSessionStorage as jest.Mock).mockResolvedValue(
        actions2
      );
      const result = await actionsService.getActions();

      expect(result).toEqual({ ...actions, ...actions2 });
      expect(storageService.load).toHaveBeenCalledTimes(1);
      expect(storageService.load).toHaveBeenCalledWith(ACTIONS_STORAGE_KEY);
      expect(storageService.loadFromSessionStorage).toHaveBeenCalledTimes(1);
      expect(storageService.loadFromSessionStorage).toHaveBeenCalledWith(
        ACTIONS_STORAGE_KEY
      );
    });

    it('gets actions from session storage when locked', async () => {
      (lockService as any).locked = true;

      const actions = {
        1: mockAction,
        2: { ...mockAction, id: 2 },
      };
      (storageService.loadFromSessionStorage as jest.Mock).mockResolvedValue(
        actions
      );

      const result = await actionsService.getActions();

      expect(result).toEqual(actions);
      expect(storageService.loadFromSessionStorage).toHaveBeenCalledTimes(1);
      expect(storageService.loadFromSessionStorage).toHaveBeenCalledWith(
        ACTIONS_STORAGE_KEY
      );
      expect(storageService.load).not.toHaveBeenCalled();
    });
  });

  describe('saveActions', () => {
    it('saves actions to storage when unlocked', async () => {
      const actions = {
        1: mockAction,
        2: { ...mockAction, id: '2' },
      };

      await actionsService.saveActions(actions);

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(
        ACTIONS_STORAGE_KEY,
        actions
      );
      expect(storageService.saveToSessionStorage).not.toHaveBeenCalled();
    });

    it('saves actions to session storage when locked', async () => {
      (lockService as any).locked = true;
      const actions = {
        1: mockAction,
        2: { ...mockAction, id: '2' },
      };

      await actionsService.saveActions(actions);

      expect(storageService.saveToSessionStorage).toHaveBeenCalledTimes(1);
      expect(storageService.saveToSessionStorage).toHaveBeenCalledWith(
        ACTIONS_STORAGE_KEY,
        actions
      );
      expect(storageService.save).not.toHaveBeenCalled();
    });

    it('emits event when actions are saved', async () => {
      const actions = {
        1: mockAction,
        2: { ...mockAction, id: '2' },
      };
      const eventListener = jest.fn();

      actionsService.addListener(ActionsEvent.ACTION_UPDATED, eventListener);
      await actionsService.saveActions(actions);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(actions);
    });
  });

  describe('onStorageReady', () => {
    it('moves actions from session storage to storage when wallet gets unlocked', async () => {
      (storageService.loadFromSessionStorage as jest.Mock).mockResolvedValue({
        2: { ...mockAction, id: '2' },
      });
      (storageService.load as jest.Mock).mockResolvedValue({
        1: mockAction,
      });

      await actionsService.onStorageReady();

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(ACTIONS_STORAGE_KEY, {
        1: mockAction,
        2: { ...mockAction, id: '2' },
      });

      expect(storageService.removeFromSessionStorage).toHaveBeenCalledWith(
        ACTIONS_STORAGE_KEY
      );
    });
  });

  describe('addAction', () => {
    it('adds action', async () => {
      (storageService.load as jest.Mock).mockResolvedValue({
        1: mockAction,
      });

      jest.spyOn(Date, 'now').mockReturnValue(12345678);

      const result = await actionsService.addAction({
        ...mockAction,
        status: undefined,
        id: 2,
      } as any);

      const expectedResult = {
        ...mockAction,
        status: ActionStatus.PENDING,
        time: 12345678,
        id: 2,
      };

      expect(result).toEqual(expectedResult);
      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(ACTIONS_STORAGE_KEY, {
        1: mockAction,
        uuid: expectedResult,
      });
    });
  });

  describe('removeAction', () => {
    it('removes action', async () => {
      (storageService.load as jest.Mock).mockResolvedValue({
        1: mockAction,
      });

      await actionsService.removeAction('1');

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(ACTIONS_STORAGE_KEY, {});
    });

    it('does nothing when id not found', async () => {
      (storageService.load as jest.Mock).mockResolvedValue({
        1: mockAction,
      });

      await actionsService.removeAction('2');

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(ACTIONS_STORAGE_KEY, {
        1: mockAction,
      });
    });
  });

  describe('updateAction', () => {
    it('does nothing when message not found', async () => {
      const eventListener = jest.fn();
      actionsService.addListener(ActionsEvent.ACTION_COMPLETED, eventListener);

      (storageService.load as jest.Mock).mockResolvedValue({
        1: mockAction,
      });
      await actionsService.updateAction({
        status: ActionStatus.COMPLETED,
        id: 2,
      });

      expect(eventListener).not.toHaveBeenCalled();
      expect(storageService.save).not.toHaveBeenCalled();
    });

    describe('ActionStatus.SUBMITTING', () => {
      it('emits error when handler not compatible or missing', async () => {
        const eventListener = jest.fn();
        actionsService.addListener(
          ActionsEvent.ACTION_COMPLETED,
          eventListener
        );

        const action = {
          ...mockAction,
          method: 'method-with-no-handler',
        };
        (storageService.load as jest.Mock).mockResolvedValue({
          1: action,
        });

        await actionsService.updateAction({
          status: ActionStatus.SUBMITTING,
          id: 1,
        });

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener).toHaveBeenCalledWith({
          type: ActionCompletedEventType.ERROR,
          action: action,
          result: ethErrors.rpc.internal('Request handler not found'),
        });
        expect(storageService.save).toHaveBeenCalledTimes(1);
        expect(storageService.save).toHaveBeenCalledWith(
          ACTIONS_STORAGE_KEY,
          {}
        );
      });

      it('passes the tabId to onActionApproved call', async () => {
        const eventListener = jest.fn();
        actionsService.addListener(
          ActionsEvent.ACTION_COMPLETED,
          eventListener
        );

        (storageService.load as jest.Mock).mockResolvedValue({
          1: mockAction,
        });

        const tabId = 1337;

        await actionsService.updateAction({
          status: ActionStatus.SUBMITTING,
          id: '1',
          tabId,
        });

        expect(handlerWithCallback.onActionApproved).toHaveBeenCalledWith(
          mockAction,
          undefined,
          expect.any(Function),
          expect.any(Function),
          tabId
        );
      });

      it('emits error when handler emits an error', async () => {
        const eventListener = jest.fn();
        actionsService.addListener(
          ActionsEvent.ACTION_COMPLETED,
          eventListener
        );

        (storageService.load as jest.Mock).mockResolvedValue({
          1: mockAction,
        });

        (handlerWithCallback.onActionApproved as jest.Mock).mockImplementation(
          async (pendingAction, result, onSuccess, onError) => {
            await onError(new Error('someError'));
          }
        );

        await actionsService.updateAction({
          status: ActionStatus.SUBMITTING,
          id: 1,
        });

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener).toHaveBeenCalledWith({
          type: ActionCompletedEventType.ERROR,
          action: mockAction,
          result: new Error('someError'),
        });
        expect(storageService.save).toHaveBeenCalledTimes(1);
        expect(storageService.save).toHaveBeenCalledWith(
          ACTIONS_STORAGE_KEY,
          {}
        );
      });

      it('emits result on handler success', async () => {
        const eventListener = jest.fn();
        actionsService.addListener(
          ActionsEvent.ACTION_COMPLETED,
          eventListener
        );

        (storageService.load as jest.Mock).mockResolvedValue({
          1: mockAction,
        });

        (handlerWithCallback.onActionApproved as jest.Mock).mockImplementation(
          async (pendingAction, result, onSuccess) => {
            await onSuccess(['ADDRESS']);
          }
        );

        await actionsService.updateAction({
          status: ActionStatus.SUBMITTING,
          id: 1,
        });

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener).toHaveBeenCalledWith({
          type: ActionCompletedEventType.COMPLETED,
          action: mockAction,
          result: ['ADDRESS'],
        });
        expect(storageService.save).toHaveBeenCalledTimes(1);
        expect(storageService.save).toHaveBeenCalledWith(
          ACTIONS_STORAGE_KEY,
          {}
        );
      });
    });

    describe('ActionStatus.ERROR_USER_CANCELED', () => {
      it('emits error when user rejects', async () => {
        const eventListener = jest.fn();
        actionsService.addListener(
          ActionsEvent.ACTION_COMPLETED,
          eventListener
        );

        (storageService.load as jest.Mock).mockResolvedValue({
          1: mockAction,
        });

        await actionsService.updateAction({
          status: ActionStatus.ERROR_USER_CANCELED,
          id: 1,
        });

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener).toHaveBeenCalledWith({
          type: ActionCompletedEventType.ERROR,
          action: mockAction,
          result: ethErrors.provider.userRejectedRequest(),
        });
        expect(storageService.save).toHaveBeenCalledTimes(1);
        expect(storageService.save).toHaveBeenCalledWith(
          ACTIONS_STORAGE_KEY,
          {}
        );
      });
    });

    describe('ActionStatus.ERROR', () => {
      it('emits error on error updates', async () => {
        const eventListener = jest.fn();
        actionsService.addListener(
          ActionsEvent.ACTION_COMPLETED,
          eventListener
        );

        (storageService.load as jest.Mock).mockResolvedValue({
          1: mockAction,
        });

        await actionsService.updateAction({
          status: ActionStatus.ERROR,
          id: 1,
          error: 'very big error',
        });

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener).toHaveBeenCalledWith({
          type: ActionCompletedEventType.ERROR,
          action: mockAction,
          result: ethErrors.rpc.internal(new Error('very big error')),
        });
        expect(storageService.save).toHaveBeenCalledTimes(1);
        expect(storageService.save).toHaveBeenCalledWith(
          ACTIONS_STORAGE_KEY,
          {}
        );
      });
    });

    describe('ActionStatus.COMPLETED', () => {
      it('emits success on completed', async () => {
        const eventListener = jest.fn();
        actionsService.addListener(
          ActionsEvent.ACTION_COMPLETED,
          eventListener
        );

        (storageService.load as jest.Mock).mockResolvedValue({
          1: mockAction,
        });

        await actionsService.updateAction({
          status: ActionStatus.COMPLETED,
          id: 1,
          result: ['ADDRESS'],
        });

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener).toHaveBeenCalledWith({
          type: ActionCompletedEventType.COMPLETED,
          action: mockAction,
          result: ['ADDRESS'],
        });
        expect(storageService.save).toHaveBeenCalledTimes(1);
        expect(storageService.save).toHaveBeenCalledWith(
          ACTIONS_STORAGE_KEY,
          {}
        );
      });
    });

    describe('ActionStatus.PENDING', () => {
      it('updates action', async () => {
        const eventListener = jest.fn();
        actionsService.addListener(
          ActionsEvent.ACTION_COMPLETED,
          eventListener
        );

        (storageService.load as jest.Mock).mockResolvedValue({
          1: mockAction,
        });

        await actionsService.updateAction({
          status: ActionStatus.PENDING,
          id: 1,
          result: ['ADDRESS'],
          error: 'error',
        });

        expect(eventListener).not.toHaveBeenCalled();
        expect(storageService.save).toHaveBeenCalledTimes(1);
        expect(storageService.save).toHaveBeenCalledWith(ACTIONS_STORAGE_KEY, {
          1: {
            ...mockAction,
            displayData: {},
            result: ['ADDRESS'],
            error: 'error',
          },
        });
      });
      it('updates action with displayData', async () => {
        const eventListener = jest.fn();
        actionsService.addListener(
          ActionsEvent.ACTION_COMPLETED,
          eventListener
        );

        (storageService.load as jest.Mock).mockResolvedValue({
          1: {
            ...mockAction,
            displayData: {
              prop: 'oldvalue',
              prop2: 'somevalue',
            },
          },
        });

        await actionsService.updateAction({
          status: ActionStatus.PENDING,
          id: 1,
          result: ['ADDRESS'],
          error: 'error',
          displayData: {
            prop: 'value',
          },
        });

        expect(eventListener).not.toHaveBeenCalled();
        expect(storageService.save).toHaveBeenCalledTimes(1);
        expect(storageService.save).toHaveBeenCalledWith(ACTIONS_STORAGE_KEY, {
          1: {
            ...mockAction,
            displayData: {
              prop: 'value',
              prop2: 'somevalue',
            },
            result: ['ADDRESS'],
            error: 'error',
          },
        });
      });
    });
  });
});
