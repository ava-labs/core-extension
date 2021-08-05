import React, { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  HorizontalSeparator,
  HorizontalFlex,
  SecondaryCard,
  TextArea,
  PrimaryButton,
  SecondaryButton,
} from '@avalabs/react-components';
import { onboardingService } from '@src/background/services';

export const Import = ({ onCancel }: { onCancel(): void }) => {
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  /**
   * Not putting in error handling yet, need more info on how to get this done properly
   * @link https://ava-labs.atlassian.net/browse/PM-200
   */
  const [_errorMsg, setErrorMsg] = useState('');

  const verifyRecoveryPhrase = (phrase: string) => {
    return !!(phrase && phrase.split(' ').length === 24);
  };

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <br />
      <HorizontalFlex>
        <Typography>Import your wallet</Typography>
      </HorizontalFlex>
      <HorizontalSeparator />
      <br />
      <br />
      <SecondaryCard>
        <Mnemonic phrase={recoveryPhrase} />
      </SecondaryCard>
      <br />
      <TextArea onChange={(e) => setRecoveryPhrase(e.currentTarget.value)} />
      <HorizontalFlex>
        <SecondaryButton
          onClick={() => {
            onCancel && onCancel();
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          disabled={!verifyRecoveryPhrase(recoveryPhrase)}
          onClick={async () => {
            onboardingService.setMnemonic(recoveryPhrase);
          }}
        >
          Next
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};
