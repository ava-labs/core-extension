import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlinePassword } from 'react-icons/md';
import { Divider, EncryptedIcon, Stack, StackProps } from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';

import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';

import { NewMfaMethod } from '../types';

type SeedlessChooseSetupMethodProps = StackProps & {
  onMethodChosen: (method: NewMfaMethod) => void;
};
export const SeedlessChooseSetupMethod: FC<SeedlessChooseSetupMethodProps> = ({
  onMethodChosen,
  ...stackProps
}) => {
  const { t } = useTranslation();
  const { setTotal } = useModalPageControl();

  useEffect(() => {
    setTotal(0);
  }, [setTotal]);

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <OnboardingStepTitle>
        {t(`Add optional recovery methods`)}
      </OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          `Add optional recovery methods to securely restore access in case you lose your credentials.`,
        )}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        <CardMenu divider={<Divider sx={{ ml: 8, mr: 3 }} />}>
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
            icon={<MdOutlinePassword size={24} />} // TODO: replace with YubiKey icon
            text={t('Yubikey')}
            description={t(
              `Use a YubiKey for physical, hardware-based protection and strong authentication.`,
            )}
          />
        </CardMenu>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <NavButton color="secondary" onClick={() => onMethodChosen('none')}>
          {t('Skip')}
        </NavButton>
      </OnboardingStepActions>
    </Stack>
  );
};
