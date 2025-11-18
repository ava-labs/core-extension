import { useAccountsContext } from '../contexts';
import { useConnectionContext } from '../contexts';
import { LedgerAppType, useLedgerContext } from '../contexts';
import { useWalletContext } from '../contexts';
import { useIsUsingLedgerWallet } from './useIsUsingLedgerWallet';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { GetBtcWalletPolicyDetails } from '@core/service-worker';
import {
  AccountType,
  ExtensionRequest,
  PrimaryAccount,
  WalletDetails,
} from '@core/types';
import { useCallback, useEffect, useState } from 'react';

export const useRegisterBtcWalletPolicy = () => {
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

  const reset = useCallback(() => {
    setMasterFingerprint(undefined);
    setShouldRegisterBtcWalletPolicy(false);
  }, [setMasterFingerprint]);

  useEffect(() => {
    const fetchWalletPolicyDetails = async (
      account: PrimaryAccount,
      details: WalletDetails,
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

    reset();

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
    reset,
  ]);

  return {
    shouldRegisterBtcWalletPolicy,
    walletPolicyName,
    walletPolicyDerivationpath,
    reset,
  };
};
