import { Card } from '@/components/Card';
import { BridgeTransfer } from '@avalabs/bridge-unified';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { FungibleTokenBalance } from '@core/types';
import { useNetworkContext } from '@core/ui';
import Big from 'big.js';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BridgeTokenCard } from '../../BridgeTokenCard';
import { getErrorMessage } from '../utils/getErrorMessage';
import * as Styled from './Styled';

type Props = {
  token: FungibleTokenBalance | undefined;
  amount: Big;
  transfer: BridgeTransfer;
};

export const TransactionFailure: FC<Props> = ({ token, amount, transfer }) => {
  const { t } = useTranslation();
  const { getNetwork } = useNetworkContext();
  const sourceNetwork = getNetwork(transfer.sourceChain.chainId);
  const targetNetwork = getNetwork(transfer.targetChain.chainId);

  if (!transfer.errorCode) {
    return null;
  }

  return (
    <>
      <BridgeTokenCard token={token} amount={amount} size={24} badgeSize={10} />
      <Card noPadding>
        <Styled.RowItem
          borderTop={1}
          borderBottom={1}
          borderColor="transparent"
        >
          <Typography variant="body3" color="text.primary">
            {t('From')}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box position="relative">
              <Styled.NetworkLogo
                src={sourceNetwork?.logoUri}
                alt={transfer.sourceChain.chainName}
              />
            </Box>
            <Typography variant="body3" color="text.primary">
              {transfer.sourceChain.chainName}
            </Typography>
          </Stack>
        </Styled.RowItem>
      </Card>
      <Card noPadding>
        <Styled.RowItem
          borderTop={1}
          borderBottom={1}
          borderColor="transparent"
        >
          <Typography variant="body3" color="text.primary">
            {t('To')}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box position="relative">
              <Styled.NetworkLogo
                src={targetNetwork?.logoUri}
                alt={transfer.targetChain.chainName}
              />
            </Box>
            <Typography variant="body3" color="text.primary">
              {transfer.targetChain.chainName}
            </Typography>
          </Stack>
        </Styled.RowItem>
        <Styled.Divider />
        <Styled.RowItem>
          <Typography variant="body3" color="text.primary">
            {t('Error')}
          </Typography>
          <Typography variant="body3" color="text.primary">
            {getErrorMessage(t, transfer.errorCode)}
          </Typography>
        </Styled.RowItem>
      </Card>
    </>
  );
};
