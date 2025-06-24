import { ListItemTextProps, Typography } from '@avalabs/k2-alpine';

export const textProps: ListItemTextProps = {
  slots: {
    primary: Typography,
    secondary: Typography,
  },
  slotProps: {
    root: {
      sx: {
        marginBlock: 0.25,
      },
    },
    primary: {
      variant: 'subtitle1',
    },
    secondary: {
      variant: 'body1',
      textAlign: 'end',
    },
  },
};
