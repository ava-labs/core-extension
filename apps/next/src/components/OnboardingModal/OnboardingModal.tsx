import { Box, type DialogProps, CoreIcon } from '@avalabs/k2-alpine';
import { FC, type ReactNode } from 'react';

import { LanguageSelector } from '../LanguageSelector';
import { type PageControlData } from '../PageControl';

import { AppInfoFooter } from './AppInfoFooter';
import { OnboardingModalHeader } from './OnboardingModalHeader';
import { OnboardingModalContentRoot } from './OnboardingModalContentRoot';
import { FullscreenModal } from './FullscreenModal';

export interface OnboardingModalProps {
  children: ReactNode;
  onClose?: DialogProps['onClose'];
  onBack?: () => void;
  open: boolean;
  withCoreLogo?: boolean;
  withAppInfo?: boolean;
  withLanguageSelector?: boolean;
  pageControl?: PageControlData;
}

export const OnboardingModal: FC<OnboardingModalProps> = ({
  children,
  onClose,
  onBack,
  open,
  withCoreLogo,
  withAppInfo,
  withLanguageSelector,
}) => {
  return (
    <FullscreenModal fullScreen open={open} onClose={onClose}>
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
      <OnboardingModalContentRoot>
        <OnboardingModalHeader onBack={onBack} />
        {children}
      </OnboardingModalContentRoot>
      {withAppInfo && <AppInfoFooter />}
    </FullscreenModal>
  );
};
