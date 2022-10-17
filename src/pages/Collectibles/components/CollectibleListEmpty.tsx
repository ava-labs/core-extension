import { Typography, VerticalFlex } from '@avalabs/react-components';
import { t } from 'i18next';

export function CollectibleListEmpty() {
  return (
    <VerticalFlex align="center" grow="1" justify="center">
      <Typography size={18} height="22px" weight={600}>
        {t('No Collectibles')}
      </Typography>
      <Typography size={14} align="center" height="17px" margin="8px 0">
        {t('You don’t have any collectibles yet.')}
      </Typography>
    </VerticalFlex>
  );
}
