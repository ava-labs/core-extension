import { Divider, Typography, TypographyProps } from '@avalabs/k2-alpine';
import { StackProps } from '@avalabs/k2-alpine';
import { Stack } from '@avalabs/k2-alpine';
import { useTheme } from '@avalabs/k2-alpine';
import { combineSx } from '@avalabs/k2-alpine';
import { FC } from 'react';

export const Section: FC<StackProps> = ({ sx, ...props }) => {
  const theme = useTheme();
  return (
    <Stack
      divider={<Divider />}
      sx={combineSx(
        {
          backgroundColor: 'background.paper',
          // @ts-expect-error - Broken Theme type in @avalabs/k2-alpine
          borderRadius: theme.shape.mediumBorderRadius,
          py: 0.75,
          px: 2,
        },
        sx,
      )}
      {...props}
    />
  );
};

export const SectionRow: FC<StackProps> = ({ sx, ...props }) => (
  <Stack
    sx={combineSx(
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 11,
        py: 1,
      },
      sx,
    )}
    {...props}
  />
);

export const SectionLabel: FC<TypographyProps> = (props) => (
  <Typography variant="body2" fontWeight="medium" fontSize="14px" {...props} />
);
