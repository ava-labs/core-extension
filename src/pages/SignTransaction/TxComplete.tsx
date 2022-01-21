import {
  HorizontalFlex,
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';

export function TxComplete({ hash }: { hash?: string }) {
  return (
    <VerticalFlex>
      <Typography>Tx Finished</Typography>
      <Typography>{hash}</Typography>
      <HorizontalFlex>
        <PrimaryButton onClick={() => window.close()}>Close</PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
