import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';

import { isSolanaNetwork } from '@core/common';
import { useAccountsContext } from '@core/ui';
import { useWalletContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { MagicSolanaLogo } from '@/components/common/MagicSolanaLogo';
import Dialog from '@/components/common/Dialog';
import { useTranslation } from 'react-i18next';
import { openFullscreenTab } from '@core/common';
import { ChainId } from '@avalabs/core-chains-sdk';

const LedgerSolanaAddressPrompt = () => {
  const { t } = useTranslation();
  const {
    accounts: { active: account },
  } = useAccountsContext();
  const { isLedgerWallet } = useWalletContext();
  const { network, setNetwork, getNetwork } = useNetworkContext();

  const defaultNetwork = useMemo(
    () =>
      getNetwork(ChainId.AVALANCHE_MAINNET_ID) ||
      getNetwork(ChainId.AVALANCHE_TESTNET_ID),
    [getNetwork],
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isMissingSolanaAddress = useMemo(() => {
    if (!account || !network || !isLedgerWallet) {
      return false;
    }

    return isSolanaNetwork(network) && !account.addressSVM;
  }, [account, isLedgerWallet, network]);

  const theme = useTheme();

  useEffect(() => {
    const isOnDerivingScreen = location.hash.includes(
      'ledger/derive-solana-addresses',
    );

    // Prevent showing this prompt when user is about to actually add the Solana accounts.
    if (isMissingSolanaAddress && !isOnDerivingScreen) {
      setIsDialogOpen(true);
    }
  }, [isMissingSolanaAddress]);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => {
        if (defaultNetwork) {
          setNetwork(defaultNetwork);
        }
        setIsDialogOpen(false);
      }}
      title={t('Add a Solana Ledger Account')}
      content={
        <Stack sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            align="left"
            color={theme.palette.grey[500]}
            sx={{
              lineHeight: '20px',
            }}
          >
            {t(
              `To use the Solana network with this account you will need to add a Solana address from your Ledger device.`,
            )}
          </Typography>
          <MagicSolanaLogo outerSize={320} innerSize={187} />
          <Button
            size="large"
            fullWidth
            color="primary"
            onClick={() => openFullscreenTab('ledger/derive-solana-addresses')}
          >
            {t('Add Solana Address')}
          </Button>
        </Stack>
      }
    />
  );
};

export default LedgerSolanaAddressPrompt;
