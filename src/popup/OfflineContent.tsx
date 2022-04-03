import { Typography, VerticalFlex } from '@avalabs/react-components';
import { BrandName } from '@src/components/icons/BrandName';
import { Logo } from '@src/components/icons/Logo';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import styled from 'styled-components';

export const AnimatedLogo = styled.div`
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
    <VerticalFlex
      align="center"
      justify="center"
      grow="1"
      height={dimensions.height}
      width={dimensions.width}
      padding="16px"
    >
      <AnimatedLogo>
        <Logo height={96} />
      </AnimatedLogo>
      <BrandName height={42} animated />
      {message && (
        <Typography size={16} align="center" height="24px" margin="32px 0">
          {message}
        </Typography>
      )}
    </VerticalFlex>
  );
}
