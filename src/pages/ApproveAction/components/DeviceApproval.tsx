import { satoshiToBtc } from '@avalabs/core-bridge-sdk';
import { RpcMethod, SigningData } from '@avalabs/vm-module-types';
import { TokenUnit } from '@avalabs/core-utils-sdk';

import { Action, ActionStatus } from 'packages/service-worker/src/services/actions/models';
import { NetworkWithCaipId } from 'packages/service-worker/src/services/network/models';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';

import { LedgerApprovalOverlay } from '@src/pages/SignTransaction/components/LedgerApprovalOverlay';
import { KeystoneApprovalOverlay } from '@src/pages/SignTransaction/components/KeystoneApprovalOverlay';

const getTxInfoForLedger = (
  signingData: SigningData,
  network: NetworkWithCaipId,
) => {
  if (signingData.type === RpcMethod.BITCOIN_SEND_TRANSACTION) {
    return {
      amount: satoshiToBtc(signingData.data.amount).toFixed(8),
      fee: satoshiToBtc(signingData.data.fee).toFixed(8),
      to: signingData.data.to,
      symbol: signingData.data.balance.symbol,
      feeSymbol: network.networkToken.symbol,
    };
  }

  if (signingData.type === RpcMethod.ETH_SEND_TRANSACTION) {
    const { maxFeePerGas, gasPrice, gasLimit } = signingData.data;
    const pricePerGas = maxFeePerGas ?? gasPrice ?? 0;
    const feeBigInt = gasLimit ? BigInt(pricePerGas) * BigInt(gasLimit) : 0;
    const fee = feeBigInt
      ? new TokenUnit(
          feeBigInt,
          network.networkToken.decimals,
          network.networkToken.symbol,
        )
      : undefined;

    return {
      fee: fee?.toString(),
      feeSymbol: network.networkToken.symbol,
      to: signingData.data.to as string,
    };
  }

  return null;
};

export const DeviceApproval = ({
  action,
  network,
  handleRejection,
}: {
  action: Action;
  network?: NetworkWithCaipId;
  handleRejection: () => void;
}) => {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();

  if (!action || !network || !action.signingData) {
    return null;
  }

  if (action.status !== ActionStatus.SUBMITTING) {
    return null;
  }

  if (isUsingLedgerWallet) {
    return (
      <LedgerApprovalOverlay
        {...getTxInfoForLedger(action.signingData, network)}
      />
    );
  }

  if (isUsingKeystoneWallet) {
    return <KeystoneApprovalOverlay onReject={handleRejection} />;
  }

  return null;
};
