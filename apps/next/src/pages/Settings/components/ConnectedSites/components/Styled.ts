import {
  Button,
  getHexAlpha,
  Avatar as K2Avatar,
  ListItem as K2ListItem,
  SearchInput,
  styled,
} from '@avalabs/k2-alpine';

export const SearchField = styled(SearchInput)(({ theme }) => ({
  '& input': {
    backgroundColor: getHexAlpha(theme.palette.text.primary, 10),
  },
}));

export const ListItem = styled(K2ListItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
}));

export const DisconnectButton = styled(Button)({
  minWidth: 'auto',
  marginLeft: 'auto',
});

type CustomAvatarProps = {
  error?: boolean;
};

export const Avatar = styled(K2Avatar, {
  shouldForwardProp: (propName) =>
    propName !== ('error' satisfies keyof CustomAvatarProps),
})<CustomAvatarProps>(({ theme, error }) => ({
  width: 32,
  height: 32,
  ...(error && {
    backgroundColor: theme.palette.neutral['850_10'],
    border: '1px solid',
    borderColor: getHexAlpha(theme.palette.text.primary, 10),
  }),
}));
