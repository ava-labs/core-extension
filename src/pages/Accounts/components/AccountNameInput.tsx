import { TextFieldProps, useTheme } from '@avalabs/core-k2-components';
import { TextField } from '@mui/material';

export const AccountNameInput = (
  props: TextFieldProps & {
    typography?: 'h4' | 'button' | 'h6';
    align?: 'left' | 'center';
    isActive?: boolean;
  }
) => {
  const theme = useTheme();
  const typographyType = props.typography ?? 'h4';
  return (
    <TextField
      inputProps={{
        style: {
          textAlign: props.align ?? 'center',
          height: 'auto',
        },
      }}
      InputProps={{
        sx: {
          p: 0,
          textAlign: props.align ?? 'center',
          backgroundColor: 'transparent',
          ...theme.typography[typographyType],
          '& fieldset': {
            border: '0 !important',
          },
          color: props.isActive ? theme.palette.grey[900] : 'default',
        },
      }}
      {...props}
    />
  );
};
