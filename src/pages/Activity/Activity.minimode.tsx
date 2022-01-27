import { VerticalFlex } from '@avalabs/react-components';
import { WalletRecentTxs } from '../Wallet/WalletRecentTxs';

export function ActivityMiniMode() {
  return (
    <VerticalFlex width={'100%'} align={'center'} style={{ flex: 1 }}>
      <WalletRecentTxs />
    </VerticalFlex>
  );
}
