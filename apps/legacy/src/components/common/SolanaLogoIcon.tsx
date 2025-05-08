import { Box, SxProps } from '@avalabs/core-k2-components';

import solanaLogo from '@/images/logos/solana-logo.png';

export const SolanaLogoIcon = ({
  size = 16,
  sx,
}: {
  size?: number;
  sx?: SxProps;
}) => {
  return (
    <Box
      sx={{
        height: size,
        width: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <img src={solanaLogo} alt="Solana Logo" height="100%" />
    </Box>
  );
};
