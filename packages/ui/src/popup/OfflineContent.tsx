import { Stack, Typography, styled } from '@avalabs/core-k2-components';

import { BrandName } from 'packages/ui/src/components/icons/BrandName';
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
  animation: 4s ease-in infinite fade;
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
        <BrandName height={42} />
      </AnimatedLogo>
      {message && (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
          {message}
        </Typography>
      )}
    </Stack>
  );
}
