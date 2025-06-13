import { Typography } from '@/components/Typography';
import { ListItemTextProps } from '@avalabs/k2-alpine';

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
      variant: 'titleBold',
    },
    secondary: {
      variant: 'title',
      textAlign: 'end',
    },
  },
};
