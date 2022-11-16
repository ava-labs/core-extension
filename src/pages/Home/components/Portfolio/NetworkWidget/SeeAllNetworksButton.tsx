import {
  SecondaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { NetworkCard } from './common/NetworkCard';
import { useTranslation } from 'react-i18next';

interface SeeAllNetworksButtonProps {
  isFullWidth: boolean;
}

export function SeeAllNetworksButton({
  isFullWidth,
}: SeeAllNetworksButtonProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();

  return isFullWidth ? (
    <SecondaryButton
      data-testid="see-all-networks-button"
      width={'100%'}
      onClick={(e) => {
        e.stopPropagation();
        history.push('/networks?activeTab=NETWORKS');
      }}
    >
      {t('See all networks')}
    </SecondaryButton>
  ) : (
    <NetworkCard
      data-testid="see-all-networks-button"
      width="164px"
      display="inline-block"
      margin="0 0 16px 0"
      padding="16px"
      onClick={() => history.push('/networks?activeTab=NETWORKS')}
    >
      <VerticalFlex justify="center" align="center" height="100%">
        <Typography color={theme.colors.text1} size={14} weight="bold">
          {t('See all networks')}
        </Typography>
      </VerticalFlex>
    </NetworkCard>
  );
}
