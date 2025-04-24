import { ExtensionConnectionEvent } from '../../../connections/models';
import { Actions, ActionsEvent } from '@core/types/src/models';

export const isActionsUpdate = (
  ev: ExtensionConnectionEvent,
): ev is ExtensionConnectionEvent<Actions> =>
  ev.name === ActionsEvent.ACTION_UPDATED;
