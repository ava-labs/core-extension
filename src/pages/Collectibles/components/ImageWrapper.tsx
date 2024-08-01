import {
  Box,
  ChevronLeftIcon,
  IconButton,
  Stack,
} from '@avalabs/core-k2-components';
import { Overlay } from '@src/components/common/Overlay';
import { PropsWithChildren } from 'react';
interface ImageWrapperProps {
  isOverlay: boolean;
  onClick: () => void;
  onClose: () => void;
  backdropImageUrl?: string;
  shouldUseLightIcon: boolean;
}

export function ImageWrapper({
  isOverlay,
  onClick,
  onClose,
  backdropImageUrl,
  shouldUseLightIcon,
  children,
}: PropsWithChildren<ImageWrapperProps>) {
  if (isOverlay) {
    return (
      <Overlay>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${backdropImageUrl})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(16px)',
          }}
        />
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
              <ChevronLeftIcon
                size={32}
                sx={{
                  color: shouldUseLightIcon
                    ? 'primary.light'
                    : 'primary.contrastText',
                }}
              />
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
