import { Page } from '@/components/Page';
import { WarningMessage } from '@/components/WarningMessage';
import { getBridgePath } from '@/config/routes';
import { Button, StackProps } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const contentProps: StackProps = {
  justifyContent: 'space-between',
  alignItems: 'stretch',
  width: 1,
  height: 1,
  gap: 0.5,
  color: 'text.secondary',
};

export const BridgeSanctions: FC = () => {
  const { t } = useTranslation();
  const { replace } = useHistory();
  const handleDismiss = () => {
    replace(getBridgePath({}));
  };
  return (
    <Page
      title={t('Failed to connect')}
      withBackButton
      onBack={handleDismiss}
      contentProps={contentProps}
    >
      <WarningMessage>
        {t(
          'Users may not use the Bridge if they are on the Specially Designated Nationals (SDN) List of the Office of Foreign Assets Control (OFAC) or any other sanctions or are otherwise a sanctioned person or from a sanctioned jurisdiction',
        )}
      </WarningMessage>

      <Button
        variant="contained"
        size="extension"
        color="secondary"
        onClick={handleDismiss}
        fullWidth
        sx={{
          mt: 'auto',
        }}
      >
        {t('Dismiss')}
      </Button>
    </Page>
  );
};
