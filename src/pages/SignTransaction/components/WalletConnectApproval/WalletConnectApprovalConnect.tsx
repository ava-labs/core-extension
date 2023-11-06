import { Stack } from '@avalabs/k2-components';
import { WalletConnectCircledIcon } from '../../../ImportWithWalletConnect/components/WalletConnectCircledIcon';
import WalletConnectConnector from '@src/pages/ImportWithWalletConnect/components/WalletConnectConnector';

interface WalletConnectApprovalConnectProps {
  reconnectionAddress: string;
  customMessage?: string;
  onConnect: () => void;
}

export function WalletConnectApprovalConnect({
  reconnectionAddress,
  customMessage,
  onConnect,
}: WalletConnectApprovalConnectProps) {
  return (
    <Stack sx={{ alignItems: 'center', height: '100%' }}>
      <WalletConnectCircledIcon />
      <WalletConnectConnector
        reconnectionAddress={reconnectionAddress}
        customMessage={customMessage}
        onConnect={onConnect}
      />
    </Stack>
  );
}
