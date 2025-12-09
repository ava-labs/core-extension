import { useAccountsContext } from '../contexts';
import { useConnectionContext } from '../contexts';
import { useLedgerContext } from '../contexts';
import { useWalletContext } from '../contexts';
import { useIsUsingLedgerWallet } from './useIsUsingLedgerWallet';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { GetBtcWalletPolicyDetails } from '@core/service-worker';
import { AccountType, ExtensionRequest } from '@core/types';
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
  const { setMasterFingerprint } = useLedgerContext();
  const { accounts } = useAccountsContext();
  const { request } = useConnectionContext();
  const activeAccount = accounts.active;

  const reset = useCallback(() => {
    setMasterFingerprint(undefined);
    setShouldRegisterBtcWalletPolicy(false);
  }, [setMasterFingerprint]);

  const check = useCallback(async () => {
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

    const { masterFingerprint } =
      (await request<GetBtcWalletPolicyDetails>({
        method: ExtensionRequest.WALLET_GET_BTC_WALLET_POLICY_DETAILS,
      })) ?? {};

    setMasterFingerprint(masterFingerprint);

    if (!masterFingerprint) {
      if (walletDetails.derivationPath === DerivationPath.LedgerLive) {
        setWalletPolicyName(`Core - ${activeAccount.name}`);
        setWalletPolicyDerivationpath(`44'/60'/${activeAccount.index}'`);
      } else if (walletDetails.derivationPath === DerivationPath.BIP44) {
        setWalletPolicyName('Core');
        setWalletPolicyDerivationpath(`44'/60'/0'`);
      }

      setShouldRegisterBtcWalletPolicy(true);
    }
  }, [
    request,
    setMasterFingerprint,
    setWalletPolicyName,
    setWalletPolicyDerivationpath,
    activeAccount,
    walletDetails,
    reset,
  ]);

  useEffect(() => {
    if (isUsingLedgerWallet) {
      check();
    }
  }, [isUsingLedgerWallet, check]);

  return {
    shouldRegisterBtcWalletPolicy,
    walletPolicyName,
    walletPolicyDerivationpath,
    reset,
    check,
  };
};
