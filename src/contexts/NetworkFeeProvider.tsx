import {
  createContext,
  Dispatch,
  SetStateAction,
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
import { FundTxHandler } from '@src/background/services/gasless/handlers/fundTx';
import { GetGaslessEligibilityHandler } from '@src/background/services/gasless/handlers/getGaslessEligibility';
import { FetchGaslessChallengeHandler } from '@src/background/services/gasless/handlers/fetchGaslessChallange';
import { filter, map } from 'rxjs';
import { gaslessChallangeUpdateEventListener } from '@src/background/services/gasless/events/gaslessChallangeUpdateListener';
import { TransactionRequest } from 'ethers';

const NetworkFeeContext = createContext<{
  networkFee: NetworkFee | null;
  getNetworkFee: (caipId: string) => Promise<NetworkFee | null>;
  fetchGaslessChallange: () => Promise<any | null>;
  gaslessFundTx: ({
    data,
    addressFrom,
  }: {
    data: TransactionRequest;
    addressFrom: string;
  }) => Promise<string | undefined>;
  getGaslessEligibility: (chainId?: string | number) => Promise<any | null>;
  challengeHex: string;
  solutionHex: string;
  isGaslessOn: boolean;
  setIsGaslessOn: Dispatch<SetStateAction<boolean>>;
  isGaslessEligible: boolean;
  setIsGaslessEligible: Dispatch<SetStateAction<boolean>>;
}>({
  networkFee: null,
  async getNetworkFee() {
    return null;
  },
  async fetchGaslessChallange() {
    return null;
  },

  async gaslessFundTx() {
    return undefined;
  },
  async getGaslessEligibility() {
    return null;
  },
  challengeHex: '',
  solutionHex: '',
  isGaslessOn: false,
  setIsGaslessOn() {
    return null;
  },
  isGaslessEligible: false,
  setIsGaslessEligible() {
    return null;
  },
});

export function NetworkFeeContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { network } = useNetworkContext();
  const [fee, setFee] = useState<NetworkFee | null>(null);
  const [iteration, setIteration] = useState(0);
  const [challengeHex, setChallengeHex] = useState('');
  const [solutionHex, setSolutionHex] = useState('');
  const [isGaslessOn, setIsGaslessOn] = useState(false);
  const [isGaslessEligible, setIsGaslessEligible] = useState(false);
  // TODO: implement retrying
  // const [countGaslessTries, setCountGaslessTries] = useState(0);

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

  const fetchGaslessChallange = useCallback(
    async () =>
      request<FetchGaslessChallengeHandler>({
        method: ExtensionRequest.GASLESS_FETCH_CHALLENGE,
        params: [],
      }),
    [request],
  );

  const gaslessFundTx = useCallback(
    async ({ data, fromAddress }) =>
      request<FundTxHandler>({
        method: ExtensionRequest.GASLESS_FUND_TX,
        params: [data, challengeHex, solutionHex, fromAddress],
      }),
    [challengeHex, request, solutionHex],
  );

  const getGaslessEligibility = useCallback(
    async (chainId) =>
      request<GetGaslessEligibilityHandler>({
        method: ExtensionRequest.GASLESS_GET_ELIGIBILITY,
        params: [chainId],
      }),
    [request],
  );

  useEffect(() => {
    const gaslessEventSubscription = events()
      .pipe(
        filter(gaslessChallangeUpdateEventListener),
        map((evt) => evt.value),
      )
      .subscribe(async (values) => {
        if (values.solutionHex) {
          setSolutionHex(values.solutionHex);
        }
        if (values.challengeHex) {
          setChallengeHex(values.challengeHex);
        }
      });

    return () => {
      gaslessEventSubscription.unsubscribe();
    };
  }, [events, getNetworkFee]);

  return (
    <NetworkFeeContext.Provider
      value={{
        networkFee: fee,
        getNetworkFee,
        fetchGaslessChallange,
        gaslessFundTx,
        getGaslessEligibility,
        challengeHex,
        solutionHex,
        isGaslessOn,
        setIsGaslessOn,
        isGaslessEligible,
        setIsGaslessEligible,
      }}
    >
      {children}
    </NetworkFeeContext.Provider>
  );
}

export function useNetworkFeeContext() {
  return useContext(NetworkFeeContext);
}
