import { runtime } from 'webextension-polyfill';
import { Stack, styled, Typography } from '@avalabs/k2-alpine';

export const AppInfoFooter = () => (
  <StyledFooter>
    <Typography variant="caption" color="text.secondary">
      © 2025 Ava Labs All rights reserved. v{runtime.getManifest().version}
    </Typography>
  </StyledFooter>
);

const StyledFooter = styled(Stack)`
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  justify-content: center;
  flex-direction: row;
  position: fixed;
  bottom: 0;
`;
