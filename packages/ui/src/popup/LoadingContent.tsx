import { Stack, styled } from '@avalabs/core-k2-components';

import { useAppDimensions } from '@/hooks/useAppDimensions';

const LogoContainer = styled('div')`
  img {
    width: 80px;
    animation: 6s ease-in-out infinite pulse;
  }
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(2);
    }
    100% {
      transform: scale(1);
    }
  }
  animation: 6s ease-in infinite fade;
`;

export function LoadingContent() {
  const dimensions = useAppDimensions();

  return (
    <Stack
      sx={{
        width: dimensions.width || '100%',
        height: dimensions.height || '100vh',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LogoContainer>
        <img src="/images/Core_logo_white_text_black_background.svg" />
      </LogoContainer>
    </Stack>
  );
}
