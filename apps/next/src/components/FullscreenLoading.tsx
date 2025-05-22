import { styled, Stack, CircularProgress } from '@avalabs/k2-alpine';

import { CoreSplash } from './CoreSplash';

export const FullscreenLoading = () => (
  <FullscreenContainer gap={20}>
    <CoreSplash size="big" />
    <CircularProgress />
  </FullscreenContainer>
);

const FullscreenContainer = styled(Stack)`
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;
