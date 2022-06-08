import { Blockchain, useBridgeSDK } from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useEffect } from 'react';

export const useSetBridgeChainFromNetwork = () => {
  const { network } = useNetworkContext();
  const { setCurrentBlockchain } = useBridgeSDK();

  useEffect(() => {
    switch (network?.chainId) {
      case ChainId.BITCOIN:
      case ChainId.BITCOIN_TESTNET:
        setCurrentBlockchain(Blockchain.BITCOIN);
    }
    // Run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
