import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  Checkbox,
  SecondaryButton,
  PrimaryButton,
  LoadingIcon,
} from '@avalabs/react-components';
import { store } from '@src/store/store';
import { DappPermissions } from '@src/store/permissions';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { getAccountsFromWallet } from '@src/background/services';
import { useEffect } from 'react';

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

function atleastOneAccountHasPermissions(permissions: DappPermissions) {
  return (Object.values(permissions.accounts) || []).some((value) => value);
}

function component() {
  const { wallet } = useWalletContext();
  const params = new URLSearchParams(window.location.search);
  let domain = params.get('domain') as string;

  const [permissions, updatePermissions] = useState<
    ReturnType<typeof accountsToPermissions> | undefined
  >();

  useEffect(() => {
    if (wallet) {
      updatePermissions(
        store.permissionsStore.permissions[domain] ??
          accountsToPermissions(getAccountsFromWallet(wallet), domain)
      );
    }
  }, [wallet]);

  const acceptPermissionsDisabled = useMemo(
    () => permissions && !atleastOneAccountHasPermissions(permissions),
    [permissions]
  );

  if (!permissions) {
    return <LoadingIcon />;
  }

  function onChangeUpdatePermissions(key: string) {
    if (!permissions) return;

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
        <SecondaryButton onClick={() => window.close()}>cancel</SecondaryButton>
        <PrimaryButton
          disabled={acceptPermissionsDisabled}
          onClick={() => {
            store.permissionsStore.addPermissionsForDomain(permissions);
            window.close();
          }}
        >
          approve
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}

export const PermissionsPage = observer(component);
export default PermissionsPage;
