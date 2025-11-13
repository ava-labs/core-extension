import { RecoveryMethod } from '@core/types';
import { MethodIcons } from './recoveryMethodCards.config';

export const getIconForMethod = (method: RecoveryMethod) => {
  if (method.type === 'totp') {
    return MethodIcons.authenticator;
  }
  if (method.aaguid === '00000000-0000-0000-0000-000000000000') {
    return MethodIcons.yubikey;
  }
  return MethodIcons.passkey;
};
