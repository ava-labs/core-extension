import {
  Button,
  ButtonProps,
  ChevronDownIcon,
  Tooltip,
  Typography,
} from '@avalabs/k2-components';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useHistory } from 'react-router-dom';

export function AccountSelectorButton(props: ButtonProps) {
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return (
    <Button
      size="xlarge"
      color="primary"
      variant="text"
      data-testid="account-selector-button"
      onClick={() => {
        history.push('/accounts');
        capture('AccountSelectorOpened');
      }}
      endIcon={<ChevronDownIcon />}
      sx={{ p: 0 }}
      {...props}
    >
      <Tooltip title={activeAccount?.name}>
        <Typography variant="h6">{activeAccount?.name}</Typography>
      </Tooltip>
    </Button>
  );
}
