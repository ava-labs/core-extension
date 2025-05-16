import {
  Box,
  Dialog,
  IconButton,
  Stack,
  Typography,
  type DialogProps,
  CoreIcon,
  useTheme,
  getHexAlpha,
} from '@avalabs/k2-alpine';
import type { ReactNode } from 'react';
import { runtime } from 'webextension-polyfill';

// FIXME: import from @avalabs/k2-alpine
import { FiArrowLeft } from 'react-icons/fi';

import { LanguageSelector } from './LanguageSelector';
export interface FullscreenModalProps {
  children: ReactNode;
  onClose: DialogProps['onClose'];
  onBack?: () => void;
  open: boolean;
  sx?: DialogProps['sx'];
  title: string;
  withCoreLogo?: boolean;
  withAppInfo?: boolean;
  withLanguageSelector?: boolean;
  actions?: ReactNode;
  pageControl?: ReactNode;
}

export const FullscreenModal = ({
  children,
  onClose,
  onBack,
  open,
  sx,
  title,
  actions,
  withCoreLogo,
  withAppInfo,
  withLanguageSelector,
  pageControl,
}: FullscreenModalProps) => {
  const theme = useTheme();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { borderRadius: 0 } } }}
      sx={sx}
    >
      {withCoreLogo && (
        <Box position="fixed" top={32} left={32}>
          <CoreIcon opacity={0.1} />
        </Box>
      )}
      {withLanguageSelector && (
        <Box position="fixed" top={32} right={32}>
          <LanguageSelector />
        </Box>
      )}
      <Stack
        sx={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          component="main"
          sx={{
            p: 0,
            width: 1,
            maxWidth: '600px',
            height: '80vh',
            borderRadius: 3,
            backgroundColor: 'surface.secondary',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: getHexAlpha(
              theme.palette.mode === 'light'
                ? theme.palette.common.black
                : theme.palette.common.white,
              10,
            ),
            boxShadow: '0px 15px 30px 0px rgba(0, 0, 0, 0.10)',
          }}
        >
          <Stack
            sx={{
              px: 4,
              py: 0,
              height: 1,
              justifyContent: 'space-between',
            }}
          >
            <Stack>
              <Stack
                direction="row"
                position="relative"
                justifyContent="center"
                alignItems="center"
                sx={{ pt: 4, pb: 2 }}
              >
                {onBack && (
                  <IconButton
                    sx={{ position: 'absolute', left: 0 }}
                    onClick={onBack}
                  >
                    <FiArrowLeft />
                  </IconButton>
                )}
                {pageControl}
              </Stack>
              <Typography variant="h1" sx={{ mt: 2, mb: 6 }}>
                {title}
              </Typography>
            </Stack>
            <Stack
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {children}
            </Stack>
            <Stack
              sx={{
                pt: 3.5,
                pb: 4,
                flexDirection: 'row',
                width: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {actions}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {withAppInfo && (
        <Stack sx={{ justifyContent: 'center', flexDirection: 'row', pb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            © 2025 Ava Labs All rights reserved. v
            {runtime.getManifest().version}
          </Typography>
        </Stack>
      )}
    </Dialog>
  );
};
