import { useState } from 'react';
import { engine } from '@src/background/rpc/jsonRpcEngine';
import { useEffect } from 'react';
import { hexToNumber } from 'web3-utils';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';
import { EthCall } from '@src/background/models';

export interface GasPrice {
  hex: string;
  bn: BN;
  value: string;
}

/**
 * Get the gas price from the block chain and ping every 30 secs to check for price changes
 * @returns gas price
 */
export function useGetGasPrice() {
  const [gasPrice, setGasPrice] = useState<GasPrice>();
  useEffect(() => {
    function getGasPrice() {
      engine()
        .then((e) =>
          e.handle({
            jsonrpc: '2.0',
            method: 'eth_gasPrice',
            params: [],
            id: 71,
          })
        )
        .then((res: any) => {
          const hex = res.result;
          const bn = new BN(hexToNumber(hex));
          const value = Utils.bnToLocaleString(bn, 9);
          setGasPrice({
            hex,
            bn,
            value,
          });
        });
    }

    getGasPrice();
    const interval = setInterval(() => {
      getGasPrice();
    }, 1000 * 30);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { gasPrice };
}

/**
 * Estimate the gas cost for a transaction. This wont work for transactions that work across contracts. Contracts have
 * fee's and gas estimates themselves. So the dApp should quantify all of that and send it to us. The dApp is also responsible for
 * watching the gas price and resitmating that fee on a regular interval. The current working model is to cancel and rerequest the
 * tx when a change is price is detected.
 *
 * @param ethCall see eth call params
 * @returns the gas estimate for a non contract tx
 */
export function useEstimateGas(ethCall?: EthCall) {
  const [gasEstimate, setGasEstimate] = useState<GasPrice>();

  useEffect(() => {
    if (!ethCall) return;

    function estimateGas() {
      engine()
        .then((e) =>
          e.handle({
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [ethCall],
            id: 72,
          })
        )
        .then((res: any) => {
          const hex = res.result;
          const bn = Utils.numberToBN(hexToNumber(hex), 0);
          const value = Utils.bnToLocaleString(bn, 9);
          setGasEstimate({ hex, bn, value });
        });
    }

    estimateGas();

    const interval = setInterval(() => {
      estimateGas();
    }, 1000 * 30);

    return () => clearInterval(interval);
  }, []);

  return { gasEstimate };
}
