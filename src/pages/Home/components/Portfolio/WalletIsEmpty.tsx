import { Typography, VerticalFlex } from '@avalabs/react-components';

export function WalletIsEmpty() {
  return (
    <VerticalFlex margin="48px 0 0" align="center">
      <Typography size={18} height="22px" weight={600}>
        Your wallet is empty
      </Typography>
      <Typography size={14} align="center" height="17px" margin="8px 0">
        Click the plus button below to add
        <br />
        tokens to your wallet.
      </Typography>
    </VerticalFlex>
  );
}
