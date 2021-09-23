import React from 'react';
import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  Checkbox,
  SecondaryButton,
  PrimaryButton,
  LoadingIcon,
} from '@avalabs/react-components';
import { usePermissions } from './usePermissions';

export function PermissionsPage() {
  const params = new URLSearchParams(window.location.search);
  const domain = params.get('domain') as string;
  const {
    addPermissionsForDomain,
    permissions,
    acceptPermissionsDisabled,
    updateAccountPermission,
  } = usePermissions(domain);

  if (!permissions) {
    return <LoadingIcon />;
  }

  function onChangeUpdatePermissions(key: string) {
    if (!permissions) return;

    return (state: boolean) => updateAccountPermission(key, state);
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
              onChange={onChangeUpdatePermissions(key) as any}
            />
          </HorizontalFlex>
        ))}
      </VerticalFlex>
      <HorizontalFlex>
        <SecondaryButton onClick={() => window.close()}>cancel</SecondaryButton>
        <PrimaryButton
          disabled={acceptPermissionsDisabled}
          onClick={() => {
            addPermissionsForDomain(permissions).then(() => window.close());
          }}
        >
          approve
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}

export default PermissionsPage;
