import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { Stack, StackProps } from '@avalabs/k2-alpine';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

import SolanaGlow from './images/SolanaGlow.png';

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
        <Stack
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <img src={SolanaGlow} alt="Solana Glowing Logo" height="270px" />
        </Stack>
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
