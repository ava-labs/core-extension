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
import { useHistory } from 'react-router-dom';
import { onboardingService } from '@src/background/services';

export function AllDone({ onCancel }: { onCancel(): void }) {
  const history = useHistory();

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
        <PrimaryButton onClick={() => onboardingService.setFinalized()}>
          Take me to my wallet
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
