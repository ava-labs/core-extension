import { ChevronLeftIcon, IconButton, Stack } from '@avalabs/k2-components';
import { Overlay } from '@src/components/common/Overlay';
import { PropsWithChildren } from 'react';
interface ImageWrapperProps {
  isOverlay: boolean;
  onClick: () => void;
  onClose: () => void;
}

export function ImageWrapper({
  isOverlay,
  onClick,
  onClose,
  children,
}: PropsWithChildren<ImageWrapperProps>) {
  if (isOverlay) {
    return (
      <Overlay>
        <Stack
          sx={{
            height: '100%',
            width: '100%',
          }}
        >
          <Stack
            sx={{
              px: 1,
              py: 4,
              alignItems: 'flex-start',
            }}
          >
            <IconButton
              onClick={onClose}
              data-testid="page-title-back-button"
              disableRipple
              sx={{
                p: 0,
              }}
            >
              <ChevronLeftIcon size={32} />
            </IconButton>
          </Stack>
          {children}
        </Stack>
      </Overlay>
    );
  }
  return (
    <Stack onClick={onClick} sx={{ width: '100%', flexDirection: 'row' }}>
      {children}
    </Stack>
  );
}
