import { Page } from '@/components/Page';
import { StackProps, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { MdWarningAmber } from 'react-icons/md';

const contentProps: StackProps = {
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  width: 1,
  height: 1,
  gap: 0.5,
};

export const BridgeSanctions = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('Bridge')} withBackButton contentProps={contentProps}>
      <MdWarningAmber size={72} />
      <Typography variant="h4">{t('Failed to connect')}</Typography>
      <Typography
        variant="body2"
        sx={{ mx: 5, color: 'text.secondary', textAlign: 'center' }}
      >
        {t(
          'Users may not use the Bridge if they are on the Specially Designated Nationals (SDN) List of the Office of Foreign Assets Control (OFAC) or any other sanctions or are otherwise a sanctioned person or from a sanctioned jurisdiction',
        )}
      </Typography>
    </Page>
  );
};
