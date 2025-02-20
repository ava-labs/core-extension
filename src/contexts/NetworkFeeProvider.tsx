import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { NetworkFee } from '@src/background/services/networkFee/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetNetworkFeeHandler } from '@src/background/services/networkFee/handlers/getNetworkFee';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { chainIdToCaip } from '@src/utils/caipConversion';

import { useNetworkContext } from './NetworkProvider';
import { GetGaslessChallengeHandler } from '@src/background/services/gasless/handlers/getGaslessChallenge';
import { SolveGaslessChallengeHandler } from '@src/background/services/gasless/handlers/solveGaslessChallange';
import { FundTxHandler } from '@src/background/services/gasless/handlers/fundTx';

const NetworkFeeContext = createContext<{
  networkFee: NetworkFee | null;
  getNetworkFee: (caipId: string) => Promise<NetworkFee | null>;
  getGaslessChallange: () => Promise<any | null>;
  solveGaslessChallange: () => Promise<any | null>;
  gaslessFundTx: () => Promise<any | null>;
}>({
  networkFee: null,
  async getNetworkFee() {
    return null;
  },
  async getGaslessChallange() {
    return null;
  },
  async solveGaslessChallange() {
    return null;
  },
  async gaslessFundTx() {
    return null;
  },
});

export function NetworkFeeContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();
  const { network } = useNetworkContext();
  const [fee, setFee] = useState<NetworkFee | null>(null);
  const [iteration, setIteration] = useState(0);

  const getNetworkFee = useCallback(
    async (caipId: string) =>
      request<GetNetworkFeeHandler>({
        method: ExtensionRequest.NETWORK_FEE_GET,
        params: [caipId],
      }),
    [request],
  );

  useEffect(() => {
    if (!network?.chainId) {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    let isMounted = true;

    getNetworkFee(chainIdToCaip(network.chainId))
      .then((networkFee) => {
        if (isMounted && networkFee) {
          setFee(networkFee);
        }
      })
      .catch((err) => {
        console.warn('Failed to determine the network fee:', err);
      })
      .finally(() => {
        timer = setTimeout(() => setIteration((i) => i + 1), 30_000);
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [getNetworkFee, iteration, network?.chainId]);

  const getGaslessChallange = useCallback(
    async () =>
      request<GetGaslessChallengeHandler>({
        method: ExtensionRequest.GASLESS_GET_CHALLENGE,
        params: [],
      }),
    [request],
  );

  const solveGaslessChallange = useCallback(
    async () =>
      request<SolveGaslessChallengeHandler>({
        method: ExtensionRequest.GASLESS_SOLVE_CHALLENGE,
        params: [],
      }),
    [request],
  );

  const gaslessFundTx = useCallback(
    async () =>
      request<FundTxHandler>({
        method: ExtensionRequest.GASLESS_FUND_TX,
        params: [
          {
            txParam1: 'txParam1-asd',
          },
          'challangedId',
          'result',
        ],
      }),
    [request],
  );

  return (
    <NetworkFeeContext.Provider
      value={{
        networkFee: fee,
        getNetworkFee,
        getGaslessChallange,
        solveGaslessChallange,
        gaslessFundTx,
      }}
    >
      {children}
    </NetworkFeeContext.Provider>
  );
}

export function useNetworkFeeContext() {
  return useContext(NetworkFeeContext);
}
