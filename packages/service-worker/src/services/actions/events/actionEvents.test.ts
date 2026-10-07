import { runtime } from 'webextension-polyfill';
import {
  ActionCompletedEventType,
  ActionsEvent,
  ActionStatus,
  ActionType,
} from '@core/types';
import { ActionEvents } from './actionEvents';

const VICTIM_TAB_ID = 4242;
const ATTACKER_TAB_ID = 1001;
const EXTENSION_DOMAIN = runtime.id; // 'testid' in test env

const buildAction = (tabId: number, actionId = 'action-1') =>
  ({
    actionId,
    tabId,
    site: { domain: 'victim.example', tabId },
    method: 'personal_sign',
    status: ActionStatus.PENDING,
    displayData: {},
    type: ActionType.Single,
    params: ['0xdeadbeef', '0x1111111111111111111111111111111111111111'],
    id: actionId,
    jsonrpc: '2.0',
    scope: 'eip155:1',
    signingData: { message: 'alice@example.com, +1-202-555-0101, 123 Main St' },
  }) as any;

const makeActionEvents = () => {
  const actionsService = { addListener: jest.fn() };
  const events = new ActionEvents(actionsService as any);

  const getRegisteredListener = (event: ActionsEvent) =>
    actionsService.addListener.mock.calls.find(([ev]) => ev === event)?.[1];

  return {
    events,
    fireActionUpdated: (actions: object) =>
      getRegisteredListener(ActionsEvent.ACTION_UPDATED)?.(actions),
    fireActionCompleted: (payload: object) =>
      getRegisteredListener(ActionsEvent.ACTION_COMPLETED)?.(payload),
  };
};

describe('ActionEvents', () => {
  describe('ACTION_UPDATED — security boundary', () => {
    it('does not emit to an unrelated dApp connection (different tabId)', () => {
      const { events, fireActionUpdated } = makeActionEvents();
      events.setConnectionInfo({
        domain: 'attacker.example',
        tabId: ATTACKER_TAB_ID,
      });

      const listener = jest.fn();
      events.addListener(listener);

      fireActionUpdated({ 'victim-action': buildAction(VICTIM_TAB_ID) });

      expect(listener).not.toHaveBeenCalled();
    });

    it('emits only the matching action to the originating dApp connection', () => {
      const { events, fireActionUpdated } = makeActionEvents();
      events.setConnectionInfo({
        domain: 'victim.example',
        tabId: VICTIM_TAB_ID,
      });

      const listener = jest.fn();
      events.addListener(listener);

      const victimAction = buildAction(VICTIM_TAB_ID, 'victim-action');
      const otherAction = buildAction(ATTACKER_TAB_ID, 'other-action');
      fireActionUpdated({
        'victim-action': victimAction,
        'other-action': otherAction,
      });

      const {
        signingData: _s,
        displayData: _d,
        ...withoutPayload
      } = victimAction;

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        name: ActionsEvent.ACTION_UPDATED,
        value: { 'victim-action': withoutPayload },
      });
    });

    // A dApp learns its outcome from the JSON-RPC response, so the event it
    // receives must not carry the signing payload or the rendered approval.
    it('strips the signing payload from the event sent to a dApp', () => {
      const { events, fireActionUpdated } = makeActionEvents();
      events.setConnectionInfo({
        domain: 'victim.example',
        tabId: VICTIM_TAB_ID,
      });

      const listener = jest.fn();
      events.addListener(listener);

      fireActionUpdated({
        'victim-action': buildAction(VICTIM_TAB_ID, 'victim-action'),
      });

      const emitted = listener.mock.calls[0]?.[0].value['victim-action'];

      expect(emitted).toBeDefined();
      expect(emitted.signingData).toBeUndefined();
      expect(emitted.displayData).toBeUndefined();
      expect(JSON.stringify(emitted)).not.toContain('alice@example.com');
      // Correlation data the page legitimately already has is kept.
      expect(emitted.actionId).toBe('victim-action');
      expect(emitted.status).toBe(ActionStatus.PENDING);
    });

    it('strips signingRequests from a batch action sent to a dApp', () => {
      const { events, fireActionUpdated } = makeActionEvents();
      events.setConnectionInfo({
        domain: 'victim.example',
        tabId: VICTIM_TAB_ID,
      });

      const listener = jest.fn();
      events.addListener(listener);

      fireActionUpdated({
        batch: {
          ...buildAction(VICTIM_TAB_ID, 'batch'),
          type: ActionType.Batch,
          signingRequests: [{ signingData: { account: '0xabc' } }],
        },
      });

      const emitted = listener.mock.calls[0]?.[0].value['batch'];

      expect(emitted).toBeDefined();
      expect(emitted.signingRequests).toBeUndefined();
      expect(emitted.displayData).toBeUndefined();
    });

    it('matches on site.tabId when action.tabId is absent', () => {
      const { events, fireActionUpdated } = makeActionEvents();
      events.setConnectionInfo({
        domain: 'victim.example',
        tabId: VICTIM_TAB_ID,
      });

      const listener = jest.fn();
      events.addListener(listener);

      const action = { ...buildAction(VICTIM_TAB_ID), tabId: undefined };
      fireActionUpdated({ 'victim-action': action });

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('emits the full actions map to the extension UI', () => {
      const { events, fireActionUpdated } = makeActionEvents();
      events.setConnectionInfo({ domain: EXTENSION_DOMAIN });

      const listener = jest.fn();
      events.addListener(listener);

      const victimAction = buildAction(VICTIM_TAB_ID, 'victim-action');
      const otherAction = buildAction(ATTACKER_TAB_ID, 'other-action');
      const allActions = {
        'victim-action': victimAction,
        'other-action': otherAction,
      };
      fireActionUpdated(allActions);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        name: ActionsEvent.ACTION_UPDATED,
        value: allActions,
      });
    });

    it('emits an empty actions map to the extension UI so it can clear approval state', () => {
      const { events, fireActionUpdated } = makeActionEvents();
      events.setConnectionInfo({ domain: EXTENSION_DOMAIN });

      const listener = jest.fn();
      events.addListener(listener);

      fireActionUpdated({});

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        name: ActionsEvent.ACTION_UPDATED,
        value: {},
      });
    });

    it('does not emit an empty map to an unrelated dApp', () => {
      const { events, fireActionUpdated } = makeActionEvents();
      events.setConnectionInfo({
        domain: 'attacker.example',
        tabId: ATTACKER_TAB_ID,
      });

      const listener = jest.fn();
      events.addListener(listener);

      fireActionUpdated({});

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('ACTION_COMPLETED — existing filtering unchanged', () => {
    it('does not emit to an unrelated dApp connection', () => {
      const { events, fireActionCompleted } = makeActionEvents();
      events.setConnectionInfo({
        domain: 'attacker.example',
        tabId: ATTACKER_TAB_ID,
      });

      const listener = jest.fn();
      events.addListener(listener);

      fireActionCompleted({
        type: ActionCompletedEventType.COMPLETED,
        action: buildAction(VICTIM_TAB_ID),
        result: '0xsignature',
      });

      expect(listener).not.toHaveBeenCalled();
    });

    it('emits to the originating dApp connection', () => {
      const { events, fireActionCompleted } = makeActionEvents();
      events.setConnectionInfo({
        domain: 'victim.example',
        tabId: VICTIM_TAB_ID,
      });

      const listener = jest.fn();
      events.addListener(listener);

      const action = buildAction(VICTIM_TAB_ID);
      fireActionCompleted({
        type: ActionCompletedEventType.COMPLETED,
        action,
        result: '0xsignature',
      });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        ...action,
        result: '0xsignature',
      });
    });

    it('emits to the extension UI regardless of tabId', () => {
      const { events, fireActionCompleted } = makeActionEvents();
      events.setConnectionInfo({ domain: EXTENSION_DOMAIN });

      const listener = jest.fn();
      events.addListener(listener);

      const action = buildAction(VICTIM_TAB_ID);
      fireActionCompleted({
        type: ActionCompletedEventType.COMPLETED,
        action,
        result: '0xsignature',
      });

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
