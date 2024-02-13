import { TextFieldProps, useTheme } from '@avalabs/k2-components';
import { TextField } from '@mui/material';

export const AccountNameInput = (props: TextFieldProps) => {
  const theme = useTheme();

  return (
    <TextField
      inputProps={{
        style: {
          textAlign: 'center',
          height: 'auto',
        },
      }}
      InputProps={{
        sx: {
          p: 0,
          textAlign: 'center',
          backgroundColor: 'transparent',
          ...theme.typography.h4,
          '& fieldset': {
            border: '0 !important',
          },
        },
      }}
      {...props}
    />
  );
};
