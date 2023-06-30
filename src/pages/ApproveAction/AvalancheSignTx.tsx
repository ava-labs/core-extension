import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Scrollbars, Stack } from '@avalabs/k2-components';

import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { Action, ActionStatus } from '@src/background/services/actions/models';

import { ImportTxView } from './components/ApproveImportTx';
import { ExportTxView } from './components/ApproveExportTx';
import { AddValidator } from './components/ApproveAddValidator';
import { AddDelegator } from './components/ApproveAddDelegator';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { BaseTxView } from './components/ApproveBaseTx';
import { useLedgerDisconnectedDialog } from '../SignTransaction/hooks/useLedgerDisconnectedDialog';
import { LedgerAppType } from '@src/contexts/LedgerProvider';
import { LedgerApprovalOverlay } from '../SignTransaction/LedgerApprovalOverlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { ApproveCreateSubnet } from './components/ApproveCreateSubnet';
import { ApproveCreateChain } from './components/ApproveCreateChain';
import { AddSubnetValidatorView } from './components/ApproveAddSubnetValidator';
import { AvalancheTxHeader } from './components/AvalancheTxHeader';
import { Avalanche } from '@avalabs/wallets-sdk';

export function AvalancheSignTx() {
  const requestId = useGetRequestId();
  const { action, updateAction } = useApproveAction(requestId);
  const { network } = useNetworkContext();
  const { t } = useTranslation();
  const tokenPrice = useNativeTokenPrice(network);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();

  useLedgerDisconnectedDialog(window.close, LedgerAppType.AVALANCHE, network);

  const signTx = useCallback(() => {
    updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      isUsingLedgerWallet
    );
  }, [isUsingLedgerWallet, requestId, updateAction]);

  const renderLedgerApproval = useCallback(
    (action: Action) => {
      if (action.status === ActionStatus.SUBMITTING && isUsingLedgerWallet) {
        return <LedgerApprovalOverlay displayData={action.displayData} />;
      }
    },
    [isUsingLedgerWallet]
  );

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
      }

      return <>UNKNOWN TX</>;
    },
    [tokenPrice]
  );

  if (!action) {
    return <LoadingOverlay />;
  }

  return (
    <Stack sx={{ px: 2, width: 1, justifyContent: 'space-between' }}>
      {renderLedgerApproval(action)}
      <AvalancheTxHeader tx={action.displayData.txData} />

      <Scrollbars>
        <Stack sx={{ gap: 3.5 }}>
          {renderSignTxDetails(action.displayData.txData)}
        </Stack>
      </Scrollbars>

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
          onClick={() => {
            updateAction({
              status: ActionStatus.ERROR_USER_CANCELED,
              id: action.id,
            });
            window.close();
          }}
        >
          {t('Reject')}
        </Button>
        <Button fullWidth size="large" onClick={signTx}>
          {t('Approve')}
        </Button>
      </Stack>
    </Stack>
  );
}
