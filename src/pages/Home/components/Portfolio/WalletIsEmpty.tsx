import {
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { StyledQRCodeIcon } from './NetworkWidget/common/StyledQRCodeIcon';
import { useTranslation } from 'react-i18next';

export function WalletIsEmpty() {
  const history = useHistory();
  const { checkIsFunctionAvailable } = useIsFunctionAvailable();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <VerticalFlex margin="48px 0 0" align="center">
      {checkIsFunctionAvailable('ManageTokens') ? (
        <>
          <Typography size={18} height="22px" weight={600} margin="0 0 16px">
            {t('No assets')}
          </Typography>
          <Typography size={14} align="center" height="17px" margin="0 0 24px">
            {t('Add assets by clicking the button below')}
          </Typography>
          <PrimaryButton
            width="100%"
            onClick={(e) => {
              e.stopPropagation();
              history.push('/manage-tokens');
            }}
          >
            {t('Add assets')}
          </PrimaryButton>
        </>
      ) : (
        <>
          <Typography size={18} height="22px" weight={600} margin="0 0 16px">
            {t('No assets')}
          </Typography>
          <Typography size={14} align="center" height="17px" margin="0 0 24px">
            {t('Receive assets by clicking the button below')}
          </Typography>
          <PrimaryButton
            width="100%"
            onClick={(e) => {
              e.stopPropagation();
              history.push('/receive');
            }}
          >
            <StyledQRCodeIcon color={theme.colors.icon1} />
            {t('Receive')}
          </PrimaryButton>
        </>
      )}
    </VerticalFlex>
  );
}
