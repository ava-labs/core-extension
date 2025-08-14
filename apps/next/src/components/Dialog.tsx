import { Dialog, DialogProps, Slide } from '@avalabs/k2-alpine';
import { useGoBack } from '@core/ui';
import { PropsWithChildren } from 'react';

export const dialogSlots: Pick<DialogProps, 'slots' | 'slotProps'> = {
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
}>;

export const SlideUpDialog = ({
  open,
  onClose,
  children,
}: SlideUpDialogProps) => {
  const goBack = useGoBack();
  return (
    <Dialog {...dialogSlots} open={open} onClose={onClose || goBack} fullScreen>
      {children}
    </Dialog>
  );
};
