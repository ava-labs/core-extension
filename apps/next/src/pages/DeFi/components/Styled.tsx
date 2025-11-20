import { Card } from '@/components/Card';
import {
  Avatar,
  AvatarProps,
  getHexAlpha,
  Divider as K2Divider,
  ListItemButton as K2ListItemButton,
  ListItemIcon,
  Stack,
  styled,
} from '@avalabs/k2-alpine';

export const ListItemButton = styled(K2ListItemButton)(({ theme }) => ({
  paddingBlock: 0,
  paddingInlineEnd: theme.spacing(1.25),
  gap: theme.spacing(1.5),
  borderRadius: theme.shape.largeBorderRadius,
}));

export const ListItemStartIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '36px',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: 1,
  borderRadius: '30px',
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
  color: theme.palette.text.primary,
}));

export const ListItemEndIcon = styled(ListItemIcon)({
  minWidth: 'min-content',
  width: 'min-content',
  justifyContent: 'flex-end',
});

export const Root = styled(Stack)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.largeBorderRadius,
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.surface.secondary
      : theme.palette.common.white_10,
}));

export const Divider = styled(K2Divider)(({ theme }) => ({
  marginInlineStart: theme.spacing(8),
}));

type SizedAvatarProps = AvatarProps & {
  size: number;
};

export const SizedAvatar = styled(Avatar)<SizedAvatarProps>(({ size }) => ({
  width: size,
  height: size,
  backgroundColor: 'transparent',
}));

export const ChainBadge = styled(SizedAvatar)(({ theme }) => ({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.palette.background.paper,
  backgroundColor: 'transparent',
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1.5),
  gap: theme.spacing(1.5),
  width: '100%',
}));
