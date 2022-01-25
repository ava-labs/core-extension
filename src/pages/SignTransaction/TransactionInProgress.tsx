import {
  LoadingSpinnerIcon,
  Overlay,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { LedgerApprovalDialog } from '../../contracts/contractParsers/LedgerApprovalDialog';
import { TransactionDisplayValues } from '@src/background/services/transactions/models';

interface TransactionInProgressProps {
  displayData: TransactionDisplayValues;
}

export function TransactionInProgress({
  displayData,
}: TransactionInProgressProps) {
  const theme = useTheme();
  const { walletType } = useWalletContext();

  return (
    <Overlay>
      <VerticalFlex
        padding="40px 16px 16px"
        height={'100%'}
        width={'100%'}
        align={'center'}
        justify="center"
      >
        {walletType === 'ledger' ? (
          <LedgerApprovalDialog
            address={displayData.toAddress}
            fee={displayData.fee}
          />
        ) : (
          <>
            <Typography size={24} height="29px" weight={700}>
              Transaction in progress
            </Typography>
            <VerticalFlex grow="1" align="center" justify="center">
              <LoadingSpinnerIcon
                height={'52px'}
                color={theme.colors.primary1}
              />
            </VerticalFlex>
          </>
        )}
      </VerticalFlex>
    </Overlay>
  );
}
