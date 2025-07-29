import { getContactsPath } from '@/config/routes';
import { Route, Switch } from 'react-router-dom';
import { ContactList } from './ContactList';
import { AddContact } from './AddContact';
import { ContactDetails } from './ContactDetails';
import { useContactsContext } from '@core/ui';
import { CircularProgress, Stack } from '@avalabs/k2-alpine';
import { RemoveContact } from './RemoveContact';

const BASE_PATHS = [getContactsPath(), getContactsPath('list')];

export const Contacts = () => {
  const { isLoading } = useContactsContext();

  if (isLoading) {
    return (
      <Stack
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Switch>
      <Route exact path={BASE_PATHS} component={ContactList} />
      <Route path={getContactsPath('add')} component={AddContact} />
      <Route path={getContactsPath('details')} component={ContactDetails} />
      <Route path={getContactsPath('remove')} component={RemoveContact} />
    </Switch>
  );
};
