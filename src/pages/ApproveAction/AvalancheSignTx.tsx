import { useCallback } from 'react';
import { Button, Scrollbars, Stack } from '@avalabs/k2-components';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ActionStatus } from '@src/background/services/actions/models';
import {
  AvalancheTxType,
  isAddDelegatorTx,
  isAddValidatorTx,
  isExportTx,
  isImportTx,
  isBaseTx,
} from '@src/background/services/wallet/models';

import { ImportTxView } from './components/ApproveImportTx';
import { ExportTxView } from './components/ApproveExportTx';
import { AddValidator } from './components/ApproveAddValidator';
import { AddDelegator } from './components/ApproveAddDelegator';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { BaseTxView } from './components/ApproveBaseTx';

export function AvalancheSignTx() {
  const requestId = useGetRequestId();
  const { action, updateAction } = useApproveAction(requestId);
  const { network } = useNetworkContext();
  const tokenPrice = useNativeTokenPrice(network);

  const signTx = useCallback(() => {
    updateAction({
      status: ActionStatus.SUBMITTING,
      id: requestId,
      result: '',
    });
    window.close();
  }, [requestId, updateAction]);

  if (!action) {
    return <LoadingOverlay />;
  }

  const renderSignTxDetails = () => {
    const tx = action.displayData.txData as AvalancheTxType;
    if (isAddValidatorTx(tx)) {
      return <AddValidator tx={tx} avaxPrice={tokenPrice}></AddValidator>;
    } else if (isAddDelegatorTx(tx)) {
      return <AddDelegator tx={tx} avaxPrice={tokenPrice}></AddDelegator>;
    } else if (isExportTx(tx)) {
      return <ExportTxView tx={tx} avaxPrice={tokenPrice}></ExportTxView>;
    } else if (isImportTx(tx)) {
      return <ImportTxView tx={tx} avaxPrice={tokenPrice}></ImportTxView>;
    } else if (isBaseTx(tx)) {
      return <BaseTxView tx={tx} avaxPrice={tokenPrice}></BaseTxView>;
    }
    return <>UNKNOWN TX</>;
  };

  return (
    <Stack sx={{ my: 0, mx: 2, width: 1, justifyContent: 'space-between' }}>
      <Scrollbars>{renderSignTxDetails()}</Scrollbars>

      <Stack
        sx={{
          mt: 2,
          mb: 1,
          flexDirection: 'row',
        }}
      >
        <Button
          fullWidth
          size="medium"
          color="secondary"
          sx={{ mr: 1 }}
          onClick={() => {
            updateAction({
              status: ActionStatus.ERROR_USER_CANCELED,
              id: action.id,
            });
            window.close();
          }}
        >
          Reject
        </Button>
        <Button
          fullWidth
          size="medium"
          onClick={() => {
            signTx();
          }}
        >
          Approve
        </Button>
      </Stack>
    </Stack>
  );
}
