import { useCallback } from 'react';
import {
  Avatar,
  ExternalLinkIcon,
  IconButton,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

import { openNewTab } from '@src/utils/extensionUtils';
import type { DefiProtocol } from '@src/background/services/defi/models';

import { useConvertedCurrencyFormatter } from '../hooks/useConvertedCurrencyFormatter';

type DefiProtocolDetailsHeaderProps = {
  protocol: DefiProtocol;
};

export const DefiProtocolDetailsHeader = ({
  protocol,
}: DefiProtocolDetailsHeaderProps) => {
  const formatValue = useConvertedCurrencyFormatter();

  const goToProtocolPage = useCallback(() => {
    if (protocol?.siteUrl) {
      openNewTab({ url: protocol?.siteUrl });
    }
  }, [protocol]);

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'start',
        gap: 2,
        pt: 2,
        pb: 1,
      }}
    >
      <Avatar src={protocol.logoUrl} alt={protocol.name} sx={{ mt: 0.5 }} />
      <Stack sx={{ gap: 1, justifyContent: 'space-between' }}>
        <Typography variant="h4" data-testid="defi-protocol-header-name">
          {protocol.name}
        </Typography>
        {protocol.chainId && (
          <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
            <Avatar
              src={protocol.chainLogoUrl}
              alt={protocol.chainName}
              sx={{ width: 12, height: 12 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              data-testid="defi-protocol-header-chain"
            >
              {protocol.chainName}
            </Typography>
          </Stack>
        )}
      </Stack>
      <Stack sx={{ alignItems: 'flex-end', flexGrow: 1 }}>
        <Typography
          variant="button"
          sx={{ fontSize: 14 }}
          data-testid="defi-protocol-header-value"
        >
          {formatValue(protocol.totalUsdValue)}
        </Typography>
        <IconButton
          component="a"
          size="small"
          sx={{ mr: -0.5 }}
          onClick={goToProtocolPage}
          data-testid="defi-protocol-header-dapp-link"
        >
          <ExternalLinkIcon size={16} />
        </IconButton>
      </Stack>
    </Stack>
  );
};
