import { Stack, useTheme } from '@avalabs/k2-alpine';
import { getClassSelector } from './styledComponents';

type ConciergeBackdropProps = {
  conciergeBackdropRef: React.RefObject<HTMLDivElement | null>;
  hasBackdropEntered: React.RefObject<boolean>;
  setIsAIBackdropOpen: (isOpen: boolean) => void;
  setIsHoverAreaHidden: (isHidden: boolean) => void;
};

export const ConciergeBackdrop = ({
  conciergeBackdropRef,
  hasBackdropEntered,
  setIsAIBackdropOpen,
  setIsHoverAreaHidden,
}: ConciergeBackdropProps) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#28282ECC',
        backdropFilter: 'none',
        display: 'none',
        transition: 'opacity 400ms linear',
        opacity: 0,
        zIndex: theme.zIndex.appBar - 1,
        [`&.${getClassSelector('BACKDROP', 'enter')}`]: {
          display: 'flex',
        },
        [`&.${getClassSelector('BACKDROP', 'enter-done')}`]: {
          display: 'flex',
          opacity: 1,
        },
      }}
      ref={conciergeBackdropRef}
      onMouseMove={() => {
        if (hasBackdropEntered.current) {
          setIsAIBackdropOpen(false);
          setIsHoverAreaHidden(false);
        }
      }}
    />
  );
};
