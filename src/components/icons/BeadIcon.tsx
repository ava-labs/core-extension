import React from 'react';

export function BeadIcon({
  height = '24px',
  color,
}: {
  color: string;
  height: string;
}) {
  return (
    <svg
      width={height}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="4" stroke={color} strokeWidth="4" />
    </svg>
  );
}
