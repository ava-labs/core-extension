import { ContractCall } from '@src/contracts/contractParsers/models';
import { useTranslation } from 'react-i18next';

export const useSignTransactionHeader = (contractType?: ContractCall) => {
  const { t } = useTranslation();

  switch (contractType) {
    case ContractCall.ADD_LIQUIDITY:
    case ContractCall.ADD_LIQUIDITY_AVAX:
      return t('Pool Approval');

    case ContractCall.APPROVE:
      return t('Token Spend Approval');

    case ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS:
      return t('Swap Approval');

    default:
      return t('Transaction Approval');
  }
};
