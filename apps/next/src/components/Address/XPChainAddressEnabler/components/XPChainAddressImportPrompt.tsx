import { FC } from 'react';
import { createPortal } from 'react-dom';
import { withThemeInvert } from '@avalabs/k2-alpine';

import { Account } from '@core/types';

import { HardwareApprovalDrawer } from '@/components/HardwareApprovalDrawer';

import { useImportMissingKeysFromKeystone } from '../hooks/useImportMissingKeysFromKeystone';
import { XPEnablerContent } from './XPEnablerContent';

export const XPChainAddressImportPrompt: FC<{
  onClose: () => void;
  /**
   * Used to verify the EVM address of the first account in order
   * to ensure the proper device is used for address derivation.
   */
  firstAccount: Account;
  /**
   * Should be set to true if the parent component is a dropdown or a menu.
   * Otherwise the rendered hardware connection drawer will have the color theme inverted.
   */
  invertTheme?: boolean;
}> = ({ onClose, firstAccount, invertTheme = false }) => {
  const { status, retry } = useImportMissingKeysFromKeystone(
    firstAccount.addressC,
  );

  const ThemeAwareDrawer = invertTheme
    ? withThemeInvert(HardwareApprovalDrawer)
    : HardwareApprovalDrawer;

  // Creating a portal to escape the positioning of CSS-`transform`ed parent component.
  return createPortal(
    <ThemeAwareDrawer open reject={onClose}>
      <XPEnablerContent status={status} onRetry={retry} />
    </ThemeAwareDrawer>,
    document.body,
  );
};
