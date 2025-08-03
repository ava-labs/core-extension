import { FC, PropsWithChildren, useState } from 'react';
import {
  Button,
  ButtonProps,
  ChevronDownIcon,
  Popover,
  PopoverContent,
  PopoverProps,
  styled,
} from '@avalabs/k2-alpine';

type DropdownMenuProps = PropsWithChildren<{
  label: string;
  slotProps?: {
    button?: Omit<ButtonProps, 'ref'>;
    popover?: Omit<PopoverProps, 'open'>;
  };
}>;

const defaultSlotProps: DropdownMenuProps['slotProps'] = {
  button: {
    variant: 'contained',
    size: 'small',
    color: 'secondary',
  },
  popover: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
  },
};

export const DropdownMenu: FC<DropdownMenuProps> = ({
  children,
  label,
  slotProps = defaultSlotProps,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledButton
        onClick={handleClick}
        endIcon={<StyledIcon open={open} size={16} />}
        {...slotProps?.button}
      >
        {label}
      </StyledButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={() => setAnchorEl(null)}
        {...slotProps?.popover}
      >
        <PopoverContent>{children}</PopoverContent>
      </Popover>
    </>
  );
};

const StyledButton = styled(Button)({
  gap: 0,
});

const StyledIcon = styled(ChevronDownIcon)<{ open: boolean }>(
  ({ theme, open }) => ({
    color: 'text.secondary',
    transition: theme.transitions.create('transform'),
    transform: open ? 'rotateX(180deg)' : 'none',
  }),
);
