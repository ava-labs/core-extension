import { Stack } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import {
  ApprovalSection,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TransactionNft } from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { CollectibleMedia } from '@src/pages/Collectibles/components/CollectibleMedia';
import { TransactionTokenCard } from '../TransactionTokenCard';

export function NftSpendLimit({ token }: { token: TransactionNft }) {
  const { t } = useTranslation();

  return (
    <>
      <Stack>
        <ApprovalSection sx={{ pb: 1 }}>
          <ApprovalSectionHeader
            label={t('Spend Limit')}
          ></ApprovalSectionHeader>
        </ApprovalSection>

        <TransactionTokenCard token={token} sx={{ py: 2 }}>
          <CollectibleMedia
            height="32px"
            width="auto"
            maxWidth="32px"
            url={token?.logoUri}
            hover={false}
            margin="8px 0"
            showPlayIcon={false}
          />
        </TransactionTokenCard>
      </Stack>
    </>
  );
}
