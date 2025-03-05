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
import { FetchAndSolveChallengeHandler } from '@src/background/services/gasless/handlers/fetchAndSolveChallange';
import { filter, map } from 'rxjs';
import { gaslessChallangeUpdateEventListener } from '@src/background/services/gasless/events/gaslessChallangeUpdateListener';
import { TransactionRequest } from 'ethers';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { SetDefaultStateValuesHandler } from '@src/background/services/gasless/handlers/setDefaultStateValues';
import { InitGaslessOffscreenHandler } from '@src/background/services/gasless/handlers/initOffscreen';
import { CloseGaslessOffscreenHandler } from '@src/background/services/gasless/handlers/closeOffscreen';

const NetworkFeeContext = createContext<{
  networkFee: NetworkFee | null;
  getNetworkFee: (caipId: string) => Promise<NetworkFee | null>;
  fetchGaslessChallange: () => Promise<any | null>;
  gaslessFundTx: ({
    data,
    fromAddress,
  }: {
    data: TransactionRequest;
    fromAddress: string;
  }) => Promise<string | undefined>;
  getGaslessEligibility: (
    chainId?: string | number,
    fromAddress?: string,
    nonce?: number,
  ) => Promise<any | null>;
  challengeHex: string;
  solutionHex: string;
  isGaslessOn: boolean;
  setIsGaslessOn: Dispatch<SetStateAction<boolean>>;
  isGaslessEligible: boolean | null;
  setIsGaslessEligible: Dispatch<SetStateAction<boolean | null>>;
  isFundProcessReady: boolean;
  fundTxHex: string;
  fundTxDoNotRertyError: boolean;
  setGaslessDefaultValues: () => Promise<any | null>;
  createGaslessOffscreen: () => Promise<true>;
  closeGaslessOffscreen: () => Promise<true>;
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
  isGaslessEligible: null,
  setIsGaslessEligible() {
    return null;
  },
  isFundProcessReady: false,
  fundTxHex: '',
  fundTxDoNotRertyError: false,
  async setGaslessDefaultValues() {
    return null;
  },
  async createGaslessOffscreen() {
    return true;
  },
  async closeGaslessOffscreen() {
    return true;
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
  const [isGaslessEligible, setIsGaslessEligible] = useState<boolean | null>(
    null,
  );
  const [isFundProcessReady, setIsFundProcessReady] = useState(false);
  const [fundTxHex, setFundTxHex] = useState('');
  const [fundTxDoNotRertyError, setFundTxDoNotRertyError] = useState(false);
  const { featureFlags } = useFeatureFlagContext();

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
      request<FetchAndSolveChallengeHandler>({
        method: ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE,
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

  const setGaslessDefaultValues = useCallback(
    async () =>
      request<SetDefaultStateValuesHandler>({
        method: ExtensionRequest.GASLESS_SET_DEFAUlT_STATE_VALUES,
      }),
    [request],
  );

  const createGaslessOffscreen = useCallback(
    async () =>
      request<InitGaslessOffscreenHandler>({
        method: ExtensionRequest.GASLESS_CREATE_OFFSCREEN,
      }),
    [request],
  );

  const closeGaslessOffscreen = useCallback(
    async () =>
      request<CloseGaslessOffscreenHandler>({
        method: ExtensionRequest.GASLESS_CLOSE_OFFSCREEN,
      }),
    [request],
  );

  const getGaslessEligibility = useCallback(
    async (chainId, fromAddress, nonce) => {
      if (!featureFlags[FeatureGates.GASLESS] || fundTxDoNotRertyError) {
        return false;
      }
      return request<GetGaslessEligibilityHandler>({
        method: ExtensionRequest.GASLESS_GET_ELIGIBILITY,
        params: [chainId, fromAddress, nonce],
      });
    },

    [featureFlags, fundTxDoNotRertyError, request],
  );

  useEffect(() => {
    const gaslessEventSubscription = events()
      .pipe(
        filter(gaslessChallangeUpdateEventListener),
        map((evt) => evt.value),
      )
      .subscribe(async (values) => {
        if (values.solutionHex || values.solutionHex === '') {
          setSolutionHex(values.solutionHex);
        }
        if (values.challengeHex || values.challengeHex === '') {
          setChallengeHex(values.challengeHex);
        }
        if (values.isFundProcessReady || values.isFundProcessReady === false) {
          setIsFundProcessReady(values.isFundProcessReady);
        }
        if (values.fundTxHex || values.fundTxHex === '') {
          setFundTxHex(values.fundTxHex);
        }
        if (
          values.fundTxDoNotRertyError ||
          values.fundTxDoNotRertyError === false
        ) {
          setFundTxDoNotRertyError(values.fundTxDoNotRertyError);
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
        isFundProcessReady,
        fundTxHex,
        fundTxDoNotRertyError,
        setGaslessDefaultValues,
        createGaslessOffscreen,
        closeGaslessOffscreen,
      }}
    >
      {children}
    </NetworkFeeContext.Provider>
  );
}

export function useNetworkFeeContext() {
  return useContext(NetworkFeeContext);
}
