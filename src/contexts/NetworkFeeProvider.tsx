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
import { FetchAndSolveChallengeHandler } from '@src/background/services/gasless/handlers/fetchAndSolveChallenge';
import { filter, map } from 'rxjs';
import { gaslessChallangeUpdateEventListener } from '@src/background/services/gasless/events/gaslessChallangeUpdateListener';
import { AddressLike } from 'ethers';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { SetDefaultStateValuesHandler } from '@src/background/services/gasless/handlers/setDefaultStateValues';
import { GaslessPhase } from '@src/background/services/gasless/model';
import { RpcMethod, SigningData } from '@avalabs/vm-module-types';

const NetworkFeeContext = createContext<{
  networkFee: NetworkFee | null;
  getNetworkFee: (caipId: string) => Promise<NetworkFee | null>;
  fetchAndSolveGaslessChallange: () => Promise<any | null>;
  gaslessFundTx: (signingData?: SigningData) => Promise<string | undefined>;
  isGaslessOn: boolean;
  setIsGaslessOn: Dispatch<SetStateAction<boolean>>;
  fundTxHex: string;
  setGaslessDefaultValues: () => Promise<any | null>;
  gaslessPhase: GaslessPhase;
  setGaslessEligibility: (
    chainId: string | number,
    fromAddress?: AddressLike | null,
    nonce?: number | null,
  ) => Promise<void>;
}>({
  networkFee: null,
  async getNetworkFee() {
    return null;
  },
  async fetchAndSolveGaslessChallange() {
    return null;
  },

  async gaslessFundTx() {
    return undefined;
  },
  isGaslessOn: false,
  setIsGaslessOn() {
    return null;
  },

  fundTxHex: '',

  async setGaslessDefaultValues() {
    return null;
  },

  gaslessPhase: GaslessPhase.NOT_READY,
  async setGaslessEligibility() {
    return;
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
  const [fundTxHex, setFundTxHex] = useState('');
  const { featureFlags } = useFeatureFlagContext();
  const [gaslessPhase, setGaslessPhase] = useState<GaslessPhase>(
    GaslessPhase.NOT_READY,
  );

  const getNetworkFee = useCallback(
    async (caipId: string) =>
      request<GetNetworkFeeHandler>({
        method: ExtensionRequest.NETWORK_FEE_GET,
        params: [caipId],
      }),
    [request],
  );

  const setGaslessEligibility = useCallback(
    async (
      chainId: string | number,
      fromAddress?: AddressLike | null,
      nonce?: number | null,
    ) => {
      if (!featureFlags[FeatureGates.GASLESS]) {
        setGaslessPhase(GaslessPhase.NOT_ELIGIBLE);
        return;
      }
      try {
        const result = await request<GetGaslessEligibilityHandler>({
          method: ExtensionRequest.GASLESS_GET_ELIGIBILITY,
          params: [chainId, fromAddress?.toString(), nonce ?? undefined],
        });
        if (!result) {
          setGaslessPhase(GaslessPhase.NOT_ELIGIBLE);
        }
      } catch (e: any) {
        console.error(e);
        setGaslessPhase(GaslessPhase.NOT_ELIGIBLE);
      }
    },

    [featureFlags, request],
  );

  useEffect(() => {
    if (!network?.chainId) {
      return;
    }

    setGaslessEligibility(network.chainId);

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
  }, [getNetworkFee, iteration, network?.chainId, setGaslessEligibility]);

  const fetchAndSolveGaslessChallange = useCallback(
    async () =>
      request<FetchAndSolveChallengeHandler>({
        method: ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE,
      }),
    [request],
  );

  const gaslessFundTx = useCallback(
    async (signingData?: SigningData) => {
      if (!signingData || signingData.type !== RpcMethod.ETH_SEND_TRANSACTION) {
        setIsGaslessOn(false);
        setGaslessPhase(GaslessPhase.ERROR);
        return undefined;
      }
      setGaslessPhase(GaslessPhase.FUNDING_IN_PROGRESS);
      return request<FundTxHandler>({
        method: ExtensionRequest.GASLESS_FUND_TX,
        params: [
          signingData.data,
          challengeHex,
          solutionHex,
          signingData.account,
        ],
      });
    },
    [challengeHex, request, solutionHex],
  );

  const setGaslessDefaultValues = useCallback(async () => {
    setGaslessPhase(GaslessPhase.NOT_READY);
    return request<SetDefaultStateValuesHandler>({
      method: ExtensionRequest.GASLESS_SET_DEFAUlT_STATE_VALUES,
    });
  }, [request]);

  useEffect(() => {
    const gaslessEventSubscription = events()
      .pipe(
        filter(gaslessChallangeUpdateEventListener),
        map((evt) => evt.value),
      )
      .subscribe(async (values) => {
        setSolutionHex(values.solutionHex);
        setChallengeHex(values.challengeHex);
        setFundTxHex(values.fundTxHex);
        if (
          values.challengeHex &&
          values.solutionHex &&
          !values.isFundInProgress &&
          !values.fundTxDoNotRetryError
        ) {
          setGaslessPhase(GaslessPhase.READY);
        }

        if (values.isFundInProgress === true) {
          setGaslessPhase(GaslessPhase.FUNDING_IN_PROGRESS);
        }
        if (values.fundTxHex) {
          setGaslessPhase(GaslessPhase.FUNDED);
        }
        if (values.fundTxDoNotRetryError) {
          setIsGaslessOn(false);
          setGaslessPhase(GaslessPhase.ERROR);
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
        fetchAndSolveGaslessChallange,
        gaslessFundTx,
        setGaslessEligibility,
        isGaslessOn,
        setIsGaslessOn,
        fundTxHex,
        setGaslessDefaultValues,
        gaslessPhase,
      }}
    >
      {children}
    </NetworkFeeContext.Provider>
  );
}

export function useNetworkFeeContext() {
  return useContext(NetworkFeeContext);
}
