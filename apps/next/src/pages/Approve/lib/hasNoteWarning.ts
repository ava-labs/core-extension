import { Action, EnsureDefined } from '@core/types';
import { AlertType, DisplayData } from '@avalabs/vm-module-types';

export const hasNoteWarning = (
  action: Action<DisplayData>,
): action is Action<EnsureDefined<DisplayData, 'alert'>> =>
  action.displayData.alert?.type === AlertType.WARNING;
