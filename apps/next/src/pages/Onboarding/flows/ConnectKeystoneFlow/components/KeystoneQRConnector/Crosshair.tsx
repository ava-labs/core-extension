import { Box, styled } from '@avalabs/k2-alpine';

type CrosshairProps = {
  color: string;
  size?: number;
  thickness?: number;
};
export const Crosshair = ({
  color,
  size = 216,
  thickness = 6,
}: CrosshairProps) => {
  return (
    <Wrapper width={size} height={size}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 216 216"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M63 3H21C11.0589 3 3 11.0589 3 21V63"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          className="withColorTransition"
        />
        <path
          d="M63 213H21C11.0589 213 3 204.941 3 195V153"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          className="withColorTransition"
        />
        <path
          d="M153 3H195C204.941 3 213 11.0589 213 21V63"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          className="withColorTransition"
        />
        <path
          d="M153 213H195C204.941 213 213 204.941 213 195V153"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          className="withColorTransition"
        />
      </svg>
    </Wrapper>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',

  '.withColorTransition': {
    transition: theme.transitions.create('stroke', { duration: 500 }),
  },
}));
