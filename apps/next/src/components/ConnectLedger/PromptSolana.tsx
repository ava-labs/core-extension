import { Stack, StackProps } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { SolanaGlowLogo } from './SolanaGlowLogo';

type SolanaPromptProps = StackProps & {
  onNext: () => void;
  onSkip: () => void;
};
export const PromptSolana: FC<SolanaPromptProps> = ({
  onNext,
  onSkip,
  ...stackProps
}) => {
  const { t } = useTranslation();

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <FullscreenModalTitle>
        {t(`Do you want to add Solana to your wallet?`)}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(
          `To use Solana in Core you will need to add an account from your Ledger device. You can always add this later at any time`,
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent>
        <SolanaGlowLogo />
      </FullscreenModalContent>
      <FullscreenModalActions>
        <NavButton color="secondary" onClick={onSkip}>
          {t('No thanks')}
        </NavButton>
        <NavButton color="primary" onClick={onNext}>
          {t('Add Solana')}
        </NavButton>
      </FullscreenModalActions>
    </Stack>
  );
};
