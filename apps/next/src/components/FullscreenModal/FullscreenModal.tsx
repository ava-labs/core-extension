import {
  Box,
  CoreIcon,
  Dialog,
  getHexAlpha,
  styled,
  type DialogProps,
} from '@avalabs/k2-alpine';
import { FC, type ReactNode } from 'react';

import { LanguageSelector } from '../LanguageSelector';
import { type PageControlData } from '../PageControl';

import { AppInfoFooter } from './AppInfoFooter';
import { FullscreenModalHeader } from './FullscreenModalHeader';
import { FullscreenModalContentRoot } from './FullscreenModalContentRoot';
import { useFeatureFlagContext } from '@core/ui';
import { FeatureGates } from '@core/types';

export interface FullscreenModalProps {
  children: ReactNode;
  onClose?: DialogProps['onClose'];
  onBack?: () => void;
  open: boolean;
  withCoreLogo?: boolean;
  withAppInfo?: boolean;
  withLanguageSelector?: boolean;
  pageControl?: PageControlData;
}

export const FullscreenModal: FC<FullscreenModalProps> = ({
  children,
  onClose,
  onBack,
  open,
  withCoreLogo,
  withAppInfo,
  withLanguageSelector,
}) => {
  const { featureFlags } = useFeatureFlagContext();
  return (
    <StyledModal fullScreen open={open} onClose={onClose}>
      {withCoreLogo && (
        <Box position="fixed" top={28} left={28}>
          <CoreIcon opacity={0.1} />
        </Box>
      )}
      {withLanguageSelector && featureFlags[FeatureGates.LANGUAGES] && (
        <Box position="fixed" top={28} right={28}>
          <LanguageSelector
            dataTestId="settings-language-selector"
            onSelectEventName="AppLanguageChanged"
          />
        </Box>
      )}
      <FullscreenModalContentRoot>
        <FullscreenModalHeader onBack={onBack} />
        {children}
      </FullscreenModalContentRoot>
      {withAppInfo && <AppInfoFooter />}
    </StyledModal>
  );
};

const StyledModal = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    padding: 0,
    width: '100%',
    maxWidth: '600px',
    height: '80vh',
    maxHeight: '720px',
    borderRadius: theme.shape.largeBorderRadius,
    backgroundColor: theme.palette.surface.secondary,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: getHexAlpha(theme.palette.primary.main, 10),
    boxShadow: '0px 15px 30px 0px rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
