import type {
  IconBaseProps,
  MenuItemProps,
  TextFieldProps,
} from '@avalabs/core-k2-components';
import {
  ChevronDownIcon,
  MenuItem,
  Select,
  useTheme,
} from '@avalabs/core-k2-components';

const TriggerIcon = ({ ...rest }: IconBaseProps) => {
  const theme = useTheme();

  return (
    <ChevronDownIcon
      size={20}
      sx={{
        '.MuiSelect-icon': {
          transition: 'transform 150ms ease-in-out',
          right: theme.spacing(2),
          top: 'calc(50% - 10px)',
        },
        '.MuiSelect-iconOpen': {
          transform: 'rotateX(180deg)',
        },
      }}
      {...rest}
    />
  );
};

const useDropdownProps = ({
  InputProps: { sx: inputSx = {}, ...otherInputProps } = {},
  SelectProps: {
    MenuProps: {
      PaperProps: { sx: paperSx = {}, ...otherPaperProps } = {},
      ...otherMenuProps
    } = {},
    ...otherSelectProps
  } = {},
  ...rest
}: TextFieldProps) => {
  const theme = useTheme();

  return {
    InputProps: {
      sx: {
        padding: 0,
        height: theme.spacing(6),
        border: `1px solid ${theme.palette.grey[800]}`,
        backgroundColor: theme.palette.grey[850],
        fontSize: theme.typography.body1.fontSize,

        '&.Mui-focused': {
          backgroundColor: theme.palette.grey[850],
        },
        '.MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline':
          {
            border: 'none',
          },
        '.MuiOutlinedInput-input': {
          padding: theme.spacing(1.5, 2),
        },
        ...inputSx,
      },
      ...otherInputProps,
    },
    SelectProps: {
      IconComponent: TriggerIcon,
      MenuProps: {
        PaperProps: {
          sx: {
            border: `1px solid ${theme.palette.grey[850]}`,
            maxWidth: 343,
            maxHeight: 144,
            mt: 2,
            ...paperSx,
          },
          ...otherPaperProps,
        },
        ...otherMenuProps,
      },
      ...otherSelectProps,
    },
    ...rest,
  };
};

export const Dropdown = ({ children, ...props }: TextFieldProps) => {
  const theme = useTheme();
  const { SelectProps, InputProps, ...rest } = useDropdownProps(props);

  return (
    <Select
      variant="outlined"
      InputProps={InputProps}
      SelectProps={SelectProps}
      inputLabelProps={{
        sx: { transform: 'none', fontSize: theme.typography.body2.fontSize },
      }}
      {...rest}
    >
      {children}
    </Select>
  );
};

export const DropdownItem = ({ sx, children, ...props }: MenuItemProps) => {
  const theme = useTheme();

  return (
    <MenuItem
      sx={{
        minHeight: 'auto',
        height: theme.spacing(5),
        fontSize: theme.typography.body2.fontSize,
        gap: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MenuItem>
  );
};
