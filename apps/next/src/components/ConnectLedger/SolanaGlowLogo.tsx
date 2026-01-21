import { Stack, StackProps } from '@avalabs/k2-alpine';
import { FC } from 'react';
import SolanaGlow from './images/SolanaGlow.png';

export const SolanaGlowLogo: FC<StackProps> = (props) => {
  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      height="100%"
      {...props}
    >
      <img src={SolanaGlow} alt="Solana Glowing Logo" height="270px" />
    </Stack>
  );
};
