// prettier-ignore
export const LedgerIcon = ({
  size = 16,
  color = 'currentColor',
}: {
  size: number;
  color: string;
}) => {
  return (
    <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 16 16" fill="none">
      <path d="M10.5 3H10.6C11.9255 3 13 4.07452 13 5.4V5.5M5.5 3H5.4C4.07452 3 3 4.07452 3 5.4V5.5M3 10.5V10.6C3 11.9255 4.07452 13 5.4 13H5.5M10.5 13H10.6C11.9255 13 13 11.9255 13 10.6V10.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.49976 6.00049L6.49976 9.75049L9.49976 9.75049" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
