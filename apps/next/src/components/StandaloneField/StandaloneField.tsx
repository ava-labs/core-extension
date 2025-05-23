import {
  FilledTextFieldProps,
  TextField,
  alpha,
  styled,
} from '@avalabs/k2-alpine';

export type StandaloneFieldProps = Omit<
  FilledTextFieldProps,
  'variant' | 'size'
>;

export const StandaloneField = styled((props: StandaloneFieldProps) => (
  <TextField
    {...props}
    variant="filled"
    slotProps={{
      ...props.slotProps,
      input: {
        ...props.slotProps?.input,
        disableUnderline: true,
      },
    }}
  />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    paddingBlock: 9,
    paddingInline: 16,
    overflow: 'hidden',
    borderRadius: '25px',
    border: 'none',
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.neutral['850_10']
        : theme.palette.common.white_10,
    transition: theme.transitions.create(['background-color', 'box-shadow']),
    fontSize: 12,
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? theme.palette.neutral['850_30']
          : theme.palette.common.white_30,
    },
    '&:focus-within': {
      color: theme.palette.neutral['850'],
      backgroundColor: theme.palette.common.white,
      boxShadow: `${alpha(theme.palette.common.black, 0.25)} 0 5px 15px 0`,
    },
    '& .MuiInputBase-input': {
      padding: 0,
      height: '1.5em',
    },
  },
}));
