import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  PrimaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import { OnboardingStepHeader } from '../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

interface ConfirmPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function ConfirmPhrase({
  onCancel,
  onNext,
  onBack,
  mnemonic,
}: ConfirmPhraseProps) {
  const { capture } = useAnalyticsContext();
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        testId="confirm-phrase"
        title={t('Verify Secret Recovery Phrase')}
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex
        data-testid="confirm-phrase-section"
        align="center"
        grow="1"
      >
        <Typography align="center" margin="8px 0 32px" size={14} height="17px">
          <Trans i18nKey="Select the words below to verify your <br />secret recovery phrase." />
        </Typography>
        <Mnemonic
          phrase={mnemonic}
          confirmMnemonic={true}
          onConfirmedChange={(confirmed) => {
            setTermsConfirmed(confirmed);
          }}
        />
      </VerticalFlex>
      <VerticalFlex align="center">
        <PrimaryButton
          data-testid="confirm-phrase-next-button"
          width="343px"
          size={ComponentSize.LARGE}
          disabled={!termsConfirmed}
          onClick={() => {
            capture('OnboardingMnemonicVerified');
            onNext();
          }}
        >
          {t('Next')}
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
