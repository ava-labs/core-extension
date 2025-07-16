import { ChainId } from '@avalabs/core-chains-sdk';
import { useEffect, useMemo, useState } from 'react';

import {
  useAccountsContext,
  useNetworkContext,
  useWalletContext,
} from '@core/ui';
import { isSolanaNetwork, openFullscreenTab } from '@core/common';

import { SolanaNowSupported } from '@/components/announcements';

const LedgerSolanaAddressPrompt = () => {
  const {
    accounts: { active: account },
  } = useAccountsContext();
  const { isLedgerWallet } = useWalletContext();
  const { network, getNetwork, setNetwork } = useNetworkContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultNetwork = useMemo(
    () =>
      getNetwork(ChainId.AVALANCHE_MAINNET_ID) ||
      getNetwork(ChainId.AVALANCHE_TESTNET_ID),
    [getNetwork],
  );

  const isMissingSolanaAddress = useMemo(() => {
    if (!account || !network || !isLedgerWallet) {
      return false;
    }

    return isSolanaNetwork(network) && !account.addressSVM;
  }, [account, isLedgerWallet, network]);

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
    <SolanaNowSupported
      open={isDialogOpen}
      onProceed={() => {
        openFullscreenTab('ledger/derive-solana-addresses');
      }}
      onSkip={() => {
        if (defaultNetwork) {
          setNetwork(defaultNetwork);
        }
        setIsDialogOpen(false);
      }}
    />
  );
};

export default LedgerSolanaAddressPrompt;
