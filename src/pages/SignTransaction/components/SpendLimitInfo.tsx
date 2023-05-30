import { Button } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { UNLIMITED_SPEND_LIMIT_LABEL } from '../hooks/useGetTransaction';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TokenAmount } from './TokenAmount';

type SpendLimitInfoProps = {
  tokenToBeApproved: TokenWithBalance;
  displaySpendLimit: string;
  limitFiatValue: string | null;
  hideEdit: boolean;
  setShowCustomSpendLimit: (visible: boolean) => void;
};

export const SpendLimitInfo = ({
  hideEdit,
  setShowCustomSpendLimit,
  tokenToBeApproved,
  displaySpendLimit,
  limitFiatValue,
}: SpendLimitInfoProps) => {
  const { t } = useTranslation();
  const { currency, currencyFormatter } = useSettingsContext();

  const displayFiatValue = typeof limitFiatValue === 'string';
  const isUnlimited = limitFiatValue === UNLIMITED_SPEND_LIMIT_LABEL;

  const fiatValue = isUnlimited
    ? `${limitFiatValue} ${currency}`
    : currencyFormatter(Number(limitFiatValue));

  return (
    <ApprovalSection>
      <ApprovalSectionHeader label={t('Spend Limit')}>
        {!hideEdit && (
          <Button
            variant="text"
            color="secondary"
            size="small"
            sx={{ px: 0, minWidth: 'auto' }}
            onClick={() => setShowCustomSpendLimit(true)}
          >
            {t('Edit')}
          </Button>
        )}
      </ApprovalSectionHeader>
      <ApprovalSectionBody>
        <TokenAmount
          token={tokenToBeApproved}
          amount={displaySpendLimit}
          fiatValue={displayFiatValue ? fiatValue : undefined}
        />
      </ApprovalSectionBody>
    </ApprovalSection>
  );
};
