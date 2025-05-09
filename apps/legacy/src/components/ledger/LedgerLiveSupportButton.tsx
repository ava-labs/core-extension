import {
  Button,
  ExternalLinkIcon,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

export const LedgerLiveSupportButton = () => {
  const { t } = useTranslation();

  return (
    <Button
      variant="text"
      onClick={() => {
        window.open(
          'https://www.ledger.com/ledger-live',
          '_blank',
          'noreferrer',
        );
      }}
    >
      <ExternalLinkIcon size={16} sx={{ color: 'secondary.main' }} />
      <Typography
        variant="caption"
        sx={{
          ml: 1,
          color: 'secondary.main',
        }}
      >
        {t('Ledger Live Support')}
      </Typography>
    </Button>
  );
};
