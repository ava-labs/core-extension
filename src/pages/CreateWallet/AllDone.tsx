import React from 'react';
import {
  VerticalFlex,
  Typography,
  HorizontalSeparator,
  PrimaryButton,
  SecondaryButton,
  HorizontalFlex,
  SecondaryCard,
} from '@avalabs/react-components';
import { useOnboardState } from '@src/store/onboard/useOnboardState';
import { OnboardStepPhase } from '@src/store/onboard/onboardStore';
import { useHistory } from 'react-router-dom';
import { OnboardingPhase } from '@src/background/services/onboarding/models';

export function AllDone() {
  const history = useHistory();
  const { goBackToPreviousOnboardingStep } = useOnboardState(
    OnboardingPhase.FINALIZE
  );
  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <Typography>Congratulations, youre all set up</Typography>
      <HorizontalSeparator />
      <br />
      <br />
      <SecondaryCard>
        <HorizontalFlex justify={'center'}>
          <Typography>
            Here can be a list of guides, tips and social media info
          </Typography>
        </HorizontalFlex>
      </SecondaryCard>
      <br />
      <HorizontalFlex>
        <SecondaryButton
          onClick={() =>
            goBackToPreviousOnboardingStep && goBackToPreviousOnboardingStep()
          }
        >
          Back
        </SecondaryButton>
        <PrimaryButton onClick={() => history.push('/wallet')}>
          Take me to my wallet
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
