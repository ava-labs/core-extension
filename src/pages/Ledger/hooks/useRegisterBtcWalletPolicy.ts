import { DerivationPath } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { AccountType } from '@src/background/services/accounts/models';
import { GetBtcWalletPolicyDetails } from '@src/background/services/wallet/handlers/getBtcWalletPolicyDetails';
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
    const fetchWalletPolicyDetails = async () => {
      if (activeAccount?.type !== AccountType.PRIMARY) {
        return;
      }

      const { masterFingerprint } =
        (await request<GetBtcWalletPolicyDetails>({
          method: ExtensionRequest.WALLET_GET_BTC_WALLET_POLICY_DETAILS,
        })) ?? {};

      setMasterFingerprint(masterFingerprint);

      if (!masterFingerprint) {
        if (walletDetails?.derivationPath === DerivationPath.LedgerLive) {
          setWalletPolicyName(`Core - ${activeAccount.name}`);
          setWalletPolicyDerivationpath(`44'/60'/${activeAccount.index}'`);
        } else if (walletDetails?.derivationPath === DerivationPath.BIP44) {
          setWalletPolicyName('Core');
          setWalletPolicyDerivationpath(`44'/60'/0'`);
        }

        setShouldRegisterBtcWalletPolicy(true);
      }
    };

    setMasterFingerprint(undefined);
    setWalletPolicyName(undefined);
    setWalletPolicyDerivationpath(undefined);
    setShouldRegisterBtcWalletPolicy(false);

    if (isUsingLedgerWallet && appType === LedgerAppType.BITCOIN) {
      fetchWalletPolicyDetails();
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
