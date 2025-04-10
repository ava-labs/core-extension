import browser from 'webextension-polyfill';

import { openExtensionNewWindow } from '@src/utils/extensionUtils';

import { ActionsService } from '../actions/ActionsService';
import { ApprovalService } from './ApprovalService';
import { ApprovalEvent } from './models';

jest.mock('@src/utils/extensionUtils');

describe('src/background/services/approvals/ApprovalService', () => {
  let service: ApprovalService;

  const actionsService: jest.Mocked<ActionsService> = {
    addAction: jest.fn(),
  } as any;

  beforeEach(() => {
    service = new ApprovalService(actionsService);
  });

  describe('.requestApproval()', () => {
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

    it('saves the action and emits an approval request for extension-triggered requests', async () => {
      const actionId = 'abcd-1234';
      const listener = jest.fn();

      service.addListener(ApprovalEvent.ApprovalRequested, listener);

      const action = {
        actionId,
        site: {
          domain: browser.runtime.id,
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
