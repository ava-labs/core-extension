import {
  ConnectionIndicator,
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { TransactionProgressState } from '../models';

interface TransactionHeaderProps {
  title: string;
  showNetwork?: boolean;
  transactionState: TransactionProgressState;
}

export function TransactionHeader({
  title,
  showNetwork = true,
  transactionState,
}: TransactionHeaderProps) {
  const { isWalletReady } = useWalletContext();
  const { network } = useNetworkContext();

  return (
    <VerticalFlex padding="12px 0">
      <Typography as="h1" size={20} height="29px" weight={600}>
        {
          {
            [TransactionProgressState.PENDING]: 'Transaction Pending...',
            [TransactionProgressState.ERROR]: 'Transaction Failed',
            [TransactionProgressState.SUCCESS]: 'Transaction Successful',
            [TransactionProgressState.NOT_APPROVED]: title,
          }[transactionState]
        }
      </Typography>
      {showNetwork && (
        <HorizontalFlex margin="6px 0 0" align="center">
          <ConnectionIndicator
            disableTooltip={true}
            size={8}
            connected={isWalletReady}
          />
          <SubTextTypography margin={'0 0 0 8px'} size={16} height="24px">
            {network?.chainName}
          </SubTextTypography>
        </HorizontalFlex>
      )}
    </VerticalFlex>
  );
}
