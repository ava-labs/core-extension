import { Box, styled } from '@avalabs/k2-alpine';
import { getHexAlpha } from '@avalabs/k2-alpine';
import { FC, ComponentType } from 'react';

export type IconProps = {
  size?: string | number;
};

export type PendingCirclesProps = {
  Icon: ComponentType<IconProps>;
  size?: number;
  startImmediately?: boolean;
};

export const PendingCircles: FC<PendingCirclesProps> = ({
  Icon,
  size = 24,
  startImmediately = false,
}) => {
  const delayPrefix = startImmediately ? '-' : '';
  return (
    <ConcentricCirclesBox>
      <Circle delay={delayPrefix + '6s'} />
      <Circle delay={delayPrefix + '4s'} />
      <Circle delay={delayPrefix + '2s'} />
      <Circle delay={delayPrefix + '0s'} />
      <Icon size={size} />
    </ConcentricCirclesBox>
  );
};

const Circle = styled(Box, { shouldForwardProp: (prop) => prop !== 'delay' })<{
  delay: string;
}>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border-style: solid;
  position: absolute;
  animation: circle 8s ${({ delay }) => delay} infinite linear;
  border-color: ${({ theme }) => getHexAlpha(theme.palette.text.primary, 0)};
  border-width: 0px;

  @keyframes circle {
    0% {
      transform: scale(0);
      border-width: 0px;
      border-color: ${({ theme }) =>
        getHexAlpha(theme.palette.text.primary, 0)};
    }
    50% {
      transform: scale(1);
      border-width: 1.5px;
      border-color: ${({ theme }) =>
        getHexAlpha(theme.palette.text.primary, 15)};
    }
    100% {
      transform: scale(2);
      border-width: 0px;
      border-color: ${({ theme }) =>
        getHexAlpha(theme.palette.text.primary, 0)};
    }
  }
`;

const ConcentricCirclesBox = styled(Box)({
  width: '90px',
  height: '90px',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
