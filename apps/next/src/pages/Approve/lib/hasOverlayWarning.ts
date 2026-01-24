import { AlertType, DisplayData } from '@avalabs/vm-module-types';
import { Action, MultiTxAction, EnsureDefined } from '@core/types';

type AnyAction = Action | MultiTxAction;
type ActionWithAlert =
  | Action<EnsureDefined<DisplayData, 'alert'>>
  | (MultiTxAction & { displayData: EnsureDefined<DisplayData, 'alert'> });

export const hasOverlayWarning = (
  action: AnyAction,
): action is ActionWithAlert =>
  action.displayData?.alert?.type === AlertType.DANGER;
