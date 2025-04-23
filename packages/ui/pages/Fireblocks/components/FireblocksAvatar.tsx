import {
  Avatar,
  Badge,
  BitcoinColorIcon,
  FireblocksIcon,
  WalletConnectIcon,
} from '@avalabs/core-k2-components';

interface FireblocksAvatarProps {
  badgeIcon?: 'walletConnect' | 'bitcoin';
}

export const FireblocksAvatar = ({
  badgeIcon = 'walletConnect',
}: FireblocksAvatarProps) => (
  <Badge
    overlap="circular"
    badgeContent={
      <Avatar
        sx={{
          width: '24px',
          height: '24px',
          backgroundColor:
            badgeIcon === 'walletConnect' ? 'info.dark' : 'transparent',
          border: '1px solid',
          borderColor: 'background.paper',
        }}
      >
        {badgeIcon === 'walletConnect' && <WalletConnectIcon size={16} />}
        {badgeIcon === 'bitcoin' && <BitcoinColorIcon size={24} />}
      </Avatar>
    }
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
  >
    <Avatar
      sx={{
        width: '64px',
        height: '64px',
        background: 'transparent',
        border: '1px solid',
        borderColor: 'primary.main',
      }}
    >
      <FireblocksIcon size={32} />
    </Avatar>
  </Badge>
);
