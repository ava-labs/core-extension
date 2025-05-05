import { Typography, useTheme, Button } from '@avalabs/core-k2-components';
import { Trans, useTranslation } from 'react-i18next';
import { LedgerAppType, useLedgerContext } from '@/contexts/LedgerProvider';
import {
  useIsSpecificContextContainer,
} from '@/hooks/useIsSpecificContextContainer';
import { openExtensionNewWindow } from '@core/common';
import { ContextContainer } from '@core/types';

interface LedgerIncorrectAppProps {
  requiredAppType: LedgerAppType;
}

export const LedgerIncorrectApp = ({
  requiredAppType,
}: LedgerIncorrectAppProps) => {
  const theme = useTheme();
  const { popDeviceSelection } = useLedgerContext();
  const { t } = useTranslation();
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  return (
    <>
      <Typography
        variant="body2"
        align="left"
        color={theme.palette.grey[500]}
        sx={{
          lineHeight: '20px',
        }}
      >
        <Trans
          i18nKey="Please switch to the {{requiredAppType}} app on your Ledger"
          values={{ requiredAppType }}
        />
      </Typography>
      {requiredAppType !== LedgerAppType.AVALANCHE && (
        <Button
          onClick={async () => {
            if (isConfirm) {
              popDeviceSelection();
            } else {
              await openExtensionNewWindow(
                `ledger/connect?app=${requiredAppType}`,
                '',
              );
              window.close();
            }
          }}
          sx={{ mt: 2 }}
        >
          {t('Connect Ledger')}
        </Button>
      )}
    </>
  );
};
