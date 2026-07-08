import { Stack } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { StyledCard } from '../../styled';
import { Typography } from '@avalabs/k2-alpine';
import { CORE_WEB_BASE_URL } from '@/config/constants';
import { MdInfoOutline, MdNavigateNext } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

type Props = {
  network: 'x-chain' | 'p-chain';
};
export const UtxoBanner: FC<Props> = ({ network }) => {
  const { t } = useTranslation();
  return (
    <StyledCard
      onClick={() =>
        window.open(
          `${CORE_WEB_BASE_URL}/portfolio/wallet/${network}/utxos`,
          '_blank',
        )
      }
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
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
  );
};
