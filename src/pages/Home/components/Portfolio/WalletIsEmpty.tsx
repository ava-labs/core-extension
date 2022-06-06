import {
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useHistory } from 'react-router-dom';

export function WalletIsEmpty() {
  const history = useHistory();
  return (
    <VerticalFlex margin="48px 0 0" align="center">
      <Typography size={18} height="22px" weight={600} margin="0 0 16px">
        No assets
      </Typography>
      <Typography size={14} align="center" height="17px" margin="0 0 24px">
        Add assets by clicking the button bloew
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
    </VerticalFlex>
  );
}
