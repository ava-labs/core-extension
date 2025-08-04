import { styled } from '@avalabs/k2-alpine';
import { PasswordField } from './PasswordField';

export const LessRoundedPasswordField = styled(PasswordField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
}));
