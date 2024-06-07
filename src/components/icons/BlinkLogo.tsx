interface BlinkingLogoProps {
  height?: number;
}

export function BlinkingLogo({ height = 41 }: BlinkingLogoProps) {
  return (
    <img src="/images/core-logo-blinking.gif" alt="loading" height={height} />
  );
}
