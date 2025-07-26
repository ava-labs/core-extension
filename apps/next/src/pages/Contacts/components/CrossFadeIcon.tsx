import { Fade } from '@avalabs/k2-alpine';

import { Box } from '@avalabs/k2-alpine';

type CrossFadeIconProps<T extends Record<string, React.ReactElement>> = {
  slots: T;
  size: number;
  active: keyof T;
};

export const CrossFadeIcon = <T extends Record<string, React.ReactElement>>({
  slots,
  active,
  size,
}: CrossFadeIconProps<T>) => {
  return (
    <Box width={size} height={size} position="relative">
      {Object.entries(slots).map(([key, slot]) => (
        <Fade in={key === active} mountOnEnter unmountOnExit key={key}>
          <Box width={size} height={size} position="absolute">
            {slot}
          </Box>
        </Fade>
      ))}
    </Box>
  );
};
