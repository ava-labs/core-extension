import React from 'react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mneumonic,
  HorizontalSeparator,
  SecondaryCard,
  PrimaryButton,
  SecondaryButton,
  HorizontalFlex,
} from '@avalabs/react-components';
import { useOnboardState } from '@src/pages/Onboarding/useOnboardState';
import { walletService } from '@src/background/services';
import { useEffect } from 'react';
import { OnboardingPhase } from '@src/background/services/onboarding/models';

function component() {
  const [isCopied, setIsCopied] = useState(false);
  const [mnemonic, setMnemonic] = useState('');

  const { goToNextOnboardingStep } = useOnboardState(OnboardingPhase.MNEMONIC);

  useEffect(() => {
    walletService.wallet
      .promisify()
      .then(() => walletService.mnemonic)
      .then(setMnemonic);
  }, []);

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <Typography>Your new wallet phrase</Typography>
      <HorizontalSeparator />
      <br />
      <br />
      <SecondaryCard>
        <VerticalFlex align={'center'}>
          <Typography size={14}>
            This is your Mnemonic phrase, this needs to be kept in a safe place.
          </Typography>
          <br />
          <Mneumonic phrase={mnemonic} />
          <br />
          <HorizontalFlex>
            <SecondaryButton
              onClick={() => {
                setIsCopied(true);
                navigator.clipboard.writeText(mnemonic);
              }}
            >
              {isCopied ? 'Phrase copied' : 'Copy Phrase'}
            </SecondaryButton>
            <PrimaryButton
              disabled={!isCopied}
              onClick={() => goToNextOnboardingStep && goToNextOnboardingStep()}
            >
              Next
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      </SecondaryCard>
    </VerticalFlex>
  );
}

export const CreateWallet = observer(component);
