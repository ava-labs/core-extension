import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { Actions, ActionsEvent } from '../models';

export const isActionsUpdate = (
  ev: ExtensionConnectionEvent
): ev is ExtensionConnectionEvent<Actions> =>
  ev.name === ActionsEvent.ACTION_UPDATED;
