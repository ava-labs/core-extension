import AddIcon from '@/components/AddIcon';
import { Button, Stack, toast } from '@avalabs/k2-alpine';
import {
  LedgerAppType,
  useAccountsContext,
  useAnalyticsContext,
  useLedgerContext,
  useWalletContext,
  useWalletTotalBalanceContext,
} from '@core/ui';
import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { LedgerTooltip } from './components/LedgerTooltip';

export const AddAccountButton: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { addAccount, selectAccount } = useAccountsContext();
  const { fetchBalanceForWallet } = useWalletTotalBalanceContext();
  const { walletDetails, isLedgerWallet } = useWalletContext();
  const { hasLedgerTransport, appType } = useLedgerContext();

  const canAddNewAccount =
    !isLedgerWallet ||
    (hasLedgerTransport && appType === LedgerAppType.AVALANCHE);

  const TooltipWrapper = canAddNewAccount ? Fragment : LedgerTooltip;

  return (
    <TooltipWrapper>
      <Stack marginTop={1} alignItems="center" justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          disabled={!canAddNewAccount}
          onClick={() =>
            addAccount()
              .then(selectAccount)
              .then(() => {
                if (walletDetails?.id) {
                  fetchBalanceForWallet(walletDetails.id);
                }
                toast.success(t('Account created successfully'));
                capture('CreatedANewAccountSuccessfully', {
                  walletType: walletDetails?.type,
                });
              })
              .catch((error) => {
                toast.error(t('Account creation failed'));
                console.error(error);
              })
          }
        >
          <AddIcon size={12} />
          {t('Add account')}
        </Button>
      </Stack>
    </TooltipWrapper>
  );
};
