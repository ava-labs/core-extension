import { Stack } from '@avalabs/core-k2-components';
import { WalletConnectCircledIcon } from '../../../ImportWithWalletConnect/components/WalletConnectCircledIcon';
import WalletConnectConnector from '@/pages/ImportWithWalletConnect/components/WalletConnectConnector';

interface WalletConnectApprovalConnectProps {
  reconnectionAddress: string;
  customMessage?: string;
  onConnect: () => void;
  appIcon?: React.ReactElement;
}

export function WalletConnectApprovalConnect({
  reconnectionAddress,
  customMessage,
  onConnect,
  appIcon,
}: WalletConnectApprovalConnectProps) {
  return (
    <Stack sx={{ alignItems: 'center', height: '100%', gap: 2 }}>
      {appIcon ?? <WalletConnectCircledIcon />}
      <WalletConnectConnector
        reconnectionAddress={reconnectionAddress}
        customMessage={customMessage}
        onConnect={onConnect}
      />
    </Stack>
  );
}
