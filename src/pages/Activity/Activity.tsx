import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { WalletRecentTxs } from '../Wallet/WalletRecentTxs';

type ActivityProps = {
  isEmbedded?: boolean;
  tokenSymbolFilter?: string;
};

export function Activity({
  isEmbedded = false,
  tokenSymbolFilter,
}: ActivityProps) {
  return (
    <VerticalFlex width={'100%'} align={'center'} style={{ flex: 1 }}>
      {isEmbedded && (
        <HorizontalFlex width="100%">
          <Typography size={14} height="24px" as="h1">
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
