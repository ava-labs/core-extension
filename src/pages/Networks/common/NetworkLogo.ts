import { styled } from '@avalabs/k2-components';

export const NetworkLogoContainer = styled('div')`
  width: 32px;
  height: 32px;
  position: relative;
`;

export const AnimatedGlobeIconContainer = styled('div')<{
  isFavorited: boolean;
  position: number;
}>`
  width: 32px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &.item-enter {
    opacity: 1;
    transform: scale(1);
    top: 0;
    left: 0;
  }
  &.item-enter-active {
    opacity: 0;
    top: ${({ position }) => (position ? `-${position * 65}px` : 0)};
    left: 40px;
    transform: scale(0);
    transition: top 500ms ease-in-out, opacity 750ms ease-in-out,
      left 500ms ease-in-out, transform 550ms ease-in-out;
  }
`;

export const AnimatedNetworkLogo = styled('img')<{
  isFavorited: boolean;
  position: number;
}>`
  width: 32px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &.item-enter {
    opacity: 1;
    transform: scale(1);
    top: 0;
    left: 0;
  }
  &.item-enter-active {
    opacity: 0;
    top: ${({ position }) => (position ? `-${position * 65}px` : 0)};
    left: 40px;
    transform: scale(0);
    transition: top 500ms ease-in-out, opacity 750ms ease-in-out,
      left 500ms ease-in-out, transform 550ms ease-in-out;
  }
`;
