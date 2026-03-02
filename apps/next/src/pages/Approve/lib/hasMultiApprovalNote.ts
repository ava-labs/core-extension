import { hasDefined, isNotNullish } from '@core/common';
import { Action, EnsureDefined, JsonRpcRequestContext } from '@core/types';

export const hasMultiApprovalNote = (
  context: Action['context'],
): context is EnsureDefined<JsonRpcRequestContext, 'actionStep'> =>
  isNotNullish(context) && hasDefined(context, 'actionStep');
