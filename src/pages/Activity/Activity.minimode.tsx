import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { BottomNav } from '@src/components/common/BottomNav.minimode';
import { WalletRecentTxs } from '../Wallet/WalletRecentTxs';

export function ActivityMiniMode() {
  return (
    <VerticalFlex width={'100%'} padding={'0 0 65px'} align={'center'}>
      <HorizontalFlex width={'100%'} margin="8px 0 24px" padding="0 16px">
        <Typography size={24} height="29px" weight={700} as="h1">
          Activity
        </Typography>
      </HorizontalFlex>
      <WalletRecentTxs />
      <BottomNav />
    </VerticalFlex>
  );
}
