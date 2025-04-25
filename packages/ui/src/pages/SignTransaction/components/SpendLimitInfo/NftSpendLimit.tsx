import { Stack } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import {
  ERC1155Token,
  ERC721Token,
  TokenApproval,
} from '@avalabs/vm-module-types';

import {
  ApprovalSection,
  ApprovalSectionHeader,
} from '@/components/common/approval/ApprovalSection';
import { TransactionTokenCard } from '../TransactionTokenCard';

export function NftSpendLimit({
  approval,
}: {
  approval: TokenApproval & { token: ERC1155Token | ERC721Token };
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
          token={approval.token}
          diffItem={{
            displayValue: approval.value ?? '1',
            usdPrice: approval.usdPrice,
          }}
          sx={{ py: 2 }}
        />
      </Stack>
    </>
  );
}
