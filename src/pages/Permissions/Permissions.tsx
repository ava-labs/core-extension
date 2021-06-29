import React from 'react';
import { VerticalFlex, Typography } from '@avalabs/react-components';

export function PermissionsPage() {
  const params = new URLSearchParams(window.location.search); // id=123
  let domain = params.get('domain'); // 123

  return (
    <VerticalFlex align={'center'}>
      <Typography>The following dApp</Typography>
      <Typography>{domain}</Typography>
      <Typography>is requesting permissions</Typography>
    </VerticalFlex>
  );
}
