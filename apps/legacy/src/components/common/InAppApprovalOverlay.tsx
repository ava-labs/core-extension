import { useMemo } from 'react';
import { Fade, Stack, useTheme } from '@avalabs/core-k2-components';

import { useApprovalsContext } from '@core/ui';
import { ApprovalRoutes } from '@/popup/ApprovalRoutes';

import { Overlay } from './Overlay';
import { TestnetBanner } from './TestnetBanner';

export const InAppApprovalOverlay = () => {
  const theme = useTheme();
  const { approval } = useApprovalsContext();

  // We provide fake location to the router to avoid having to
  // change URL when we trigger the in-app approval screens.
  const fakeLocation = useMemo(() => {
    if (!approval) {
      return {
        ...window.location,
        state: null,
      };
    }
    const url = new URL(approval.url, window.location.href);

    return {
      hash: url.hash,
      pathname: url.pathname,
      search: url.search,
      state: null,
    };
  }, [approval]);

  return (
    <Overlay
      TransitionComponent={Fade}
      in={Boolean(approval)}
      sx={{
        zIndex: theme.zIndex.modal,
      }}
      isBackgroundFilled
    >
      <Stack sx={{ width: 1, height: 1 }}>
        <TestnetBanner />
        <Stack sx={{ width: 1, height: 1, pt: 1 }}>
          <ApprovalRoutes location={fakeLocation} />
        </Stack>
      </Stack>
    </Overlay>
  );
};
