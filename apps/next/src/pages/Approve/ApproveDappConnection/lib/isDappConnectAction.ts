import { Action } from '@core/types';

import { ConnectDappDisplayData } from '../types';

export const isDappConnectAction = (
  action: Action<unknown>,
): action is Action<ConnectDappDisplayData> => {
  if (!action.displayData || typeof action.displayData !== 'object') {
    return false;
  }

  return 'addressVM' in action.displayData;
};
