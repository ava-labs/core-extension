import {
  Button,
  ButtonProps,
  ChevronDownIcon,
  Tooltip,
  styled,
} from '@avalabs/k2-components';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useHistory } from 'react-router-dom';

const AccountName = styled('span')`
  max-width: 165px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export function AccountSelectorButton(props: ButtonProps) {
  const history = useHistory();
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
      }}
      endIcon={<ChevronDownIcon />}
      sx={{ p: 0, fontSize: '20px' }}
      {...props}
    >
      <Tooltip title={activeAccount?.name}>
        <AccountName>{activeAccount?.name}</AccountName>
      </Tooltip>
    </Button>
  );
}
