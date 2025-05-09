import { WalletConnectIcon, Avatar } from '@avalabs/core-k2-components';

export const WalletConnectCircledIcon = () => (
  <Avatar
    sx={{
      width: '64px',
      height: '64px',
      border: '1px solid',
      borderColor: 'info.dark',
    }}
  >
    <WalletConnectIcon size={42} />
  </Avatar>
);
