import { Stack } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import {
  ApprovalSection,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TransactionType } from '@src/background/services/transactions/models';
import { TokenType } from '@src/background/services/balances/models';
import { TransactionTokenCard } from '../TransactionTokenCard';
import { CollectibleMedia } from '@src/pages/Collectibles/components/CollectibleMedia';

export function NftCollectionSpendLimit({
  type,
  collection,
}: {
  type:
    | TransactionType.APPROVE_NFT_COLLECTION
    | TransactionType.REVOKE_NFT_COLLECTION_APPROVAL;
  collection: {
    id: string;
    name: string;
    description: string;
    address: string;
    logoUri: string;
    type: TokenType.ERC721 | TokenType.ERC1155;

    isScam?: boolean;
    isSuspicious?: boolean;
  };
}) {
  const { t } = useTranslation();

  return (
    <>
      <Stack>
        <ApprovalSection sx={{ pb: 1 }}>
          <ApprovalSectionHeader
            label={t('Spend Limit')}
          ></ApprovalSectionHeader>
        </ApprovalSection>

        <TransactionTokenCard
          token={{
            ...collection,
            amount: type === TransactionType.APPROVE_NFT_COLLECTION ? 1n : 0n,
          }}
          sx={{ py: 2 }}
        >
          <CollectibleMedia
            height="32px"
            width="auto"
            maxWidth="32px"
            url={collection?.logoUri}
            hover={false}
            margin="8px 0"
            showPlayIcon={false}
          />
        </TransactionTokenCard>
      </Stack>
    </>
  );
}
