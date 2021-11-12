import React, { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  TextArea,
  PrimaryButton,
  RecoveryPhraseIcon,
  TextButton,
  ComponentSize,
  HorizontalFlex,
  CaretIcon,
  IconDirection,
  CloseIcon,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useTheme } from 'styled-components';
import * as bip39 from 'bip39';

interface ImportProps {
  onCancel(): void;
  onBack(): void;
}

export const Import = ({ onCancel, onBack }: ImportProps) => {
  const theme = useTheme();
  const { setMnemonic } = useOnboardingContext();
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [error, setError] = useState('');

  const onPhraseChanged = (e) => {
    const phrase = e.currentTarget.value;
    setRecoveryPhrase(phrase);
    if (
      phrase &&
      phrase.split(' ').length === 24 &&
      !bip39.validateMnemonic(phrase)
    ) {
      setError('Invalid mnemonic phrase');
    } else {
      setError('');
    }
  };

  const nextButtonDisabled =
    !(recoveryPhrase && recoveryPhrase.split(' ').length === 24) || !!error;

  return (
    <VerticalFlex width="100%" align="center" padding="16px 0">
      <HorizontalFlex width="100%" justify="space-between" align="center">
        <TextButton onClick={onBack}>
          <CaretIcon
            direction={IconDirection.LEFT}
            height="18px"
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography as="h1" size={24} weight={700} height="29px">
          Secret Recovery Phrase
        </Typography>
        <TextButton onClick={onCancel}>
          <CloseIcon height="18px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 0" height="24px">
          Access an existing wallet with your
          <br />
          secret recovery phrase.
        </Typography>
        <TextArea
          margin="40px 0 0 0"
          error={!!error}
          errorMessage={error}
          placeholder="Type your recovery phrase"
          onChange={onPhraseChanged}
        ></TextArea>
      </VerticalFlex>
      <VerticalFlex align="center" margin="0 0 40px">
        <PrimaryButton
          size={ComponentSize.LARGE}
          disabled={nextButtonDisabled}
          onClick={async () => {
            setMnemonic(recoveryPhrase);
          }}
        >
          Enter
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
};
