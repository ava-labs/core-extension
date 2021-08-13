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
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';

export function AllDone({ onCancel }: { onCancel(): void }) {
  const { setFinalized } = useOnboardingContext();
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
        <SecondaryButton onClick={() => onCancel && onCancel()}>
          Back
        </SecondaryButton>
        <PrimaryButton onClick={() => setFinalized()}>
          Take me to my wallet
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
