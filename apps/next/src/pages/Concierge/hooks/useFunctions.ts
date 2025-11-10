import {
  useAccountsContext,
  useAnalyticsContext,
  useBridge,
  useConnectionContext,
  useContactsContext,
  useFirebaseContext,
  useLiveBalance,
  useNetworkContext,
  useNetworkFeeContext,
  useSwapContext,
  useTokensWithBalances,
} from '@core/ui';
import { useMemo } from 'react';
import { TokenType } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import {
  createSendFunction,
  createSwapFunction,
  createBridgeFunction,
  createSwitchAccountFunction,
  createCreateContactFunction,
  createGoToDappFunction,
  createBuyFunction,
  createEnableNetworkFunction,
  createDisableNetworkFunction,
} from './functions';
import { useSystemPrompt } from './useSystemPrompt';
import { usePrompt } from './usePrompt';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export const useFunctions = ({ setIsTyping, setInput }) => {
  useLiveBalance(POLLED_BALANCES);
  const { t } = useTranslation();
  const { network, networks, enableNetwork, disableNetwork, enabledNetworks } =
    useNetworkContext();
  const { contacts, createContact } = useContactsContext();
  const { accounts, selectAccount } = useAccountsContext();
  const { request } = useConnectionContext();
  const { swap, getRate } = useSwapContext();
  const { setModel, sendMessage, prompts, setPrompts } = useFirebaseContext();
  const { targetChain, transferableAssets, transfer } = useBridge();
  const { captureEncrypted } = useAnalyticsContext();
  const tokens = useTokensWithBalances();
  const allAvailableTokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
  });
  const tokensForAccount = useTokensForAccount(accounts.active);
  const { getNetworkFee } = useNetworkFeeContext();

  const userMessages = useMemo(
    () =>
      prompts
        .filter((content) => content.role === 'user')
        .map((contents) => contents.content),
    [prompts],
  );

  const functions = useMemo(
    () => ({
      send: createSendFunction({
        accounts,
        network,
        tokensForAccount,
        getNetworkFee,
        request,
        t,
      }),
      switchAccount: createSwitchAccountFunction({ selectAccount }),
      createContact: createCreateContactFunction({ createContact }),
      goToDapp: createGoToDappFunction(),
      buy: createBuyFunction(),
      swap: createSwapFunction({
        network,
        tokens,
        allAvailableTokens,
        getRate,
        swap,
      }),
      bridge: createBridgeFunction({
        tokens,
        transferableAssets,
        targetChain,
        transfer,
      }),
      enableNetwork: createEnableNetworkFunction({ enableNetwork }),
      disableNetwork: createDisableNetworkFunction({ disableNetwork }),
    }),
    [
      accounts,
      allAvailableTokens,
      createContact,
      disableNetwork,
      enableNetwork,
      getNetworkFee,
      getRate,
      network,
      request,
      selectAccount,
      swap,
      t,
      targetChain,
      tokens,
      tokensForAccount,
      transfer,
      transferableAssets,
    ],
  );

  const systemPrompt = useSystemPrompt({
    network,
    networks,
    tokens,
    allAvailableTokens,
    accounts,
    contacts,
    transferableAssets,
    enabledNetworks,
  });

  const prompt = usePrompt({
    setIsTyping,
    setInput,
    prompts,
    setPrompts,
    systemPrompt,
    functions,
    setModel,
    sendMessage,
    captureEncrypted,
  });

  return {
    functions,
    userMessages,
    systemPrompt,
    prompt,
  };
};
