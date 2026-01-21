import { Dialog, DialogProps, Slide } from '@avalabs/k2-alpine';
import { useGoBack } from '@core/ui';
import { PropsWithChildren } from 'react';

const dialogSlots: Pick<DialogProps, 'slots' | 'slotProps'> = {
  slots: {
    transition: Slide,
  },
  slotProps: {
    transition: {
      direction: 'up',
    },
    paper: {
      sx: { borderRadius: 0 },
    },
  },
};

type SlideUpDialogProps = PropsWithChildren<{
  open: boolean;
  onClose?: () => void;
  zIndex?: number;
}>;

export const SlideUpDialog = ({
  open,
  onClose,
  children,
  zIndex,
}: SlideUpDialogProps) => {
  const goBack = useGoBack();
  return (
    <Dialog
      {...dialogSlots}
      sx={{ zIndex }}
      open={open}
      onClose={onClose || goBack}
      fullScreen
    >
      {children}
    </Dialog>
  );
};
