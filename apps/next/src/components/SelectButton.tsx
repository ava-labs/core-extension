import {
  Button,
  ButtonProps,
  ClickAwayListener,
  PopoverItem,
  Popper,
  Stack,
  useTheme,
} from '@avalabs/k2-alpine';
import { useState } from 'react';
import { MdOutlineUnfoldMore } from 'react-icons/md';

type SelectButtonProps<T> = ButtonProps & {
  renderValue?: React.ReactNode;
  options: {
    key: string;
    label: string;
    value: string;
    dataTestId: string;
    selected: boolean;
    selectValue: T;
  }[];
  onOptionSelect: (option: T) => Promise<void>;
  dataTestId?: string;
};

export const SelectButton = <T,>({
  renderValue,
  options,
  onOptionSelect,
  dataTestId,
  ...props
}: SelectButtonProps<T>) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clickHandler = async (option: T) => {
    await onOptionSelect(option);
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <Button
          variant="text"
          size="small"
          color="primary"
          onClick={handleClick}
          data-testid={dataTestId}
          endIcon={
            <MdOutlineUnfoldMore
              size={16}
              color={theme.palette.text.secondary}
            />
          }
          {...props}
          sx={{
            ...props.sx,
            '& .MuiButton-endIcon': {
              marginLeft: 0,
            },
          }}
        >
          {renderValue}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          sx={{ padding: '10px 0' }}
        >
          <Stack>
            {options.map((option) => (
              <PopoverItem
                key={option.key}
                label={option.label}
                onClick={() => {
                  clickHandler(option.selectValue);
                }}
                data-testid={option.dataTestId}
                selected={option.selected}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                  },
                }}
              />
            ))}
          </Stack>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};
