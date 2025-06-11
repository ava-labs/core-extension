import { styled, TextField } from '@avalabs/k2-alpine';

export const BorderlessTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    color: ${({ theme }) => theme.palette.text.secondary};

    &:focus-within {
      color: ${({ theme }) => theme.palette.text.primary};
    }

    fieldset.MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;
