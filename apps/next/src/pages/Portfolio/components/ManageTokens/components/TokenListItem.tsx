import { TokenAvatar } from '@/components/TokenAvatar';
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from '@avalabs/k2-alpine';
import { TokenWithBalance } from '@avalabs/vm-module-types';
import { isTokenMalicious } from '@core/common';
import { FungibleTokenBalance } from '@core/types';
import { useSettingsContext } from '@core/ui';
import { FC, ReactElement } from 'react';

interface Props {
  token: FungibleTokenBalance;
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
        <MaliciousOverlay token={token}>
          <TokenAvatar token={token} size={36} badgeSize={16} />
        </MaliciousOverlay>
      </ListItemIcon>
      <ListItemText
        primary={token.name}
        secondary={token.balanceDisplayValue}
      />
    </ListItem>
  );
};

const MaliciousOverlay: FC<{
  children: ReactElement;
  token: TokenWithBalance;
}> = ({ children, token }) => {
  if (isTokenMalicious(token)) {
    return (
      <Box
        sx={(theme) => ({
          position: 'relative',
          isolation: 'isolate',
          '&:before': {
            content: '"!"',
            position: 'absolute',
            inset: 0,
            textAlign: 'center',
            color: theme.palette.error.main,
            zIndex: 1,
            fontSize: theme.typography.h2.fontSize,
            fontWeight: theme.typography.h2.fontWeight,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: theme.shape.fullBorderRadius,
            backdropFilter: 'blur(8px) brightness(0.1) contrast(1)',
          },
        })}
      >
        {children}
      </Box>
    );
  }
  return children;
};
