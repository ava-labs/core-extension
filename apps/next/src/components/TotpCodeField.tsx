import { ComponentProps, FC } from 'react';
import { getHexAlpha } from '@avalabs/k2-alpine';

import { ShakyTextField } from '@/components/ShakyTextField';

type TotpCodeFieldProps = Omit<ComponentProps<typeof ShakyTextField>, 'shake'>;

const totpCodeSlotProps: TotpCodeFieldProps['slotProps'] = {
  input: {
    sx: (theme) => ({
      backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
      borderRadius: theme.shape.mediumBorderRadius,
    }),
  },
  htmlInput: (props) => ({
    sx: (theme) => ({
      py: 4,
      textAlign: 'center',
      color: props.error ? 'error.main' : 'text.primary',
      transition: theme.transitions.create(['color', 'border-color']),
      ...theme.typography.h1,
    }),
  }),
};

export const TotpCodeField: FC<TotpCodeFieldProps> = (props) => (
  <ShakyTextField
    fullWidth
    autoFocus
    type="tel"
    slotProps={totpCodeSlotProps}
    shake={props.error}
    {...props}
  />
);
