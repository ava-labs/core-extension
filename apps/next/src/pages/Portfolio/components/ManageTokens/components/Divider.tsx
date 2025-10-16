import { Divider as K2Divider, SxProps, Theme } from '@avalabs/k2-alpine';
import { FC } from 'react';

interface Props {
  first: boolean;
}

const sx: SxProps<Theme> = { ml: (theme) => theme.spacing(6) };

export const Divider: FC<Props> = ({ first }) => {
  return (
    <K2Divider
      variant={first ? 'fullWidth' : 'inset'}
      sx={first ? undefined : sx}
    />
  );
};
