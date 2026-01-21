import { SolanaGlowLogo } from '@/components/ConnectLedger';
import { PublicKey } from '@/components/ConnectLedger/LedgerConnector/types';
import {
  FullscreenModalContent,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { CircularProgress, Stack } from '@avalabs/k2-alpine';
import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppendSolanaPublicKeysHandler } from '~/services/secrets/handlers/appendSolanaPublicKeys';

type Props = {
  keys: PublicKey[];
  walletId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
};

export const ActivationPhase: FC<Props> = ({ keys, walletId, ...handlers }) => {
  const { request } = useConnectionContext();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    setIsLoading(true);
    request<AppendSolanaPublicKeysHandler>({
      method: ExtensionRequest.SECRETS_APPEND_SOLANA_PUBLIC_KEYS,
      params: {
        publicKeys: keys.map(({ key: { key }, index }) => ({ index, key })),
        walletId,
      },
    })
      .catch(handlersRef.current.onError)
      .then(handlersRef.current.onSuccess)
      .finally(() => setIsLoading(false));
  }, [keys, request, walletId]);

  return (
    <Stack height="100%" width="100%">
      <FullscreenModalTitle>
        {isLoading
          ? t('Activating Solana addresses...')
          : t('Solana addresses activated')}
      </FullscreenModalTitle>
      <FullscreenModalContent sx={{ gap: 3, alignItems: 'center' }}>
        <SolanaGlowLogo />
        <CircularProgress size={48} />
      </FullscreenModalContent>
    </Stack>
  );
};
