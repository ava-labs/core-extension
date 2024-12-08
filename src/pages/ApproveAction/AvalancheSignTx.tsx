import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Scrollbars, Stack } from '@avalabs/core-k2-components';
import { Avalanche } from '@avalabs/core-wallets-sdk';

import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ActionStatus } from '@src/background/services/actions/models';

import { ImportTxView } from './components/ApproveImportTx';
import { ExportTxView } from './components/ApproveExportTx';
import { AddValidator } from './components/ApproveAddValidator';
import { AddDelegator } from './components/ApproveAddDelegator';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { BaseTxView } from './components/ApproveBaseTx';
import { useLedgerDisconnectedDialog } from '../SignTransaction/hooks/useLedgerDisconnectedDialog';
import { LedgerAppType } from '@src/contexts/LedgerProvider';
import { LedgerApprovalOverlay } from '../SignTransaction/components/LedgerApprovalOverlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { ApproveCreateSubnet } from './components/ApproveCreateSubnet';
import { ApproveCreateChain } from './components/ApproveCreateChain';
import { AddSubnetValidatorView } from './components/ApproveAddSubnetValidator';
import { AvalancheTxHeader } from './components/AvalancheTxHeader';
import { ExcessiveBurnWarningDialog } from './components/ExcessiveBurnWarningDialog';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import { WalletConnectApprovalOverlay } from '../SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay';
import { useApprovalHelpers } from '@src/hooks/useApprovalHelpers';
import { AddPermissionlessValidator } from '@src/pages/ApproveAction/components/ApproveAddPermissionlessValidator';
import { AddPermissionlessDelegator } from '@src/pages/ApproveAction/components/ApproveAddPermissionlessDelegator';
import useIsUsingFireblocksAccount from '@src/hooks/useIsUsingFireblocksAccount';
import { FireblocksApprovalOverlay } from '../SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay';
import { RemoveSubnetValidatorView } from './components/ApproveRemoveSubnetValidator';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { ApproveConvertSubnetToL1 } from './components/ApproveConvertSubnetToL1';
import { ApproveRegisterL1Validator } from './components/ApproveRegisterL1Validator';
import { ApproveIncreaseL1ValidatorBalance } from './components/ApproveIncreaseL1ValidatorBalance';
import { ApproveDisableL1Validator } from './components/ApproveDisableL1Validator';
import { ApproveSetL1ValidatorWeight } from './components/ApproveSetL1ValidatorWeight';

export function AvalancheSignTx() {
  const requestId = useGetRequestId();
  const { action, updateAction, cancelHandler } = useApproveAction(requestId);
  const { network } = useNetworkContext();
  const { t } = useTranslation();
  const { isFunctionAvailable: isSigningAvailable } = useIsFunctionAvailable(
    FunctionNames.SIGN,
  );
  const tokenPrice = useNativeTokenPrice(network);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isWalletConnectAccount = useIsUsingWalletConnectAccount();
  const isFireblocksAccount = useIsUsingFireblocksAccount();
  const [showBurnWarning, setShowBurnWarning] = useState(false);
  const txData = action?.displayData.txData;

  useEffect(() => {
    // When the transaction details are loading, `txData` may be undefined,
    // so we need to listen for it to be populated and then make sure
    // `isValidAvaxBurnedAmount` is false (not just falsey).
    const couldBurnExcessAmount = txData?.isValidAvaxBurnedAmount === false;

    if (couldBurnExcessAmount) {
      setShowBurnWarning(true);
    }
  }, [txData?.isValidAvaxBurnedAmount]);

  useLedgerDisconnectedDialog(
    () => handleRejection(),
    LedgerAppType.AVALANCHE,
    network,
  );

  const signTx = useCallback(async () => {
    await updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      isUsingLedgerWallet || isWalletConnectAccount || isFireblocksAccount,
    );
  }, [
    updateAction,
    requestId,
    isUsingLedgerWallet,
    isWalletConnectAccount,
    isFireblocksAccount,
  ]);

  const { handleApproval, handleRejection, isApprovalOverlayVisible } =
    useApprovalHelpers({
      onApprove: signTx,
      onReject: cancelHandler,
    });

  const renderDeviceApproval = useCallback(() => {
    if (isApprovalOverlayVisible) {
      if (isUsingLedgerWallet) {
        return <LedgerApprovalOverlay />;
      }

      if (isWalletConnectAccount) {
        return (
          <WalletConnectApprovalOverlay
            onReject={handleRejection}
            onSubmit={handleApproval}
          />
        );
      }
      if (isFireblocksAccount) {
        return (
          <FireblocksApprovalOverlay
            onReject={handleRejection}
            onSubmit={handleApproval}
          />
        );
      }
    }
  }, [
    isApprovalOverlayVisible,
    isUsingLedgerWallet,
    isWalletConnectAccount,
    isFireblocksAccount,
    handleRejection,
    handleApproval,
  ]);

  const renderSignTxDetails = useCallback(
    (tx: Avalanche.Tx) => {
      if (Avalanche.isAddValidatorTx(tx)) {
        return <AddValidator tx={tx} avaxPrice={tokenPrice}></AddValidator>;
      } else if (Avalanche.isAddDelegatorTx(tx)) {
        return <AddDelegator tx={tx} avaxPrice={tokenPrice}></AddDelegator>;
      } else if (Avalanche.isExportTx(tx)) {
        return <ExportTxView tx={tx} avaxPrice={tokenPrice}></ExportTxView>;
      } else if (Avalanche.isImportTx(tx)) {
        return <ImportTxView tx={tx} avaxPrice={tokenPrice}></ImportTxView>;
      } else if (Avalanche.isBaseTx(tx)) {
        return <BaseTxView tx={tx} avaxPrice={tokenPrice}></BaseTxView>;
      } else if (Avalanche.isConvertSubnetToL1Tx(tx)) {
        return <ApproveConvertSubnetToL1 tx={tx} avaxPrice={tokenPrice} />;
      } else if (Avalanche.isRegisterL1ValidatorTx(tx)) {
        return <ApproveRegisterL1Validator tx={tx} avaxPrice={tokenPrice} />;
      } else if (Avalanche.isDisableL1ValidatorTx(tx)) {
        return <ApproveDisableL1Validator tx={tx} avaxPrice={tokenPrice} />;
      } else if (Avalanche.isSetL1ValidatorWeightTx(tx)) {
        return <ApproveSetL1ValidatorWeight tx={tx} avaxPrice={tokenPrice} />;
      } else if (Avalanche.isIncreaseL1ValidatorBalance(tx)) {
        return (
          <ApproveIncreaseL1ValidatorBalance tx={tx} avaxPrice={tokenPrice} />
        );
      } else if (Avalanche.isCreateSubnetTx(tx)) {
        return (
          <ApproveCreateSubnet
            tx={tx}
            avaxPrice={tokenPrice}
          ></ApproveCreateSubnet>
        );
      } else if (Avalanche.isCreateChainTx(tx)) {
        return (
          <ApproveCreateChain
            tx={tx}
            avaxPrice={tokenPrice}
          ></ApproveCreateChain>
        );
      } else if (Avalanche.isAddSubnetValidatorTx(tx)) {
        return (
          <AddSubnetValidatorView
            tx={tx}
            avaxPrice={tokenPrice}
          ></AddSubnetValidatorView>
        );
      } else if (Avalanche.isRemoveSubnetValidatorTx(tx)) {
        return (
          <RemoveSubnetValidatorView
            tx={tx}
            avaxPrice={tokenPrice}
          ></RemoveSubnetValidatorView>
        );
      } else if (Avalanche.isAddPermissionlessValidatorTx(tx)) {
        return (
          <AddPermissionlessValidator
            tx={tx}
            avaxPrice={tokenPrice}
          ></AddPermissionlessValidator>
        );
      } else if (Avalanche.isAddPermissionlessDelegatorTx(tx)) {
        return (
          <AddPermissionlessDelegator
            tx={tx}
            avaxPrice={tokenPrice}
          ></AddPermissionlessDelegator>
        );
      }

      return <>UNKNOWN TX</>;
    },
    [tokenPrice],
  );

  if (!action) {
    return <LoadingOverlay />;
  }

  if (!isSigningAvailable) {
    return (
      <FunctionIsOffline functionName={FunctionNames.FEATURE} hidePageTitle />
    );
  }

  return (
    <Stack sx={{ px: 2, width: 1, height: 1 }}>
      {renderDeviceApproval()}
      <AvalancheTxHeader tx={txData} />

      <Scrollbars>
        <Stack sx={{ gap: 3.5 }}>{renderSignTxDetails(txData)}</Stack>
      </Scrollbars>

      <ExcessiveBurnWarningDialog
        open={showBurnWarning}
        onContinue={() => setShowBurnWarning(false)}
        onReject={handleRejection}
      />

      <Stack
        sx={{
          pt: 3,
          pb: 1,
          flexDirection: 'row',
          gap: 1,
        }}
      >
        <Button
          fullWidth
          size="large"
          color="secondary"
          onClick={handleRejection}
        >
          {t('Reject')}
        </Button>
        <Button fullWidth size="large" onClick={handleApproval}>
          {t('Approve')}
        </Button>
      </Stack>
    </Stack>
  );
}
