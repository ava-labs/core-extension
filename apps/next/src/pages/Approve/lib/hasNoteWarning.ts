import { Action, MultiTxAction, EnsureDefined } from '@core/types';
import { AlertType, DisplayData } from '@avalabs/vm-module-types';

type AnyAction = Action | MultiTxAction;
type ActionWithAlert =
  | Action<EnsureDefined<DisplayData, 'alert'>>
  | (MultiTxAction & { displayData: EnsureDefined<DisplayData, 'alert'> });

export const hasNoteWarning = (action: AnyAction): action is ActionWithAlert =>
  action.displayData?.alert?.type === AlertType.WARNING;
