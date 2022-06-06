import { VerticalFlex } from '@avalabs/react-components';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import styled from 'styled-components';

const LogoContainer = styled.div`
  img {
    width: 37px;
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
    <VerticalFlex
      align="center"
      justify="center"
      grow="1"
      height={dimensions.height || '100vh'}
      width={dimensions.width || '100%'}
    >
      <LogoContainer>
        <img src="/images/icon-256.png" />
      </LogoContainer>
    </VerticalFlex>
  );
}
