import { FC } from 'react';
import { Button, ButtonProps, combineSx } from '@avalabs/k2-alpine';

export const NavButton: FC<ButtonProps> = ({ sx, ...props }) => {
  return (
    <Button
      sx={combineSx({ minWidth: 150, alignSelf: 'flex-end' }, sx)}
      variant="contained"
      {...props}
    />
  );
};
