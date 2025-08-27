import {
  InputBase,
  styled,
  TextField,
  TextFieldProps,
  inputBaseClasses,
  formHelperTextClasses,
} from '@avalabs/k2-alpine';
import { useRef } from 'react';

import { useDynamicFontSize } from '@/hooks/useDynamicFontSize';

const config = {
  minFontSize: 16,
  maxFontSize: 24,
} as const;

export const InvisibleAmountInput = styled(
  ({ slotProps, value, ...props }: TextFieldProps) => {
    const {
      input: inputProps,
      htmlInput: htmlInputProps,
      ...slotPropsRest
    } = slotProps ?? {};
    const inputRef = useRef<HTMLInputElement>(null);

    const { fontSize, measureElement } = useDynamicFontSize({
      ...config,
      maxWidth: inputRef.current?.clientWidth ?? Infinity,
      text: value as string,
    });

    return (
      <div style={{ position: 'relative' }}>
        {measureElement()}
        <TextField
          {...props}
          variant="standard"
          type="number"
          slots={{
            input: StyledInputBase,
          }}
          value={value}
          slotProps={{
            htmlInput: {
              min: 0,
              step: 'any',
              inputMode: 'decimal',
              formNoValidate: true,
              ...htmlInputProps,
            },
            input: {
              ...inputProps,
              ref: inputRef,
              sx: {
                fontSize,
              },
            },
            ...slotPropsRest,
          }}
        />
      </div>
    );
  },
)(({ theme }) => ({
  width: '100%',

  [`.${inputBaseClasses.input}`]: {
    textAlign: 'right', // Aligns the cursor and text to the right
    transition: theme.transitions.create('color'),
    height: 'auto',
  },

  [`.${inputBaseClasses.root}.${inputBaseClasses.error}`]: {
    [`.${inputBaseClasses.input}`]: {
      color: theme.palette.error.main, // Change input text color only when error is true
    },
  },

  [`.${formHelperTextClasses.root}`]: {
    textAlign: 'right',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  backgroundColor: 'transparent',
  transition: theme.transitions.create('font-size'),
  lineHeight: 1,
  fontWeight: 500,
  alignItems: 'baseline',
  [`.${inputBaseClasses.input}`]: {
    padding: 0,
  },
  // Disable up/down buttons on number input
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
}));
