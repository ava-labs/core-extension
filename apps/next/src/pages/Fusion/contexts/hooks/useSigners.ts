import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BitcoinCaip2ChainId,
  SolanaCaip2ChainId,
} from '@avalabs/core-chains-sdk';

import { useConnectionContext, useNetworkContext } from '@core/ui';

import { getBtcSigner, getEVMSigner, getSVMSigner } from '../../lib/signers';

export const useSigners = () => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { isDeveloperMode } = useNetworkContext();

  return useMemo(
    () => ({
      evm: getEVMSigner(request, t),
      btc: getBtcSigner(
        request,
        isDeveloperMode
          ? BitcoinCaip2ChainId.TESTNET
          : BitcoinCaip2ChainId.MAINNET,
        t,
      ),
      svm: getSVMSigner(
        request,
        isDeveloperMode
          ? SolanaCaip2ChainId.DEVNET
          : SolanaCaip2ChainId.MAINNET,
        t,
      ),
    }),
    [isDeveloperMode, request, t],
  );
};
