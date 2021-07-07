import React from 'react';
import { OnboardStepPhase } from '@src/store/onboard/onboardStore';
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
import { useOnboardState } from '@src/store/onboard/useOnboardState';
import { useStore } from '@src/store/store';

function component() {
  const [isCopied, setIsCopied] = useState(false);

  const { goToNextOnboardingStep } = useOnboardState(OnboardStepPhase.MNEMONIC);
  const { walletStore } = useStore();
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
          <Mneumonic phrase={walletStore.mnemonic} />
          <br />
          <HorizontalFlex>
            <SecondaryButton
              onClick={() => {
                setIsCopied(true);
                navigator.clipboard.writeText(walletStore.mnemonic);
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
