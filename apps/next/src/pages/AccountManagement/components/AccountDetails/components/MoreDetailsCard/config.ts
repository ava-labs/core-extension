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
      fontWeight: 500,
      variant: 'subtitle3',
    },
    secondary: {
      variant: 'body3',
      textAlign: 'end',
      sx: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
    },
  },
};
