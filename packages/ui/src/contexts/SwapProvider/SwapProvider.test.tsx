import { act } from 'react-dom/test-utils';
import { ChainId } from '@avalabs/core-chains-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { createRef, forwardRef, useImperativeHandle } from 'react';

import { render } from '@shared/tests/test-utils';
import { SecretType } from '@core/types';
import { useTokensWithBalances } from '../../hooks/useTokensWithBalances';

import { useWalletContext } from '../WalletProvider';
import { useNetworkContext } from '../NetworkProvider';
import { useAccountsContext } from '../AccountsProvider';
import { useAnalyticsContext } from '../AnalyticsProvider';

import {
  isJupiterSwapParams,
  isParaswapSwapParams,
  SwapContextAPI,
} from './models';
import { useEvmSwap } from './useEvmSwap';
import { useSolanaSwap } from './useSolanaSwap';
import { SwapContextProvider, useSwapContext } from './SwapProvider';
import { noop } from '@core/common';

const getSwapProvider = async (): Promise<SwapContextAPI> => {
  const ref = createRef<SwapContextAPI>();

  await act(async () => {
    render(
      <SwapContextProvider>
        <TestConsumerComponent ref={ref} />
      </SwapContextProvider>,
    );
  });

  return ref.current ?? ({} as SwapContextAPI);
};

const TestConsumerComponent = forwardRef((_props: unknown, ref) => {
  const { getRate, swap } = useSwapContext();

  useImperativeHandle(ref, () => ({
    getRate,
    swap,
  }));

  return <></>;
});
TestConsumerComponent.displayName = 'TestComponent';

jest.mock('../AnalyticsProvider', () => ({
  useAnalyticsContext: jest.fn(),
}));

jest.mock('../NetworkProvider', () => ({
  useNetworkContext: jest.fn(),
}));

jest.mock('../AccountsProvider', () => ({
  useAccountsContext: jest.fn(),
}));

jest.mock('../WalletProvider', () => ({
  useWalletContext: jest.fn(),
}));

jest.mock('../../hooks/useTokensWithBalances', () => ({
  useTokensWithBalances: jest.fn(),
}));

jest.mock('./models', () => ({
  ...jest.requireActual('./models'),
  isParaswapSwapParams: jest.fn(),
  isJupiterSwapParams: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
  }),
}));

jest.mock('./useEvmSwap', () => ({
  useEvmSwap: jest.fn(),
}));
jest.mock('./useSolanaSwap', () => ({
  useSolanaSwap: jest.fn(),
}));

const accountsContext = {
  accounts: {
    active: {
      addressC: '0x12341234',
      addressSVM: 'bcdagdlfatkl',
    },
  },
} as any;

const networkContextAVA = {
  network: {
    chainId: ChainId.AVALANCHE_MAINNET_ID,
    isTestnet: false,
    networkToken: {
      symbol: 'AVAX',
    },
  },
} as any;

describe('contexts/SwapProvider', () => {
  const evmGetRate = jest.fn();
  const evmSwap = jest.fn();
  const solanaGetRate = jest.fn();
  const solanaSwap = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
    jest.spyOn(console, 'error').mockImplementation(noop);
    jest.mocked(useAnalyticsContext).mockReturnValue({
      captureEncrypted: jest.fn(),
    } as any);
    jest.mocked(useAccountsContext).mockReturnValue(accountsContext);
    jest.mocked(useNetworkContext).mockReturnValue(networkContextAVA);
    jest.mocked(useTokensWithBalances).mockReturnValue([]);

    jest.mocked(useWalletContext).mockReturnValue({
      walletDetails: {
        type: SecretType.Mnemonic,
      },
    } as any);

    jest.mocked(useEvmSwap).mockReturnValue({
      getRate: evmGetRate,
      swap: evmSwap,
    });

    jest.mocked(useSolanaSwap).mockReturnValue({
      getRate: solanaGetRate,
      swap: solanaSwap,
    });
  });

  describe('when an EVM network is active', () => {
    beforeEach(() => {
      jest.mocked(useNetworkContext).mockReturnValue({
        network: {
          vmName: NetworkVMType.EVM,
        },
      } as any);
    });

    it('should use the EVM swap adapter for getting the quote', async () => {
      const { getRate } = await getSwapProvider();

      const params = {} as any;

      getRate(params);

      expect(evmGetRate).toHaveBeenCalledWith(params);
      expect(solanaGetRate).not.toHaveBeenCalled();
    });

    it('should use the EVM swap adapter for swapping', async () => {
      jest.mocked(isParaswapSwapParams).mockReturnValueOnce(true);

      const { swap } = await getSwapProvider();
      const params = {} as any;

      swap(params);

      expect(evmSwap).toHaveBeenCalledWith(params);
      expect(solanaSwap).not.toHaveBeenCalled();
    });
  });

  describe('when Solana is the active network', () => {
    beforeEach(() => {
      jest.mocked(useNetworkContext).mockReturnValue({
        network: {
          vmName: NetworkVMType.SVM,
          chainId: ChainId.SOLANA_MAINNET_ID,
        },
      } as any);
    });

    it('should use the Solana swap adapter for getting the quote', async () => {
      const { getRate } = await getSwapProvider();

      const params = {} as any;

      getRate(params);

      expect(evmGetRate).not.toHaveBeenCalled();
      expect(solanaGetRate).toHaveBeenCalledWith(params);
    });

    it('should use the Solana swap adapter for swapping', async () => {
      jest.mocked(isJupiterSwapParams).mockReturnValueOnce(true);

      const { swap } = await getSwapProvider();
      const params = {} as any;

      swap(params);

      expect(evmSwap).not.toHaveBeenCalled();
      expect(solanaSwap).toHaveBeenCalledWith(params);
    });
  });
});
