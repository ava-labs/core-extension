import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlinePassword } from 'react-icons/md';
import { Button, EncryptedIcon, Stack, StackProps } from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';

import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';

type SeedlessMfaSetupScreenProps = StackProps & {
  onSkip: () => void;
  nextScreenPath: string;
};
export const SeedlessMfaSetupScreen: FC<SeedlessMfaSetupScreenProps> = ({
  onSkip,
  nextScreenPath,
  ...stackProps
}) => {
  const { t } = useTranslation();

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
        <CardMenu>
          <CardMenuItem
            // link="/onboarding/seedless/mfa-setup/fido?type=passkey"
            onClick={() => alert('Not implemented yet')}
            icon={<MdOutlinePassword size={24} />}
            text={t('Passkey')}
            description={t(
              `Passkeys are used for quick, password-free recovery and enhanced security.`,
            )}
          />
          <CardMenuItem
            // link="/onboarding/seedless/mfa-setup/authenticator"
            onClick={() => alert('Not implemented yet')}
            icon={<EncryptedIcon size={24} />}
            text={t('Authenticator app')}
            description={t(
              `Authenticator apps generate secure, time-based codes for wallet recovery.`,
            )}
          />
          <CardMenuItem
            // link="/onboarding/seedless/mfa-setup/fido?type=yubikey"
            onClick={() => alert('Not implemented yet')}
            icon={<MdOutlinePassword size={24} />} // TODO: replace with YubiKey icon
            text={t('Yubikey')}
            description={t(
              `Use a YubiKey for physical, hardware-based protection and strong authentication.`,
            )}
          />
        </CardMenu>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <Button
          sx={{ minWidth: 150, alignSelf: 'flex-end' }}
          variant="contained"
          color="secondary"
          onClick={onSkip}
        >
          {t('Skip')}
        </Button>
      </OnboardingStepActions>
    </Stack>
  );
};
