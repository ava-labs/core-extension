import {
  CheckIcon,
  MenuItem,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

export const MenuFilterItem = ({
  itemText,
  isSelected,
  onClick,
}: {
  itemText: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <MenuItem
      disableRipple
      onClick={() => onClick()}
      sx={{ height: 32, minHeight: 32 }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="body2">{itemText}</Typography>
        {isSelected && <CheckIcon size={12} />}
      </Stack>
    </MenuItem>
  );
};
