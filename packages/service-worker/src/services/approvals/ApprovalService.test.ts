import { windows, sidePanel, runtime } from 'webextension-polyfill';

import { openExtensionNewWindow } from '@core/common';

import { ActionsService } from '../actions/ActionsService';
import { ApprovalService } from './ApprovalService';
import { ApprovalEvent } from '@core/types';

jest.mock('@core/common');

const CURRENT_WINDOW_ID = 5678;

describe('src/background/services/approvals/ApprovalService', () => {
  let service: ApprovalService;

  const actionsService: jest.Mocked<ActionsService> = {
    addAction: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.spyOn(windows, 'getCurrent').mockResolvedValue({
      id: CURRENT_WINDOW_ID,
    } as any);
    service = new ApprovalService(actionsService);
  });

  describe('.requestApproval()', () => {
    describe('when sidepanel is opened in the same window', () => {
      beforeEach(() => {
        jest.spyOn(sidePanel.onOpened, 'addListener');
        service = new ApprovalService(actionsService);

        const onOpenedCallback = jest.mocked(sidePanel.onOpened.addListener)
          .mock.calls[0]?.[0];

        if (!onOpenedCallback) {
          fail('sidePanel.onOpened not listened to');
        }

        onOpenedCallback({ windowId: CURRENT_WINDOW_ID });
      });

      it('saves the action and emits an approval request for the extension UI', async () => {
        const actionId = 'abcd-1234';
        const listener = jest.fn();

        service.addListener(ApprovalEvent.ApprovalRequested, listener);

        const action = {
          actionId,
          site: {
            domain: runtime.id,
          },
        } as any;

        await service.requestApproval(action, 'sign/transaction');

        expect(openExtensionNewWindow).not.toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith({
          action: {
            ...action,
            windowId: CURRENT_WINDOW_ID,
          },
          url: `sign/transaction?actionId=${actionId}`,
        });
        expect(actionsService.addAction).toHaveBeenCalledWith(action);
      });
    });

    describe('when sidepanel is not opened', () => {
      it('saves the action and opens a new extension window for dApp-triggered requests', async () => {
        const windowId = 1234;
        const actionId = 'abcd-1234';

        jest.mocked(openExtensionNewWindow).mockResolvedValue({
          id: windowId,
        } as any);

        const action = {
          actionId,
          site: {
            domain: 'core.app',
          },
        } as any;

        await service.requestApproval(action, 'sign/transaction');

        expect(openExtensionNewWindow).toHaveBeenCalledWith(
          `sign/transaction?actionId=${actionId}`,
        );
        expect(actionsService.addAction).toHaveBeenCalledWith({
          ...action,
          popupWindowId: windowId,
        });
      });
    });

    describe('with in-app requests', () => {
      it('saves the action and emits an approval request for the extension UI', async () => {
        const actionId = 'abcd-1234';
        const listener = jest.fn();

        service.addListener(ApprovalEvent.ApprovalRequested, listener);

        const action = {
          actionId,
          windowId: CURRENT_WINDOW_ID,
          site: {
            domain: runtime.id,
          },
        } as any;

        await service.requestApproval(action, 'sign/transaction');

        expect(listener).toHaveBeenCalledWith({
          action,
          url: `sign/transaction?actionId=${actionId}`,
        });
        expect(actionsService.addAction).toHaveBeenCalledWith(action);
      });
    });
  });
});
