import { FC } from 'react';
import { Button, ButtonProps, combineSx } from '@avalabs/k2-alpine';

export const AmountPresetButton: FC<ButtonProps> = ({ sx, ...props }) => (
  <Button
    variant="contained"
    color="secondary"
    size="xsmall"
    sx={combineSx({ minWidth: 'unset', gap: 0 }, sx)}
    {...props}
  />
);
