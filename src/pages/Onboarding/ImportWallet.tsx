import React, { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  HorizontalSeparator,
  HorizontalFlex,
  SecondaryCard,
  TextArea,
  PrimaryButton,
  SecondaryButton,
  Mnemonic,
  RecoveryPhraseIcon,
  TextButton,
  Input,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useTheme } from 'styled-components';
import * as bip39 from 'bip39';

export const Import = ({ onCancel }: { onCancel(): void }) => {
  const theme = useTheme();
  const { setMnemonic } = useOnboardingContext();
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [error, setError] = useState('');
  
  const onPhraseChanged = (e) => {
    const phrase = e.currentTarget.value;
    setRecoveryPhrase(phrase)
    if(phrase && phrase.split(' ').length === 24 && !bip39.validateMnemonic(phrase)) {
      setError('Invalid mnemonic phrase');
    } else {
      setError('')
    }
  }

  const nextButtonDisabled = !(recoveryPhrase && recoveryPhrase.split(' ').length === 24) || !!error;

  return (
    <VerticalFlex width="100%" align='center' padding='62px 0 36px' justify="space-between">
      <VerticalFlex align='center'>
        <RecoveryPhraseIcon color={theme.colors.text}  />
        <Typography as="h1" size={24} weight="bold" margin="28px 0 8px">Secret Recovery Phrase</Typography>
        <Typography align="center" margin="0 0 46px" height="24px">
          Access an existing wallet with your<br/>
          Security Recovery Phrase.
        </Typography>    
        <TextArea 
          margin="40px 0 0 0" 
          error={!!error}
          errorMessage={error}
          onChange={onPhraseChanged}></TextArea>
      </VerticalFlex>
      <VerticalFlex align='center'>
        <PrimaryButton
          margin="24px 0"
          disabled={nextButtonDisabled}
          onClick={async () => {
            setMnemonic(recoveryPhrase);
          }}
        >
          Enter
        </PrimaryButton>
        <TextButton
          onClick={() => onCancel()}>Back</TextButton>
      </VerticalFlex>
    </VerticalFlex>
  );
};
