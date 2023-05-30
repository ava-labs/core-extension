import { Stack, IconButton, CodeIcon } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { ApproveTransactionData } from '@src/contracts/contractParsers/models';
import { SpendLimitInfo } from './components/SpendLimitInfo';
import {
  AccountDetails,
  ContractDetails,
  NetworkDetails,
  WebsiteDetails,
} from './components/ApprovalTxDetails';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';

export function ApproveTx({
  site,
  tokenToBeApproved,
  setShowCustomSpendLimit,
  setShowRawTransactionData,
  displaySpendLimit,
  limitFiatValue,
  fromAddress,
  toAddress,
  network,
  requestedApprovalLimit,
}: ApproveTransactionData) {
  const { t } = useTranslation();

  const hideEdit: boolean = requestedApprovalLimit.isZero();

  return (
    <Stack sx={{ width: '100%', gap: 3, pt: 1 }}>
      <ApprovalSection>
        <ApprovalSectionHeader label={t('Transaction Details')}>
          <IconButton
            size="small"
            sx={{ px: 0, minWidth: 'auto' }}
            onClick={() => setShowRawTransactionData(true)}
          >
            <CodeIcon />
          </IconButton>
        </ApprovalSectionHeader>
        <ApprovalSectionBody sx={{ py: 1 }}>
          {fromAddress && <AccountDetails address={fromAddress} />}
          {toAddress && (
            <ContractDetails contractAddress={toAddress} network={network} />
          )}
          {site && <WebsiteDetails site={site} />}
          {network && <NetworkDetails network={network} />}
        </ApprovalSectionBody>
      </ApprovalSection>

      <SpendLimitInfo
        hideEdit={hideEdit}
        setShowCustomSpendLimit={setShowCustomSpendLimit}
        tokenToBeApproved={tokenToBeApproved}
        displaySpendLimit={displaySpendLimit}
        limitFiatValue={limitFiatValue}
      />
    </Stack>
  );
}
