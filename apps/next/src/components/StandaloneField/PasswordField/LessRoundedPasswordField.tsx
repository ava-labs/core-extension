import { styled } from '@avalabs/k2-alpine';
import { PasswordField } from '..';

export const LessRoundedPasswordField = styled(PasswordField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
}));
