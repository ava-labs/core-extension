import { TransferStepDetails } from '@avalabs/unified-asset-transfer';

export const buildRequestContext = ({
  requiredSignatures,
  currentSignature,
  currentSignatureReason,
  quote,
}: TransferStepDetails) => {
  const isCrossChainSwap =
    quote.sourceChain.chainId !== quote.targetChain.chainId;
  const isIntermediateTransaction = currentSignature < requiredSignatures;

  return {
    surpressSuccessToast: isCrossChainSwap || isIntermediateTransaction,
    actionStep: {
      currentSignature,
      requiredSignatures,
      currentSignatureReason,
    },
  };
};
