import { ReactElement } from 'react';
import { TFunction } from 'react-i18next';
import {
  EncryptedIcon,
  PasswordIcon,
  SecurityKeyIcon,
} from '@avalabs/k2-alpine';

export const MethodIcons = {
  passkey: <PasswordIcon size={24} />,
  authenticator: <EncryptedIcon size={24} />,
  yubikey: <SecurityKeyIcon size={24} />,
} as const;

export type RecoveryMethodType = 'passkey' | 'authenticator' | 'yubikey';

export interface RecoveryMethodCardConfig {
  icon: ReactElement;
  title: string;
  description: string;
  to: string;
  analyticsKey: string;
  method: RecoveryMethodType;
  isOn: boolean;
  newTab?: boolean;
}

interface GetRecoveryMethodCardsParams {
  t: TFunction;
  isPasskeyOn: boolean;
  isYubikeyOn: boolean;
  isAuthenticatorOn: boolean;
  hasMFAConfigured: boolean;
}

export const getRecoveryMethodCards = ({
  t,
  isPasskeyOn,
  isYubikeyOn,
  isAuthenticatorOn,
  hasMFAConfigured,
}: GetRecoveryMethodCardsParams): RecoveryMethodCardConfig[] => [
  {
    icon: MethodIcons.passkey,
    title: t('Passkey'),
    description: t(
      'Passkeys are used for quick, password-free recovery and enhanced security.',
    ),
    to: 'update-recovery-method/fido/add/passkey',
    analyticsKey: 'AddPasskeyClicked',
    method: 'passkey',
    isOn: isPasskeyOn,
  },
  {
    icon: MethodIcons.authenticator,
    title: t('Authenticator app'),
    description: t(
      'Authenticator apps generate secure, time-based codes for wallet recovery.',
    ),
    // add url for in-extension version
    to: !hasMFAConfigured
      ? '/settings/recovery-method/authenticator'
      : 'update-recovery-method/totp/add',
    analyticsKey: 'AddAuthenticatorClicked',
    method: 'authenticator',
    newTab: !hasMFAConfigured ? false : true,
    isOn: isAuthenticatorOn,
  },
  {
    icon: MethodIcons.yubikey,
    title: t('Yubikey'),
    description: t(
      'YubiKeys are physical, hardware-based protection and strong authentication.',
    ),
    to: 'update-recovery-method/fido/add/yubikey',
    analyticsKey: 'AddYubikeyClicked',
    method: 'yubikey',
    isOn: isYubikeyOn,
  },
];
