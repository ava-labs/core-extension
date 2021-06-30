import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  Checkbox,
  SecondaryButton,
  PrimaryButton,
} from '@avalabs/react-components';
import { store } from '@src/store/store';

function accountsToPermissions(accounts: string[], domain: string) {
  return {
    domain,
    accounts: accounts.reduce((acc, account) => {
      return {
        ...acc,
        [account]: false,
      };
    }, {}),
  };
}

function updateAnAccount(
  permissions: ReturnType<typeof accountsToPermissions>,
  account: { [key: string]: boolean }
) {
  return {
    ...permissions,
    accounts: {
      ...permissions.accounts,
      ...account,
    },
  };
}

function component() {
  const params = new URLSearchParams(window.location.search);
  let domain = params.get('domain') as string;
  const [permissions, updatePermissions] = useState(
    store.permissionsStore.permissions[domain] ??
      accountsToPermissions(store.walletStore.accounts, domain)
  );

  function onChangeUpdatePermissions(key: string) {
    return (state: boolean) =>
      updatePermissions(updateAnAccount(permissions, { [key]: state }));
  }
  return (
    <VerticalFlex align={'center'} padding={'0 0 20px 0'}>
      <Typography size={14}>The dApp</Typography>
      <Typography weight={700}>{permissions.domain}</Typography>
      <Typography size={14}>is requesting the following permissions</Typography>
      <br />
      <VerticalFlex flex={1}>
        <Typography>
          View the following accounts (at least 1 is required)
        </Typography>
        <br />
        {Object.keys(permissions.accounts).map((key) => (
          <HorizontalFlex key={key}>
            <Checkbox
              isChecked={permissions.accounts[key]}
              label={key}
              onChange={onChangeUpdatePermissions(key)}
            />
          </HorizontalFlex>
        ))}
      </VerticalFlex>
      <HorizontalFlex>
        <SecondaryButton>cancel</SecondaryButton>
        <PrimaryButton>approve</PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}

export const PermissionsPage = observer(component);
