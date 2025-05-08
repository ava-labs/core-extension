import { Stack } from '@avalabs/core-k2-components';

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
    <Stack sx={{ margin, padding }}>
      <img src="/images/logo-transparent.svg" height={height} width={width} />
    </Stack>
  );
}
