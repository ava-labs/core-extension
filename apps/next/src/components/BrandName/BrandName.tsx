import { Stack, useMediaQuery } from '@avalabs/k2-alpine';

interface BrandNameProps {
  height?: number;
  width?: number;
  margin?: string;
  padding?: string;
}

export function BrandName({
  height,
  width,
  margin = '0',
  padding = '0',
}: BrandNameProps) {
  const matches = useMediaQuery('prefers-color-scheme: dark');
  const mode = matches ? 'dark' : 'light';
  return (
    <Stack margin={margin} padding={padding}>
      <img
        src={`/images/splash-anim/core-splash-anim-${mode}.gif`}
        height={height}
        width={width}
      />
    </Stack>
  );
}
