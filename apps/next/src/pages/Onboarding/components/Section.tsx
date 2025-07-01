import {
  Divider,
  getHexAlpha,
  Stack,
  StackProps,
  Typography,
  TypographyProps,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

export const Section: FC<StackProps> = (props) => {
  const theme = useTheme();
  return (
    <Stack
      divider={<Divider />}
      bgcolor={getHexAlpha(theme.palette.primary.main, 10)}
      borderRadius={theme.shape.mediumBorderRadius}
      py={0.75}
      px={2}
      {...props}
    />
  );
};

export const SectionRow: FC<StackProps> = (props) => (
  <Stack
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    gap={11}
    py={1}
    {...props}
  />
);

export const SectionLabel: FC<TypographyProps> = (props) => (
  <Typography variant="body2" fontWeight="medium" fontSize="14px" {...props} />
);
