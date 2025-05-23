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
  StackProps,
  combineSx,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { createContext, FC, useContext, useState, type ReactNode } from 'react';
import { runtime } from 'webextension-polyfill';

import { FiArrowLeft } from 'react-icons/fi';

import { LanguageSelector } from './LanguageSelector';
import { PageControl, PageControlData } from './PageControl';

export interface OnboardingModalProps {
  children: ReactNode;
  onClose?: DialogProps['onClose'];
  onBack?: () => void;
  open: boolean;
  sx?: DialogProps['sx'];
  withCoreLogo?: boolean;
  withAppInfo?: boolean;
  withLanguageSelector?: boolean;
  pageControl?: PageControlData;
}

const ModalPageControlContext = createContext<
  PageControlData & {
    setTotal: (total: number) => void;
    setCurrent: (current: number) => void;
    isBackButtonVisible: boolean;
    setIsBackButtonVisible: (isBackButtonVisible: boolean) => void;
  }
>({
  total: 0,
  current: 0,
  setTotal: () => {},
  setCurrent: () => {},
  isBackButtonVisible: true,
  setIsBackButtonVisible: () => {},
});

const ModalPageControlProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(true);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);

  return (
    <ModalPageControlContext.Provider
      value={{
        total,
        current,
        setTotal,
        setCurrent,
        isBackButtonVisible,
        setIsBackButtonVisible,
      }}
    >
      {children}
    </ModalPageControlContext.Provider>
  );
};

export const useModalPageControl = () => useContext(ModalPageControlContext);

export const OnboardingModal: FC<OnboardingModalProps> = ({
  children,
  onClose,
  onBack,
  open,
  sx,
  withCoreLogo,
  withAppInfo,
  withLanguageSelector,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slotProps={{
        container: {
          sx: {
            backdropFilter: 'blur(45px)',
          },
        },
        paper: {
          sx: {
            p: 0,
            width: 1,
            maxWidth: '600px',
            height: '80vh',
            maxHeight: '720px',
            borderRadius: 3,
            backgroundColor: 'surface.secondary',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: getHexAlpha(theme.palette.primary.main, 10),
            boxShadow: '0px 15px 30px 0px rgba(0, 0, 0, 0.10)',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
      }}
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
          px: 4,
          py: 0,
          height: 1,
          width: 1,
        }}
      >
        <ModalPageControlProvider>
          <ModalPageControlContext.Consumer>
            {({ total, current }) => (
              <>
                <Stack
                  direction="row"
                  position="relative"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ pt: 4, pb: 2, height: 56 }}
                >
                  {onBack && (
                    <IconButton
                      sx={{ position: 'absolute', left: 0 }}
                      onClick={onBack}
                    >
                      <FiArrowLeft />
                    </IconButton>
                  )}
                  {total > 1 && (
                    <PageControl size="large" total={total} current={current} />
                  )}
                </Stack>
                {children}
              </>
            )}
          </ModalPageControlContext.Consumer>
        </ModalPageControlProvider>
      </Stack>
      {withAppInfo && (
        <Stack
          sx={{
            position: 'fixed',
            bottom: 0,
            justifyContent: 'center',
            flexDirection: 'row',
            pb: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2025 Ava Labs All rights reserved. v
            {runtime.getManifest().version}
          </Typography>
        </Stack>
      )}
    </Dialog>
  );
};

export const OnboardingStepTitle = ({ sx, ...props }: TypographyProps) => (
  <Typography variant="h1" sx={combineSx({ my: 2 }, sx)} {...props} />
);

export const OnboardingStepDescription = (props: TypographyProps) => (
  <Typography variant="body1" color="text.secondary" {...props} />
);

export const OnboardingStepContent = ({ sx, ...props }: StackProps) => (
  <Stack
    sx={combineSx(
      {
        pt: 4,
        flexGrow: 1,
        height: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
      sx,
    )}
    {...props}
  />
);

export const OnboardingStepActions = ({ sx, ...props }: StackProps) => (
  <Stack
    sx={combineSx(
      {
        pt: 3.5,
        pb: 4,
        flexDirection: 'row',
        width: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 1,
      },
      sx,
    )}
    {...props}
  />
);
