import { DEFAULT_NETWORK_FORM_FIELDS } from '../../components/NetworkForm/const';
import {
  NetworkFormFieldInfo,
  NetworkFormFields,
} from '../../components/NetworkForm/types';
type dynamicField = {
  error?: string;
  resetAction?: () => void;
};

export type DynamicFields = {
  [key in NetworkFormFields]: dynamicField;
};

export const mergeDynamicFields = (
  dynamicFields: DynamicFields,
): NetworkFormFieldInfo => {
  return {
    rpcUrl: {
      ...DEFAULT_NETWORK_FORM_FIELDS.rpcUrl,
      ...dynamicFields.rpcUrl,
    },
    chainName: {
      ...DEFAULT_NETWORK_FORM_FIELDS.chainName,
      ...dynamicFields.chainName,
    },
    chainId: {
      ...DEFAULT_NETWORK_FORM_FIELDS.chainId,
      ...dynamicFields.chainId,
    },
    tokenSymbol: {
      ...DEFAULT_NETWORK_FORM_FIELDS.tokenSymbol,
      ...dynamicFields.tokenSymbol,
    },
    tokenName: {
      ...DEFAULT_NETWORK_FORM_FIELDS.tokenName,
      ...dynamicFields.tokenName,
    },
    explorerUrl: {
      ...DEFAULT_NETWORK_FORM_FIELDS.explorerUrl,
      ...dynamicFields.explorerUrl,
    },
    logoUrl: {
      ...DEFAULT_NETWORK_FORM_FIELDS.logoUrl,
      ...dynamicFields.logoUrl,
    },
    rpcHeaders: {
      ...DEFAULT_NETWORK_FORM_FIELDS.rpcHeaders,
      ...dynamicFields.rpcHeaders,
    },
  };
};
