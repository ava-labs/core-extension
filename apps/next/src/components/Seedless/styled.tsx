import {
  Box,
  CoreIcon,
  DialogContent,
  Divider,
  getHexAlpha,
  ListItemButton,
  ListItemIcon,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from '@avalabs/k2-alpine';

// SeedlessAuthPrompt styled components
export const StyledDialogContent = styled(DialogContent)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.largeBorderRadius,
  width: 90,
  height: 90,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  marginBottom: theme.spacing(4),
}));

export const StyledCoreIcon = styled(CoreIcon)(({ theme }) => ({
  color: theme.palette.datePicker.text,
}));

export const StyledWarningIcon = styled(Typography)(() => ({
  position: 'absolute',
  right: -15,
  bottom: -28,
  fontSize: 42,
}));

export const StyledStack = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingInline: theme.spacing(4),
  gap: theme.spacing(2),
}));

// AuthenticationError styled components
export const StyledStackAuthError = styled(Stack)(({ theme }) => ({
  width: '100%',
  paddingInline: theme.spacing(5),
  justifyContent: 'center',
  textAlign: 'center',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

// FIDOChallenge styled components
export const StyledStackRoot = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
}));

export const StyledStackContent = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingInline: theme.spacing(2),
  gap: theme.spacing(3),
}));

// MfaChoicePrompt styled components
export const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.largeBorderRadius,
  overflow: 'hidden',
  width: '100%',
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
}));

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  paddingBlock: 0,
  paddingInlineEnd: theme.spacing(1.25),
  gap: theme.spacing(1.5),
  transition: 'background-color .15s ease-in-out',
}));

export const StyledListItemStartIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '36px',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: 1,
  color: theme.palette.text.primary,
}));

export const StyledListItemEndIcon = styled(ListItemIcon)({
  minWidth: 'min-content',
  width: 'min-content',
  justifyContent: 'flex-end',
});

export const StyledDivider = styled(Divider)(({ theme }) => ({
  marginInlineStart: theme.spacing(8),
}));

// TOTPChallenge styled components
export const StyledStackRootTOTP = styled(Stack)(() => ({
  mt: 2,
  gap: 3,
}));

export const StyledTextField = styled(TextField)(() => ({
  input: {
    fontSize: 36,
    lineHeight: '38px',
    fontWeight: 600,
    textAlign: 'center',
  },
}));

export const StyledStackTOTP = styled(Stack)(() => ({
  flexGrow: 1,
  justifyContent: 'flex-end',
  py: 3,
  px: 2,
}));

// WaitingForAuthentication styled components
export const StyledStackWaiting = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  paddingInline: theme.spacing(5),
  justifyContent: 'center',
  textAlign: 'center',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

// SeedlessAuthPopup styled components
export const StyledStackRootPopup = styled(Stack)(() => ({
  height: '100%',
  width: '100%',
  px: 2,
  py: 2,
}));

export const StyledStackContentPopup = styled(Stack)(() => ({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
}));
