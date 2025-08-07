import { css, keyframes } from '@avalabs/k2-alpine';
import { Keyframes } from '@emotion/react';

const createAnimation = (
  animation: Keyframes,
  duration: string = '0.3s',
  easing: string = 'ease-in-out',
) => css`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${animation} ${duration} ${easing};
  }
`;

const shake = keyframes`
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
`;

export default {
  shake: createAnimation(shake),
};
