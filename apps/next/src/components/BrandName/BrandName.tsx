import { Stack } from '@avalabs/k2-alpine';

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
  return (
    <Stack margin={margin} padding={padding}>
      <img src="/images/logo-transparent.svg" height={height} width={width} />
    </Stack>
  );
}
