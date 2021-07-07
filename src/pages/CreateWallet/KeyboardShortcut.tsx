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
import { useStore } from '@src/store/store';

export const KeyboardShortcut = () => {
  const { goToNextOnboardingStep, goBackToPreviousOnboardingStep } =
    useOnboardState(OnboardStepPhase.KEYBOARD_SHORTCUT);
  const { onboardStore } = useStore();

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
            onboardStore.isOnboarded = true;
            goToNextOnboardingStep && goToNextOnboardingStep();
          }}
        >
          Finish
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};
