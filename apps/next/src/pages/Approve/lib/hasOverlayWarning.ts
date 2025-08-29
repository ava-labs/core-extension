import { AlertType, DisplayData } from '@avalabs/vm-module-types';
import { Action, EnsureDefined } from '@core/types';

export const hasOverlayWarning = (
  action: Action<DisplayData>,
): action is Action<EnsureDefined<DisplayData, 'alert'>> =>
  action.displayData.alert?.type === AlertType.DANGER;
