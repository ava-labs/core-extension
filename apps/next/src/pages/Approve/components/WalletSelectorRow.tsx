import { SizedAvatar } from '@/components/SizedAvatar';
import {
  Stack,
  Typography,
  ChevronRightIcon,
  useTheme,
  getHexAlpha,
} from '@avalabs/k2-alpine';

export const WalletSelectorRow = ({
  onClick,
  name,
  icon,
  isLast = false,
}: {
  onClick: () => void;
  name: string;
  icon: string;
  isLast?: boolean;
}) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        borderBottom: isLast
          ? 'none'
          : `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
        cursor: 'pointer',
        flexGrow: 1,
        paddingY: theme.spacing(1.5),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
      }}
      onClick={onClick}
    >
      <Stack direction={'row'} alignItems="center" gap={1.5}>
        <SizedAvatar
          sx={{
            borderRadius: '8px',
          }}
          size={24}
          src={icon}
        />
        <Typography variant="body3">{name}</Typography>
      </Stack>
      <ChevronRightIcon size={24} color={theme.palette.text.secondary} />
    </Stack>
  );
};
