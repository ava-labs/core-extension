import { useTheme } from '@avalabs/core-k2-components';

type Props = {
  size: number;
  value: number; // from 0 to 100
  thickness?: number;
  bgColor?: string;
  color?: string;
};

export const ArcProgress = ({
  size,
  value,
  thickness = 5,
  bgColor,
  color,
}: Props) => {
  const theme = useTheme();

  const width = size;
  const height = size / 2;
  const xStart = thickness;
  const xEnd = xStart + width;
  const y = height + thickness;
  const radius = (width - thickness) / 2;

  // Path of the arc to draw:
  const d = `M ${thickness} ${y} A ${radius} ${radius} 180 0 1 ${xEnd} ${y}`;

  // Since the arc is coded to always be exactly half of the circle,
  // we can calculate the % values based on a formula for circumference of a circle.
  const circumference = 2 * Math.PI * (size / 2);
  const progressValue = ((100 - value) / 100) * circumference;

  return (
    <svg
      width={size + 2 * thickness}
      height={size / 2 + 2 * thickness}
      strokeLinecap="round"
      fill="none"
    >
      <path
        d={d}
        strokeWidth={thickness}
        stroke={bgColor ?? theme.palette.grey[800]}
      />
      <path
        d={d}
        strokeWidth={thickness}
        stroke={color ?? theme.palette.secondary.main}
        strokeDasharray={circumference / 2}
        strokeDashoffset={progressValue / 2}
        style={{ transition: 'stroke-dashoffset .15s ease-in-out' }}
      />
    </svg>
  );
};
