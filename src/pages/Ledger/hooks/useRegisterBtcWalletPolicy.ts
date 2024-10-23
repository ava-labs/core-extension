import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  AccountType,
  PrimaryAccount,
} from '@src/background/services/accounts/models';
import { GetBtcWalletPolicyDetails } from '@src/background/services/wallet/handlers/getBtcWalletPolicyDetails';
import { WalletDetails } from '@src/background/services/wallet/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { LedgerAppType, useLedgerContext } from '@src/contexts/LedgerProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { useEffect, useState } from 'react';

const useRegisterBtcWalletPolicy = () => {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const [shouldRegisterBtcWalletPolicy, setShouldRegisterBtcWalletPolicy] =
    useState<boolean>(false);
  const [walletPolicyName, setWalletPolicyName] = useState<
    string | undefined
  >();
  const [walletPolicyDerivationpath, setWalletPolicyDerivationpath] = useState<
    string | undefined
  >();
  const { walletDetails } = useWalletContext();
  const { appType, setMasterFingerprint } = useLedgerContext();
  const { accounts } = useAccountsContext();
  const { request } = useConnectionContext();
  const activeAccount = accounts.active;

  useEffect(() => {
    const fetchWalletPolicyDetails = async (
      account: PrimaryAccount,
      details: WalletDetails
    ) => {
      const { masterFingerprint } =
        (await request<GetBtcWalletPolicyDetails>({
          method: ExtensionRequest.WALLET_GET_BTC_WALLET_POLICY_DETAILS,
        })) ?? {};

      setMasterFingerprint(masterFingerprint);

      if (!masterFingerprint) {
        if (details.derivationPath === DerivationPath.LedgerLive) {
          setWalletPolicyName(`Core - ${account.name}`);
          setWalletPolicyDerivationpath(`44'/60'/${account.index}'`);
        } else if (details.derivationPath === DerivationPath.BIP44) {
          setWalletPolicyName('Core');
          setWalletPolicyDerivationpath(`44'/60'/0'`);
        }

        setShouldRegisterBtcWalletPolicy(true);
      }
    };

    if (activeAccount?.type !== AccountType.PRIMARY || !walletDetails) {
      return;
    }

    // This effect may be called in-between updates coming from AccountsProvider and WalletProvider
    // We need to wait for those to be in-sync, otherwise we may prompt for policy registration
    // when user is switching from a Ledger wallet/account to a non-Ledger wallet/account.
    if (activeAccount.walletId !== walletDetails.id) {
      return;
    }

    setMasterFingerprint(undefined);
    setWalletPolicyName(undefined);
    setWalletPolicyDerivationpath(undefined);
    setShouldRegisterBtcWalletPolicy(false);

    if (isUsingLedgerWallet && appType === LedgerAppType.BITCOIN) {
      fetchWalletPolicyDetails(activeAccount, walletDetails);
    }
  }, [
    activeAccount,
    appType,
    walletDetails,
    isUsingLedgerWallet,
    request,
    setMasterFingerprint,
  ]);

  return {
    shouldRegisterBtcWalletPolicy,
    walletPolicyName,
    walletPolicyDerivationpath,
  };
};

export default useRegisterBtcWalletPolicy;
