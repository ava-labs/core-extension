import {
  ConnectionIndicator,
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useGetTransaction } from '../hooks/useGetTransaction';

interface TransactionHeaderProps {
  title: string;
  showNetwork?: boolean;
}

export function TransactionHeader({
  title,
  showNetwork = true,
}: TransactionHeaderProps) {
  const { isWalletLocked } = useWalletContext();
  const requestId = useGetRequestId();
  const { network } = useGetTransaction(requestId);

  return (
    <VerticalFlex padding="12px 0">
      <Typography as="h1" size={20} height="29px" weight={600}>
        {title}
      </Typography>
      {showNetwork && (
        <HorizontalFlex margin="6px 0 0" align="center">
          <ConnectionIndicator
            disableTooltip={true}
            size={8}
            connected={!isWalletLocked}
          />
          <SubTextTypography margin={'0 0 0 8px'} size={16} height="24px">
            {network?.chainName}
          </SubTextTypography>
        </HorizontalFlex>
      )}
    </VerticalFlex>
  );
}
