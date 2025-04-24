import browser from 'webextension-polyfill';
import { Actions } from '@core/types';

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
    return {};
  }, {});
}
