import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { Actions } from '../models';
import { ActionsEvent } from '../models';

export const isActionsUpdate = (
  ev: ExtensionConnectionEvent,
): ev is ExtensionConnectionEvent<Actions> =>
  ev.name === ActionsEvent.ACTION_UPDATED;
