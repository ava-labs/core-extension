type GenericTokenDarkProps = {
  alt: string;
  style: React.CSSProperties;
};

export const GenericTokenDark = ({ alt, style }: GenericTokenDarkProps) => {
  return (
    <svg
      width="36"
      height="36"
      style={style}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <rect width="36" height="36" rx="18" fill="white" fillOpacity="0.1" />
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="35"
        rx="17.5"
        stroke="white"
        strokeOpacity="0.1"
      />
    </svg>
  );
};
