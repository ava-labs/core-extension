import {
  Avatar,
  AvatarProps,
  Badge,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from '@avalabs/k2-alpine';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import { useSettingsContext } from '@core/ui';
import { FC, ReactElement } from 'react';

interface Props {
  token: TokenWithBalance;
}

export const TokenListItem: FC<Props> = ({ token }) => {
  const { getTokenVisibility, toggleTokenVisibility } = useSettingsContext();

  return (
    <ListItem
      key={token.name}
      secondaryAction={
        <Switch
          checked={getTokenVisibility(token)}
          onChange={() => toggleTokenVisibility(token)}
          size="small"
        />
      }
      disablePadding
      disableGutters
    >
      <ListItemIcon>
        <NetworkBadge token={token}>
          <Avatar src={token.logoUri} alt={token.name} />
        </NetworkBadge>
      </ListItemIcon>
      <ListItemText
        primary={token.name}
        secondary={token.balanceDisplayValue}
      />
    </ListItem>
  );
};

const NetworkBadge: FC<{
  token: TokenWithBalance;
  children: ReactElement<AvatarProps>;
}> = ({ children, token }) => {
  if (token.type === TokenType.NATIVE) {
    return children;
  }

  return (
    <Badge
      variant="dot"
      color="primary"
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <Avatar
          alt={token.type === TokenType.ERC20 ? 'EVM' : 'Solana'}
          src={
            token.type === TokenType.ERC20
              ? '/static/images/avatar/1.jpg'
              : '/static/images/avatar/2.jpg'
          }
        />
      }
    >
      {children}
    </Badge>
  );
};
