import { Theme, useTheme } from '@avalabs/core-k2-components';
import { get } from 'lodash';
import { FC } from 'react';

type Props = {
  size: number;
  value: number; // from 0 to 100
  thickness?: number;
  bgColor?: string;
  color?: string;
};

const resolveColor = (theme: Theme, color: string) => {
  const resolved = get(theme, `palette.${color}`, color);
  if (typeof resolved === 'string') {
    return resolved;
  }

  return resolved.main;
};

export const ArcProgress: FC<Props> = ({
  size,
  value,
  thickness = 5,
  bgColor = 'grey.800',
  color = 'secondary',
}) => {
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
  const clampedValue = Math.max(0, Math.min(100, value));
  const progressValue = ((100 - clampedValue) / 100) * circumference;

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
        stroke={resolveColor(theme, bgColor)}
      />
      <path
        d={d}
        strokeWidth={thickness}
        stroke={resolveColor(theme, color)}
        strokeDasharray={circumference / 2}
        strokeDashoffset={progressValue / 2}
        style={{ transition: 'stroke-dashoffset .15s ease-in-out' }}
      />
    </svg>
  );
};
