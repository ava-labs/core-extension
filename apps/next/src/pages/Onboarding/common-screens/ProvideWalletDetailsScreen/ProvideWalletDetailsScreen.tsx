import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stack, styled } from '@avalabs/k2-alpine';
import { FC, useCallback, useEffect, useState } from 'react';

import { useKeyboardShortcuts } from '@core/ui';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { NavButton } from '../../components/NavButton';
import { PasswordSection } from './components/PasswordSection';
import { AirdropSection } from './components/AirdropSection';
import { WalletNameSection } from './components/WalletNameSection';
import { TermsAgreementSection } from './components/TermsAgreementSection';
import { MarketingAgreementSection } from './components/MarketingAgreementSection';

type SectionsValidity = {
  password: boolean;
  newsletter: boolean;
  terms: boolean;
};

export const ProvideWalletDetailsScreen: FC<OnboardingScreenProps> = ({
  step,
  totalSteps,
  nextScreenPath,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setCurrent, setTotal } = useModalPageControl();

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, totalSteps, step]);

  const [sectionsValidity, setSectionsValidity] = useState<SectionsValidity>({
    password: false,
    newsletter: true,
    terms: false,
  });

  const onPasswordValidityChange = useCallback(
    (isValid: boolean) =>
      setSectionsValidity((prev) => ({ ...prev, password: isValid })),
    [],
  );

  const onNewsletterValidityChange = useCallback(
    (isValid: boolean) =>
      setSectionsValidity((prev) => ({ ...prev, newsletter: isValid })),
    [],
  );

  const onTermsValidityChange = useCallback(
    (isValid: boolean) =>
      setSectionsValidity((prev) => ({ ...prev, terms: isValid })),
    [],
  );

  const isFormValid = Object.values(sectionsValidity).every(Boolean);

  const onNext = useCallback(() => {
    if (!isFormValid) {
      return;
    }

    history.push(nextScreenPath);
  }, [history, isFormValid, nextScreenPath]);

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: onNext,
  });

  return (
    <>
      <Stack
        sx={{
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        {...keyboardHandlers}
      >
        <OnboardingStepTitle>
          {t('Fill out your wallet details')}
        </OnboardingStepTitle>
        <OnboardingStepDescription>
          {t(
            'A few more details are needed before getting any further with your wallet creation',
          )}
        </OnboardingStepDescription>
        <OnboardingStepContent sx={{ overflow: 'unset' }}>
          <Stack
            sx={{ flexGrow: 1, height: 1, justifyContent: 'space-between' }}
          >
            <Stack
              sx={{
                gap: 1.5,
                flexGrow: 1,
              }}
            >
              <WalletNameSection />
              <AirdropSection />
              <PasswordSection onValidityChange={onPasswordValidityChange} />
              <MarketingAgreementSection
                onValidityChange={onNewsletterValidityChange}
              />
            </Stack>
          </Stack>
        </OnboardingStepContent>
      </Stack>
      <FooterSection sx={{ py: 1.5 }} {...keyboardHandlers}>
        <TermsAgreementSection onValidityChange={onTermsValidityChange} />
      </FooterSection>
      <OnboardingStepActions>
        <NavButton disabled={!isFormValid} color="primary" onClick={onNext}>
          {t('Next')}
        </NavButton>
      </OnboardingStepActions>
    </>
  );
};

// Adds a slight border on the top to better indicate scrollable content above
const FooterSection = styled(Stack)(({ theme }) => ({
  flexShrink: 0,
  border: 'inset',
  borderWidth: 0,
  borderTopWidth: 1,
  borderTopColor: theme.palette.divider,
  marginInline: theme.spacing(-4),
  paddingInline: theme.spacing(4),
}));
