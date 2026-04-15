import { getHexAlpha, Stack, useTheme } from '@avalabs/k2-alpine';
import { createPortal } from 'react-dom';
import { getClassSelector } from './styledComponents';
import { HEADER_HEIGHT } from '@/config/constants';

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
  const scrimBackground =
    theme.palette.mode === 'light'
      ? getHexAlpha('#F5F5F6', 90)
      : getHexAlpha('#28282E', 90);

  return createPortal(
    <Stack
      sx={{
        position: 'fixed',
        top: `${HEADER_HEIGHT}px`,
        left: 0,
        right: 0,
        bottom: 0,
        boxSizing: 'border-box',
        background: scrimBackground,
        backdropFilter: 'none',
        display: 'none',
        transition: 'opacity 200ms linear',
        opacity: 0,
        zIndex: theme.zIndex.appBar + 5,
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
    />,
    document.body,
  );
};
