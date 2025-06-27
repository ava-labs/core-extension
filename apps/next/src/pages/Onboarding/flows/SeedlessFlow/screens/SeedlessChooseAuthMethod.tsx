import { FC } from 'react';
import { EncryptedIcon } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { MdOutlinePassword } from 'react-icons/md';

import { RecoveryMethod } from '@core/types';

import {
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';
import { CardMenu, CardMenuItem } from '@/pages/Onboarding/components/CardMenu';

type SeedlessChooseAuthMethodProps = {
  methods: RecoveryMethod[];
  onMethodChosen: (method: RecoveryMethod) => void;
};

export const SeedlessChooseAuthMethod: FC<SeedlessChooseAuthMethodProps> = ({
  methods,
  onMethodChosen,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <OnboardingStepTitle>{t(`Choose a recovery method`)}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(`Choose a recovery method associated with your wallet.`)}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        <CardMenu>
          {methods.map((mfa, index) => {
            if (mfa.type === 'totp') {
              return (
                <CardMenuItem
                  key={mfa.type}
                  onClick={() => onMethodChosen(mfa)}
                  icon={<EncryptedIcon size={24} />}
                  text={t('Authenticator app')}
                  description={t('Verify using your authenticator app.')}
                />
              );
            }

            const description = mfa.name
              ? t('Verify using your previously configured device.')
              : t(
                  'Verify using your previously configured FIDO device. This may be a Passkey or a security key like Yubikey.',
                );

            return (
              <CardMenuItem
                key={`${mfa.type}-${mfa.name}-${index}`}
                onClick={() => onMethodChosen(mfa)}
                icon={<MdOutlinePassword size={24} />} // TODO: proper icon
                text={mfa.name || t('Unnamed FIDO Device')}
                description={description}
              />
            );
          })}
        </CardMenu>
      </OnboardingStepContent>
    </>
  );
};
