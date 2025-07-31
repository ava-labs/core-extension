import { MenuItem, Stack, Typography } from '@avalabs/k2-alpine';
import { MdCheck } from 'react-icons/md';

type SelectMenuItemProps = {
  label: string;
  value: string;
  key?: string;
  selected: boolean;
  onClick: (value: string) => void;
};

export const SelectMenuItem = ({
  label,
  value,
  key,
  selected,
  onClick,
}: SelectMenuItemProps) => {
  return (
    <MenuItem
      key={key ?? value}
      value={value}
      style={{ minHeight: 'unset', height: '24px' }}
      onClick={() => onClick(value)}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{
          '&.MuiStack-root': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Typography variant="subtitle1" fontWeight="fontWeightRegular">
          {label}
        </Typography>
        {selected && <MdCheck size={24} color="primary.main" />}
      </Stack>
    </MenuItem>
  );
};
