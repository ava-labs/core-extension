import {
  Alert,
  AlertTitle,
  AlertTriangleIcon,
  Stack,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@/components/common/approval/ApprovalSection';
import {
  TransactionTokenCard,
  TransactionTokenCardVariant,
} from './TransactionTokenCard';
import { NftAccordion } from './NftAccordion';
import { BalanceChange } from '@avalabs/vm-module-types';

type TxBalanceChangeProps = BalanceChange & {
  isSimulationSuccessful?: boolean;
};

export const TxBalanceChange = ({
  ins,
  outs,
  isSimulationSuccessful,
}: TxBalanceChangeProps) => {
  const { t } = useTranslation();

  const hasSentItems = outs.length > 0;
  const hasReceivedItems = ins.length > 0;

  const showNoPreExecWarning = isSimulationSuccessful === false; // may be undefined
  const showNoDataWarning =
    !hasSentItems && !hasReceivedItems && !isSimulationSuccessful;

  return (
    <ApprovalSection>
      <ApprovalSectionHeader
        label={t('Balance Change')}
        tooltip={
          showNoPreExecWarning
            ? t(
                'Transaction pre-execution is unavailable. The displayed token list might be incomplete.',
              )
            : ''
        }
        tooltipIcon={
          showNoPreExecWarning ? (
            <AlertTriangleIcon
              sx={{ color: 'warning.main', cursor: 'pointer' }}
            />
          ) : undefined
        }
      />
      <ApprovalSectionBody>
        <Stack gap={2}>
          {outs.map(({ token, items }) =>
            items.length === 1 ? (
              <TransactionTokenCard
                key={`send-token-${
                  'address' in token ? token.address : token.symbol
                }`}
                variant={TransactionTokenCardVariant.SEND}
                token={token}
                diffItem={items[0]!}
                sx={{ p: 0 }}
              />
            ) : (
              <NftAccordion
                key={`send-token-group-${
                  'address' in token ? token.address : token.symbol
                }`}
                token={token}
                diffItems={items}
                variant={TransactionTokenCardVariant.SEND}
              />
            ),
          )}
          {ins.map(({ token, items }) =>
            items.length === 1 ? (
              <TransactionTokenCard
                key={`receive-token-${
                  'address' in token ? token.address : token.symbol
                }`}
                variant={TransactionTokenCardVariant.RECEIVE}
                token={token}
                diffItem={items[0]!}
                sx={{ p: 0 }}
              />
            ) : (
              <NftAccordion
                key={`receive-token-group-${
                  'address' in token ? token.address : token.symbol
                }`}
                token={token}
                diffItems={items}
                variant={TransactionTokenCardVariant.RECEIVE}
              />
            ),
          )}

          {showNoDataWarning && (
            <Alert severity="info">
              <AlertTitle>{t('Balance change info not available')}</AlertTitle>
              {t('Please proceed with caution')}
            </Alert>
          )}
        </Stack>
      </ApprovalSectionBody>
    </ApprovalSection>
  );
};
