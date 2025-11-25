import { SearchableSelectTriggerProps } from '@/components/SearchableSelect';
import { Button, ButtonProps } from '@avalabs/k2-alpine';
import { Network } from '@core/types';
import { FC, RefObject } from 'react';

const sx: ButtonProps['sx'] = {
  paddingInline: (theme) => theme.spacing(0.5),
};

export const SelectTrigger: FC<SearchableSelectTriggerProps<Network>> = ({
  ref,
  label,
  value,
  renderValue,
  onClick,
}) => (
  <Button
    ref={ref as RefObject<HTMLButtonElement | null>}
    size="small"
    variant="contained"
    color="secondary"
    onClick={onClick}
    sx={sx}
  >
    {value ? renderValue(value) : label}
  </Button>
);
