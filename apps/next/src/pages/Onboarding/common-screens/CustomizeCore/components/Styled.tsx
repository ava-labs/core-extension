import {
  Button,
  ToggleButton as K2ToggleButton,
  ToggleButtonGroup as K2ToggleButtonGroup,
  styled,
  toggleButtonGroupClasses,
} from '@avalabs/k2-alpine';

export const ToggleButtonGroup = styled(K2ToggleButtonGroup)(({ theme }) => ({
  marginInline: 'auto',
  gap: theme.spacing(1.5),
}));

export const ToggleButton = styled(K2ToggleButton)(({ theme }) => ({
  border: 'none',

  [`.${toggleButtonGroupClasses.root} &`]: {
    borderRadius: theme.shape.mediumBorderRadius,
  },
}));

export const LabelButton = styled(Button)(({ theme }) => ({
  position: 'static',
  marginInline: 'auto',

  '&:before': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },

  '&:hover': {
    boxShadow: 'none',
    transition: 'none',
  },

  'button.Mui-selected &': {
    color: theme.palette.text.primary,
    backgroundColor: 'inherit',
  },
}));
