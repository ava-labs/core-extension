import { FC } from 'react';
import { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { Transfer } from '@avalabs/unified-asset-transfer';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';

import { isCompletedTransfer, isFailedTransfer } from '@core/types';

import { Card } from '@/components/Card';
import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';

import * as Styled from '../Styled';
import { useNetworkContext } from '@core/ui';

type Side = 'source' | 'target';
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
    completed: MdCheckCircle,
    failed: MdError,
  },
  target: {
    'source-pending': AnimatedSyncIcon,
    'target-pending': AnimatedSyncIcon,
    'source-completed': AnimatedSyncIcon,
    completed: MdCheckCircle,
    failed: MdError,
  },
};

type StatusIconProps = {
  transfer: Transfer;
  side: Side;
};
const StatusIcon: FC<StatusIconProps> = ({ transfer, side }) => {
  const color = isFailedTransfer(transfer)
    ? 'error.main'
    : isCompletedTransfer(transfer)
      ? 'success.main'
      : 'text.primary';

  const Icon = IconBySideAndStatus[side][transfer.status];

  return (
    <Box color={color} lineHeight={1}>
      <Icon size={18} />
    </Box>
  );
};

export const ChainStatusInfoBox: FC<Props> = ({ transfer, side }) => {
  const { t } = useTranslation();
  const { getNetwork } = useNetworkContext();

  const chain = side === 'source' ? transfer.sourceChain : transfer.targetChain;
  const network = getNetwork(chain.chainId);

  const status = isFailedTransfer(transfer)
    ? t('Failed')
    : isCompletedTransfer(transfer)
      ? t('Complete')
      : t('Pending...');

  return (
    <Card noPadding>
      <Stack divider={<Styled.Divider />}>
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          px={1.5}
          py={1}
        >
          <Typography variant="body3" color="text.primary">
            {side === 'source' ? t('From') : t('To')}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
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
          </Stack>
        </Stack>
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          px={1.5}
          py={1}
        >
          <Typography variant="body3" color="text.primary">
            {t('Status')}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <StatusIcon transfer={transfer} side={side} />
            <Typography variant="body3" color="text.secondary">
              {status}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
