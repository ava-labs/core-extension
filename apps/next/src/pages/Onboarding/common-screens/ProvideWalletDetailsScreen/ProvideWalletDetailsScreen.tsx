import { Stack, styled } from '@avalabs/k2-alpine';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isNewsletterConfigured } from '@core/common';
import { useKeyboardShortcuts } from '@core/ui';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { NavButton } from '../../components/NavButton';
import { AirdropSection } from './components/AirdropSection';
import { MarketingAgreementSection } from './components/MarketingAgreementSection';
import { PasswordSection } from './components/PasswordSection';
import { TermsAgreementSection } from './components/TermsAgreementSection';
import { WalletNameSection } from './components/WalletNameSection';

type SectionsValidity = {
  password: boolean;
  newsletter: boolean;
  terms: boolean;
};

type ProvideWalletDetailsScreenProps = OnboardingScreenProps & {
  onNext: VoidFunction;
};

export const ProvideWalletDetailsScreen: FC<
  ProvideWalletDetailsScreenProps
> = ({ step, totalSteps, onNext }) => {
  const { t } = useTranslation();
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

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: isFormValid ? onNext : undefined,
  });

  return (
    <>
      <Stack
        pb={1.5}
        overflow="auto"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        {...keyboardHandlers}
      >
        <FullscreenModalTitle>
          {t('Fill out your wallet details')}
        </FullscreenModalTitle>
        <FullscreenModalDescription maxWidth={360}>
          {t(
            'A few more details are needed before getting any further with your wallet creation',
          )}
        </FullscreenModalDescription>
        <FullscreenModalContent
          sx={{ overflow: 'unset' }}
          gap={2}
          justifyContent="space-between"
        >
          <WalletNameSection />
          <PasswordSection onValidityChange={onPasswordValidityChange} />
          <AirdropSection />
          {isNewsletterConfigured() && (
            <MarketingAgreementSection
              onValidityChange={onNewsletterValidityChange}
            />
          )}
        </FullscreenModalContent>
      </Stack>
      <FooterSection py={2} {...keyboardHandlers}>
        <TermsAgreementSection onValidityChange={onTermsValidityChange} />
      </FooterSection>
      <FullscreenModalActions>
        <NavButton disabled={!isFormValid} color="primary" onClick={onNext}>
          {t('Next')}
        </NavButton>
      </FullscreenModalActions>
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
