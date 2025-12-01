import { CORE_WEB_BASE_URL } from '@/config';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { isTokenWithBalancePVM } from '@core/common';
import { useNetworkContext, useTokensWithBalances } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdInfoOutline, MdNavigateNext } from 'react-icons/md';
import { StyledCard } from '../styled';
import { AssetsErrorState } from '../../AssetsErrorState';

type Props = {
  networkId: number;
};
export const PchainDetails: FC<Props> = ({ networkId }) => {
  const { t } = useTranslation();
  const { getNetwork } = useNetworkContext();
  const network = getNetwork(networkId);

  const pchainBalances = useTokensWithBalances({
    network,
  });

  // Get the P-chain native token (should be the first/only token for P-chain)
  const pchainToken = pchainBalances[0];
  const _isCorrectBalance = isTokenWithBalancePVM(pchainToken);

  const _typeDisplayNames = {
    lockedStaked: t('Locked Staked'),
    lockedStakeable: t('Locked Stakeable'),
    lockedPlatform: t('Locked Platform'),
    atomicMemoryLocked: t('Atomic Memory Locked'),
    atomicMemoryUnlocked: t('Atomic Memory Unlocked'),
    unlockedUnstaked: t('Unlocked Unstaked'),
    unlockedStaked: t('Unlocked Staked'),
    pendingStaked: t('Pending Staked'),
  };

  if (!_isCorrectBalance) {
    return <AssetsErrorState />;
  }

  return (
    <Stack gap={1}>
      <StyledCard
        onClick={() =>
          window.open(
            `${CORE_WEB_BASE_URL}/portfolio/wallet/p-chain/utxos`,
            '_blank',
          )
        }
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <MdInfoOutline size={20} />
          <Stack>
            <Typography variant="subtitle4">
              {t('UTXOs across multiple addresses')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('View all of your balances and UTXOs')}
            </Typography>
          </Stack>
          <MdNavigateNext size={20} color="text.secondary" />
        </Stack>
      </StyledCard>

      <StyledCard>
        <Stack>
          {Object.entries(pchainToken.balancePerType).map(([type, balance]) => {
            return (
              <Stack key={type}>
                <Typography variant="subtitle4">
                  {_typeDisplayNames[type]}
                </Typography>
                <Typography variant="subtitle4">{balance}</Typography>
              </Stack>
            );
          })}
        </Stack>
      </StyledCard>
    </Stack>
  );
};
