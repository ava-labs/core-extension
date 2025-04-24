import { Actions, ActionsEvent, ExtensionConnectionEvent } from '@core/types';

export const isActionsUpdate = (
  ev: ExtensionConnectionEvent,
): ev is ExtensionConnectionEvent<Actions> =>
  ev.name === ActionsEvent.ACTION_UPDATED;
