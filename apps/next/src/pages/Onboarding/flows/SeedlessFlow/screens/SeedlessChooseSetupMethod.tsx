import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlinePassword } from 'react-icons/md';
import {
  Divider,
  EncryptedIcon,
  SecurityKeyIcon,
  Stack,
  StackProps,
} from '@avalabs/k2-alpine';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';

import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';

import { NewMfaMethod } from '../types';
import { useSeedlessActions } from '@core/ui';
import { SEEDLESS_ACTIONS_OPTIONS } from '@/pages/Onboarding/config';

type SeedlessChooseSetupMethodProps = StackProps & {
  onMethodChosen: (method: NewMfaMethod) => void;
};
export const SeedlessChooseSetupMethod: FC<SeedlessChooseSetupMethodProps> = ({
  onMethodChosen,
  ...stackProps
}) => {
  const { t } = useTranslation();
  const { setTotal } = useModalPageControl();
  const { loginWithoutMFA } = useSeedlessActions(SEEDLESS_ACTIONS_OPTIONS);

  useEffect(() => {
    setTotal(0);
  }, [setTotal]);

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <FullscreenModalTitle>
        {t(`Add optional recovery methods`)}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(
          `Add optional recovery methods to securely restore access in case you lose your credentials.`,
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent>
        <CardMenu
          sx={{ padding: 0, overflow: 'hidden' }}
          divider={<Divider sx={{ ml: 8, mr: 3, my: '0 !important' }} />}
        >
          <CardMenuItem
            onClick={() => onMethodChosen('passkey')}
            icon={<MdOutlinePassword size={24} />}
            text={t('Passkey')}
            description={t(
              `Passkeys are used for quick, password-free recovery and enhanced security.`,
            )}
          />
          <CardMenuItem
            onClick={() => onMethodChosen('totp')}
            icon={<EncryptedIcon size={24} />}
            text={t('Authenticator app')}
            description={t(
              `Authenticator apps generate secure, time-based codes for wallet recovery.`,
            )}
          />
          <CardMenuItem
            onClick={() => onMethodChosen('yubikey')}
            icon={<SecurityKeyIcon size={24} />}
            text={t('Yubikey')}
            description={t(
              `Use a YubiKey for physical, hardware-based protection and strong authentication.`,
            )}
          />
        </CardMenu>
      </FullscreenModalContent>
      <FullscreenModalActions>
        <NavButton
          color="secondary"
          onClick={() => {
            loginWithoutMFA();
            onMethodChosen('none');
          }}
        >
          {t('Skip')}
        </NavButton>
      </FullscreenModalActions>
    </Stack>
  );
};
