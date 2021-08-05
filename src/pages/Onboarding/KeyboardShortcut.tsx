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
import { useOnboardState } from '@src/pages/Onboarding/useOnboardState';
import { onboardingService } from '@src/background/services';
import { OnboardingPhase } from '@src/background/services/onboarding/models';

export const KeyboardShortcut = () => {
  const { goToNextOnboardingStep, goBackToPreviousOnboardingStep } =
    useOnboardState(OnboardingPhase.KEYBOARD_SHORTCUT);

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <Typography>Keyboard shortcut</Typography>
      <HorizontalSeparator />
      <br />
      <br />
      <Typography>
        You can open this extension at any time by using this handy keyboard
        shortcut
      </Typography>
      <br />

      <SecondaryCard>
        <HorizontalFlex justify={'center'}>
          <Typography>List of shortcuts here?</Typography>
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
        <PrimaryButton
          onClick={() => {
            onboardingService.markOnboarded();
            goToNextOnboardingStep && goToNextOnboardingStep();
          }}
        >
          Finish
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};
