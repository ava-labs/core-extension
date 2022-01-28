import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { WalletRecentTxs } from '../Wallet/WalletRecentTxs';

type ActivityMiniModeProps = {
  isEmbedded?: boolean;
  tokenSymbolFilter?: string;
};

export function ActivityMiniMode({
  isEmbedded = false,
  tokenSymbolFilter,
}: ActivityMiniModeProps) {
  return (
    <VerticalFlex width={'100%'} align={'center'} style={{ flex: 1 }}>
      {isEmbedded && (
        <HorizontalFlex width="100%">
          <Typography size={18} height="29px" weight={700} as="h1">
            Activity
          </Typography>
        </HorizontalFlex>
      )}
      <WalletRecentTxs
        tokenSymbolFilter={tokenSymbolFilter}
        isEmbedded={isEmbedded}
      />
    </VerticalFlex>
  );
}
