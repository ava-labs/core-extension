import { Button, Box } from '@avalabs/k2-alpine';
import { FC } from 'react';

const AddOrConnectWalletButton: FC = () => (
  <Box position="fixed" bottom={0} left={0} right={0} p={1.5}>
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={() => alert('Under development')}
    >
      Add or connect a wallet
    </Button>
  </Box>
);

export default AddOrConnectWalletButton;
