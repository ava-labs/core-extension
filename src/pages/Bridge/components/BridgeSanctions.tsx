import {
  Typography,
  VerticalFlex,
  WarningIcon,
} from '@avalabs/react-components';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { useTheme } from 'styled-components';
import { t } from 'i18next';

export const BridgeSanctions = () => {
  const theme = useTheme();
  return (
    <VerticalFlex>
      <PageTitle variant={PageTitleVariant.PRIMARY}></PageTitle>
      <WarningIcon color={theme.colors.error} height="32px" />
      <Typography
        margin="16px"
        size={16}
        align="center"
        height="24px"
        weight="bold"
      >
        {t('Failed to connect')}
      </Typography>
      <Typography size={16} align="center" height="24px" margin="0 16px">
        {t(
          'Users may not use the Bridge if they are on the Specially Designated Nationals (SDN) List of the Office of Foreign Assets Control (OFAC) or any other sanctions or are otherwise a sanctioned person or from a sanctioned jurisdiction'
        )}
      </Typography>
    </VerticalFlex>
  );
};
