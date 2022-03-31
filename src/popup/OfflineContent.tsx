import { Typography, VerticalFlex } from '@avalabs/react-components';
import { BrandName } from '@src/components/icons/BrandName';
import { Logo } from '@src/components/icons/Logo';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import styled from 'styled-components';

const AnimatedLogo = styled.div`
  @keyframes fade {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  animation: 5s ease-in infinite fade;
`;

export function OfflineContent() {
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
      <BrandName height={42} />
      <Typography size={16} align="center" height="24px" margin="32px 0">
        Ooops... It seems you don&apos;t have internet connection
      </Typography>
    </VerticalFlex>
  );
}
