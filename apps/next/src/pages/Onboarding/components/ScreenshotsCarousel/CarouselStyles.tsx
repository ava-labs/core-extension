import { Box, Stack, styled } from '@avalabs/k2-alpine';

export const SlidesContainer = styled(Stack)`
  flex-direction: row;
  transition: width 0.2s ease-in-out;
  align-items: center;
  position: relative;
  aspect-ratio: 640 / 1200; // Based on size of screenshot assets

  @media (min-width: 800px) {
    display: flex;
    width: 50%;
  }

  @media (min-width: 1200px) {
    width: min(40%, 300px);
  }
`;

type CarouselSlidePhase = 'active' | 'next' | 'previous';
type CarouselSlideProps = {
  phase: CarouselSlidePhase;
};

export const CarouselSlide = styled(Box, {
  shouldForwardProp: (p) => p !== 'src' && p !== 'phase',
})<CarouselSlideProps>(({ phase }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  height: '100%',
  maxHeight: 450,
  aspectRatio: 640 / 1200,
  overflow: 'hidden',
  willChange: 'transform, box-shadow, z-index',
  transitionProperty: 'transform, box-shadow, z-index',
  transitionDuration: '0.4s, 0.4s, 0.4s',
  transitionDelay: '0ms, 0ms, 0.2s',
  borderRadius: 15,
  ...getStyleForPhase(phase),
}));

const getStyleForPhase = (phase: CarouselSlidePhase) => {
  switch (phase) {
    case 'active':
      return {
        zIndex: 2,
        boxShadow: `0px 0px 20px 10px rgba(0, 0, 0, 0.4)`,
        transform: `scale(1) translateX(0) translateY(calc(-50% + 10px))`,
        transitionDelay: '0ms',
      };
    case 'next':
      return {
        zIndex: 1,
        boxShadow: `0px 0px 0 0px rgba(0, 0, 0, 0.0)`,
        transform: `scale(0.95) translateX(50%) translateY(-50%)`,
        '@media(min-width: 1200px)': {
          transform: `scale(0.95) translateX(80%) translateY(-50%)`,
        },
      };
    case 'previous':
      return {
        zIndex: 0,
        boxShadow: `0px 0px 0 0px rgba(0, 0, 0, 0.0)`,
        transform: `scale(0.95) translateX(-50%) translateY(-50%)`,
        '@media(min-width: 1200px)': {
          transform: `scale(0.95) translateX(-80%) translateY(-50%)`,
        },
      };
  }
};
