import { useMemo } from 'react';
import { Dialog, DialogProps, Slide } from '@avalabs/k2-alpine';
import { type Location } from 'history';

import { useApprovalsContext } from '@core/ui';

import { ApprovalRoutes } from '@/routing';

const dialogProps: Omit<DialogProps, 'open'> = {
  slots: {
    transition: Slide,
  },
  slotProps: {
    transition: {
      direction: 'up',
    },
    paper: {
      sx: {
        maxHeight: 'unset',
        height: '100vh',
        width: '100vw',
        m: 0,
        p: 0,
        borderRadius: 0,
      },
    },
  },
};

export const InAppApprovalOverlay = () => {
  const { approval } = useApprovalsContext();

  // We provide fake location to the router to avoid having to
  // change URL when we trigger the in-app approval screens, because
  // we don't want to have the approval screens in the history state.
  const fakeLocation: Location = useMemo(() => {
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
    <Dialog {...dialogProps} open={Boolean(approval)}>
      <ApprovalRoutes location={fakeLocation} />
    </Dialog>
  );
};
