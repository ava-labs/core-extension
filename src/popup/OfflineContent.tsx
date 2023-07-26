import { Stack, Typography, styled } from '@avalabs/k2-components';

import { BetaLabel } from '@src/components/icons/BetaLabel';
import { BrandName } from '@src/components/icons/BrandName';
import { Logo } from '@src/components/icons/Logo';
import { useAppDimensions } from '@src/hooks/useAppDimensions';

export const AnimatedLogo = styled('div')`
  @keyframes fade {
    0% {
      opacity: 1;
    }
    16% {
      opacity: 0.5;
    }
    33% {
      opacity: 1;
    }
  }
  animation: 6s ease-in infinite fade;
`;

interface OfflineContent {
  message?: string;
}

export function OfflineContent({ message }) {
  const dimensions = useAppDimensions();

  return (
    <Stack
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        p: 2,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimatedLogo>
        <Logo height={96} />
      </AnimatedLogo>
      <Stack sx={{ alignItems: 'end' }}>
        <BrandName height={42} />
        <Stack sx={{ my: 0.75 }}>
          <BetaLabel />
        </Stack>
      </Stack>
      {message && (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
          {message}
        </Typography>
      )}
    </Stack>
  );
}
