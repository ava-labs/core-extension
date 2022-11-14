import { useHistory } from 'react-router-dom';
import { AccountSelectorButton } from './AccountSelectorButton';

export function AccountSelector() {
  const history = useHistory();

  return (
    <AccountSelectorButton
      data-testid="account-selector-button"
      onClick={() => {
        history.push('/accounts');
      }}
    />
  );
}
