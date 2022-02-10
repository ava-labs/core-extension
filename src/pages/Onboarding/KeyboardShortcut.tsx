import {
  VerticalFlex,
  Typography,
  HorizontalSeparator,
  PrimaryButton,
  SecondaryButton,
  HorizontalFlex,
  Card,
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

      <Card>
        <HorizontalFlex justify={'center'}>
          <Typography>List of shortcuts here?</Typography>
        </HorizontalFlex>
      </Card>
      <br />

      <HorizontalFlex>
        <SecondaryButton>Back</SecondaryButton>
        <PrimaryButton>Finish</PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};
