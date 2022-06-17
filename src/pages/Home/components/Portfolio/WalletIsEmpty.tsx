import {
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { StyledQRCodeIcon } from './NetworkWidget/common/StyledQRCodeIcon';

export function WalletIsEmpty() {
  const history = useHistory();
  const { checkIsFunctionAvailable } = useIsFunctionAvailable();
  const theme = useTheme();
  return (
    <VerticalFlex margin="48px 0 0" align="center">
      {checkIsFunctionAvailable('ManageTokens') ? (
        <>
          <Typography size={18} height="22px" weight={600} margin="0 0 16px">
            No assets
          </Typography>
          <Typography size={14} align="center" height="17px" margin="0 0 24px">
            Add assets by clicking the button below
          </Typography>
          <PrimaryButton
            width="100%"
            onClick={(e) => {
              e.stopPropagation();
              history.push('/manage-tokens');
            }}
          >
            Add assets
          </PrimaryButton>
        </>
      ) : (
        <>
          <Typography size={18} height="22px" weight={600} margin="0 0 16px">
            No assets
          </Typography>
          <Typography size={14} align="center" height="17px" margin="0 0 24px">
            Receive assets by clicking the button below
          </Typography>
          <PrimaryButton
            width="100%"
            onClick={(e) => {
              e.stopPropagation();
              history.push('/receive');
            }}
          >
            <StyledQRCodeIcon color={theme.colors.icon1} />
            Receive
          </PrimaryButton>
        </>
      )}
    </VerticalFlex>
  );
}
