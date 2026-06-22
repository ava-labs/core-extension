import { hasDefined, isNotNullish } from '@core/common';
import { Action, EnsureDefined, JsonRpcRequestContext } from '@core/types';

export const hasRecurringSwapsContext = (
  context: Action['context'],
): context is EnsureDefined<JsonRpcRequestContext, 'recurringSwaps'> =>
  isNotNullish(context) && hasDefined(context, 'recurringSwaps');
