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

export const KeyboardShortcut = () => {
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
        <SecondaryButton>Back</SecondaryButton>
        <PrimaryButton>Finish</PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};
