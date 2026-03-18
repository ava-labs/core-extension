import { FC } from 'react';
import { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';
import { MdCheckCircle, MdErrorOutline, MdReplay } from 'react-icons/md';
import { Transfer } from '@avalabs/fusion-sdk';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { useNetworkContext } from '@core/ui';
import { isFailedTransfer, isRefundedTransfer } from '@core/types';

import { Card } from '@/components/Card';
import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';

import * as Styled from '../Styled';
import { useTransferStatusForSide } from './hooks/useTransferStatusForSide';
import { isTransferSuccessfulForSide } from './lib/isTransferSuccessfulForSide';
import { Side } from './types';

type Props = {
  transfer: Transfer;
  side: Side;
};

const IconBySideAndStatus: Record<
  Side,
  Record<Transfer['status'], IconType>
> = {
  source: {
    'source-pending': AnimatedSyncIcon,
    'target-pending': MdCheckCircle,
    'source-completed': MdCheckCircle,
    refunded: MdReplay,
    completed: MdCheckCircle,
    failed: MdErrorOutline,
  },
  target: {
    'source-pending': AnimatedSyncIcon,
    'target-pending': AnimatedSyncIcon,
    'source-completed': AnimatedSyncIcon,
    refunded: MdReplay,
    completed: MdCheckCircle,
    failed: MdErrorOutline,
  },
};

function getStatusColor(
  transfer: Transfer,
  side: Side,
): 'success.main' | 'error.main' | 'warning.main' | 'text.primary' {
  if (isTransferSuccessfulForSide(transfer, side)) return 'success.main';
  if (isFailedTransfer(transfer)) return 'error.main';
  if (isRefundedTransfer(transfer)) return 'warning.main';
  return 'text.primary';
}

type StatusIconProps = {
  transfer: Transfer;
  side: Side;
};

const StatusIcon: FC<StatusIconProps> = ({ transfer, side }) => {
  const color = getStatusColor(transfer, side);

  const Icon = IconBySideAndStatus[side][transfer.status];

  return (
    <Box color={color} height={18}>
      <Icon size={18} />
    </Box>
  );
};

export const ChainStatusInfoBox: FC<Props> = ({ transfer, side }) => {
  const { t } = useTranslation();
  const { getNetwork } = useNetworkContext();

  const chain = side === 'source' ? transfer.sourceChain : transfer.targetChain;
  const network = getNetwork(chain.chainId);
  const status = useTransferStatusForSide(transfer, side);

  return (
    <Card noPadding>
      <Stack divider={<Styled.Divider />}>
        <Styled.StatusDetailRow label={side === 'source' ? t('From') : t('To')}>
          {network && (
            <Box position="relative">
              <Styled.NetworkLogo
                src={network.logoUri}
                alt={`${chain.chainName} logo`}
              />
            </Box>
          )}
          <Typography variant="body3" color="text.secondary">
            {chain.chainName}
          </Typography>
        </Styled.StatusDetailRow>
        <Styled.StatusDetailRow label={t('Status')}>
          <StatusIcon transfer={transfer} side={side} />
          <Typography variant="body3" color="text.secondary">
            {status}
          </Typography>
        </Styled.StatusDetailRow>
        {side === 'target' && isRefundedTransfer(transfer) && (
          <Styled.StatusDetailRow label={t('Note')}>
            <Typography variant="body3" color="text.secondary" textAlign="end">
              {transfer.refund.asset
                ? t(
                    '{{amount}} {{symbol}} was refunded to your wallet on {{chainName}}',
                    {
                      amount: bigIntToString(
                        transfer.refund.amount,
                        transfer.refund.asset?.decimals,
                      ),
                      symbol: transfer.refund.asset?.symbol,
                      chainName: chain.chainName,
                    },
                  )
                : t(
                    'A refund has been issued to your wallet on {{chainName}}',
                    { chainName: chain.chainName },
                  )}
            </Typography>
          </Styled.StatusDetailRow>
        )}
      </Stack>
    </Card>
  );
};
