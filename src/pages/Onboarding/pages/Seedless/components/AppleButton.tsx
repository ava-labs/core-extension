import { AppleIcon, Button } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

export function AppleButton() {
  const { t } = useTranslation();
  return (
    <Button
      sx={{ width: '100%' }}
      data-testid="create-wallet-seed-phrase-button"
      color="secondary"
      size="large"
      endIcon={<AppleIcon size={20} />}
      onClick={() => {
        console.log('Apple Login');
      }}
    >
      {t('Apple ID')}
    </Button>
  );
}
