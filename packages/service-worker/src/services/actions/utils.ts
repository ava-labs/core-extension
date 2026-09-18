import browser from 'webextension-polyfill';
import { Action, Actions, MultiTxAction } from '@core/types';

/**
 * Filters out actions from the actions list without an open window
 */
export async function filterStaleActions(
  actionsInStorage: Actions,
): Promise<Actions> {
  const openWindowIds = (await browser.windows.getAll())
    .filter((w) => w.type === 'popup')
    .map((w) => w.id);

  return Object.keys(actionsInStorage).reduce((acc, actionId) => {
    const action = actionsInStorage[actionId];
    if (
      action?.popupWindowId &&
      openWindowIds.includes(action?.popupWindowId)
    ) {
      return { ...acc, [actionId]: action };
    }
    return acc;
  }, {});
}

/**
 * The tab an action was requested from. Module-handled actions carry it at the
 * top level (from the request context), legacy handler actions carry it on the
 * site metadata.
 */
export function getActionTabId(
  action: Action | MultiTxAction,
): number | undefined {
  return action.tabId ?? action.site?.tabId;
}

/**
 * The domain an action was requested from. Both sources are derived by the
 * background from `port.sender.url`, never from anything the page reports.
 */
export function getActionDomain(
  action: Action | MultiTxAction,
): string | undefined {
  if (action.site?.domain) {
    return action.site.domain;
  }

  if (!action.dappInfo?.url) {
    return undefined;
  }

  try {
    return new URL(action.dappInfo.url).hostname;
  } catch {
    return undefined;
  }
}
