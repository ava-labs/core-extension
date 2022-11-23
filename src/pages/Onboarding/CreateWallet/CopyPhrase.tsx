import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  PrimaryButton,
  Checkbox,
  ComponentSize,
} from '@avalabs/react-components';
import { OnboardingStepHeader } from '../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Trans, useTranslation } from 'react-i18next';

interface CopyPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function CopyPhrase({
  onCancel,
  onBack,
  onNext,
  mnemonic,
}: CopyPhraseProps) {
  const { capture } = useAnalyticsContext();
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        testId="copy-phrase"
        title={t('Secret Recovery Phrase')}
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex align="center" grow="1" data-testid="copy-phrase-section">
        <Typography align="center" margin="8px 0 32px" size={14} height="17px">
          <Trans i18nKey="This is your secret recovery phrase. Write it down, and <br />store it in a secure location." />
        </Typography>
        <Mnemonic
          phrase={mnemonic}
          confirmMnemonic={false}
          onConfirmedChange={() => {
            //noop, confirmation is next step
          }}
        />
      </VerticalFlex>
      <VerticalFlex
        align="center"
        data-testid="recovery-phrase-continue-section"
      >
        <Checkbox
          label={t(
            `I understand losing this phrase will result in lost funds.\nI have stored it in a secure location.`
          )}
          onChange={setTermsConfirmed}
        />
        <PrimaryButton
          data-testid="recovery-phrase-next-button"
          width="343px"
          margin="16px 0 0 0"
          size={ComponentSize.LARGE}
          disabled={!termsConfirmed}
          onClick={() => {
            capture('OnboardingMnemonicCreated');
            onNext();
          }}
        >
          {t('Next')}
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
