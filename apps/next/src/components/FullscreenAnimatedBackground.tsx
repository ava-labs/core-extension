import { keyframes, Stack, styled } from '@avalabs/k2-alpine';

const anim = keyframes`
  0% {
    --angle: 0deg;
		--top: 100px;
		--right: -100px;
		--blur: 75px;
  }

	50% {
		--angle: 180deg;
		--top: 200px;
		--right: 0px;
		--blur: 100px;
	}

  100% {
    --angle: 360deg;
		--top: 100px;
		--right: -100px;
		--blur: 75px;
  }
`;

export const FullscreenAnimatedBackground = styled(Stack)`
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @property --top {
    syntax: '<length>';
    initial-value: 100px;
    inherits: false;
  }
  @property --right {
    syntax: '<length>';
    initial-value: -100px;
    inherits: false;
  }
  @property --blur {
    syntax: '<length>';
    initial-value: 75px;
    inherits: false;
  }

  z-index: -1;
  pointer-events: none;
  position: fixed;
  inset: 0;
  // backgroundColor: palette.background.default;
  background-position: top var(--top) right var(--right);
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    rgba(255, 9, 127, 0) 1.7510104179382324deg,
    rgba(176, 255, 24, 0) 122.6304030418396deg,
    #a1ff68 131.64208889007568deg,
    #26f2ff 180deg,
    #7748ff 270deg,
    rgba(255, 4, 140, 0.75) 344.3039059638977deg
  );
  background-size: min(50%, 1000px) min(80%, 800px);
  background-repeat: no-repeat;
  filter: blur(var(--blur));
  animation: ${anim} 15s linear infinite;

  @media (prefers-reduced-motion) {
    animation: none;
  }

  @media (max-width: 800px) {
    background-image: none;: min(50%, 750px) min(600px, 80%);
  }
`;
