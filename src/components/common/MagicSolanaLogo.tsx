import { Box, Stack } from '@avalabs/core-k2-components';

import SolanaBg from '@src/images/solana-bg.svg';
import SolanaLogo from '@src/images/solana-logo.svg';

export const MagicSolanaLogo = ({
  outerSize,
  innerSize,
}: {
  outerSize: number;
  innerSize: number;
}) => (
  <Stack
    sx={{
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
      height: outerSize - 40,
    }}
  >
    <Box
      sx={{
        width: innerSize,
        height: innerSize,
        backgroundColor: '#000',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '::before': {
          content: '""',
          position: 'absolute',
          width: outerSize,
          height: outerSize,
          borderRadius: '50%',
          backgroundImage: `url(${SolanaBg})`,
          backgroundSize: `${outerSize}px ${outerSize}px`,
          backgroundPosition: 'center',
          zIndex: -1,
        },
      }}
    >
      <img src={SolanaLogo} alt="Solana Logo" />
    </Box>
  </Stack>
);
