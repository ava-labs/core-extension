import { Box } from '@avalabs/core-k2-components';
import { AlertBox } from 'packages/ui/pages/Permissions/components/AlertBox';
import { WarningBox } from 'packages/ui/pages/Permissions/components/WarningBox';
import { useTranslation } from 'react-i18next';

interface TxWarningBoxProps {
  isMalicious?: boolean;
  isSuspicious?: boolean;
}

export function TxWarningBox({ isMalicious, isSuspicious }: TxWarningBoxProps) {
  const { t } = useTranslation();
  return (
    <>
      {isMalicious && (
        <Box sx={{ mb: 3 }}>
          <AlertBox
            title={t('Scam Transaction')}
            text={t('This transaction is malicious do not proceed.')}
          />
        </Box>
      )}
      {isSuspicious && (
        <Box sx={{ mb: 3 }}>
          <WarningBox
            title={t('Suspicious Transaction')}
            text={t('Use caution, this transaction may be malicious.')}
          />
        </Box>
      )}
    </>
  );
}
