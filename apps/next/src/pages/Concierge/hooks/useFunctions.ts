import {
  useAccountsContext,
  useAnalyticsContext,
  useConnectionContext,
  useContactsContext,
  useFirebaseContext,
  useLiveBalance,
  useNetworkContext,
  useNetworkFeeContext,
  useTokensWithBalances,
} from '@core/ui';
import {
  isEvmNativeToken,
  isErc20Token,
  FungibleTokenBalance,
} from '@core/types';
import { useCallback, useMemo, useRef } from 'react';
import { functionDeclarations, systemPromptTemplate } from '../model';
import { NetworkVMType, RpcMethod, TokenType } from '@avalabs/vm-module-types';
import {
  caipToChainId,
  chainIdToCaip,
  getAddressForChain,
  getExplorerAddressByNetwork,
  getProviderForNetwork,
  isUserRejectionError,
  Monitoring,
  stringToBigint,
} from '@core/common';
import { useTranslation } from 'react-i18next';
import { errorValues } from 'eth-rpc-errors/dist/error-constants';
import { toast } from '@core/ui';
import browser from 'webextension-polyfill';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { asHex } from '@/pages/Send/components/SendBody/lib/asHex';
import { buildErc20SendTx } from '@/pages/Send/components/SendBody/lib/buildErc20SendTx';
import { getEvmProvider } from '@/lib/getEvmProvider';
import { Quote } from '@avalabs/fusion-sdk';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { useTransferManager } from '@/pages/Fusion/contexts/hooks/useTransferManager';
import { useSupportedChainsMap } from '@/pages/Fusion/contexts/hooks/useSupportedChainIds';
import { useSwapSourceTokenList } from '@/pages/Fusion/contexts/hooks/useSwapSourceTokenList';
import { buildAsset } from '@/pages/Fusion/contexts/hooks/useAssetAndChain/lib/buildAsset';
import { buildChain } from '@/pages/Fusion/contexts/hooks/useAssetAndChain/lib/buildChain';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export const useFunctions = ({ setIsTyping, setInput }) => {
  useLiveBalance(POLLED_BALANCES);
  const { t } = useTranslation();
  const {
    network,
    networks,
    enableNetwork,
    disableNetwork,
    enabledNetworks,
    getNetwork,
  } = useNetworkContext();
  const { contacts, createContact } = useContactsContext();
  const { accounts, selectAccount } = useAccountsContext();
  const { request } = useConnectionContext();
  const { setModel, sendMessage, prompts, setPrompts } = useFirebaseContext();
  const isModelReady = useRef(false);
  const { captureEncrypted } = useAnalyticsContext();
  const tokens = useTokensWithBalances();
  const allAvailableTokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
  });
  const tokensForAccount = useTokensForAccount(accounts.active);
  const { getNetworkFee } = useNetworkFeeContext();
  const { manager } = useTransferManager();
  const supportedChainsMap = useSupportedChainsMap(manager);
  const swapTokenList = useSwapSourceTokenList(supportedChainsMap);

  const userMessages = useMemo(
    () =>
      prompts
        .filter((content) => content.role === 'user')
        .map((contents) => contents.content),
    [prompts],
  );

  const executeTransfer = useCallback(
    async (
      srcToken: FungibleTokenBalance,
      dstToken: FungibleTokenBalance,
      amount: string,
    ) => {
      if (!manager) throw new Error('Swap service not initialized');

      const srcAsset = buildAsset(
        srcToken.assetType,
        srcToken.name,
        srcToken.symbol,
        srcToken.decimals,
        'address' in srcToken ? (srcToken as any).address : undefined,
      );
      const dstAsset = buildAsset(
        dstToken.assetType,
        dstToken.name,
        dstToken.symbol,
        dstToken.decimals,
        'address' in dstToken ? (dstToken as any).address : undefined,
      );
      const srcChain = buildChain(srcToken.coreChainId, getNetwork);
      const dstChain = buildChain(dstToken.coreChainId, getNetwork);

      if (!srcChain)
        throw new Error(`Network not found for ${srcToken.symbol}`);
      if (!dstChain)
        throw new Error(`Network not found for ${dstToken.symbol}`);

      const fromAddress = getAddressForChain(
        getNetwork(srcToken.coreChainId),
        accounts.active ?? undefined,
      );
      const toAddress = getAddressForChain(
        getNetwork(dstToken.coreChainId),
        accounts.active ?? undefined,
      );

      if (!fromAddress) throw new Error('No address for source chain');
      if (!toAddress) throw new Error('No address for destination chain');

      const amountBigInt = stringToBigint(amount, srcToken.decimals);

      const quoter = manager.getQuoter({
        fromAddress,
        toAddress,
        sourceAsset: srcAsset,
        sourceChain: srcChain,
        targetAsset: dstAsset,
        targetChain: dstChain,
        amount: amountBigInt,
      });

      const quote = await new Promise<Quote>((resolve, reject) => {
        const unsubscribe = quoter.subscribe((event, _data) => {
          if (event === 'error') {
            unsubscribe();
            reject(new Error('Failed to get quote'));
          } else if (event === 'done') {
            unsubscribe();
            const [best] = quoter.getQuotes();
            if (best) resolve(best);
            else reject(new Error('No quote available'));
          }
        });
      });

      let networkFee: Awaited<ReturnType<typeof getNetworkFee>> | undefined;
      try {
        networkFee = await getNetworkFee(
          caipToChainId(quote.sourceChain.chainId),
        );
      } catch {
        // proceed without custom gas settings
      }

      const gasSettings = networkFee
        ? {
            maxFeePerGas: networkFee.high.maxFeePerGas,
            maxPriorityFeePerGas: networkFee.high.maxPriorityFeePerGas,
          }
        : undefined;

      await manager.transferAsset({
        quote,
        gasSettings: { estimateGasMarginBps: 0, ...gasSettings },
      });

      return { quote, srcToken, dstToken };
    },
    [manager, getNetwork, accounts.active, getNetworkFee],
  );

  const functions = useMemo(
    () => ({
      send: async ({ recipient, token, amount }) => {
        if (!accounts.active) {
          throw new Error(`You don't have an active account`);
        }
        if (!network) {
          throw new Error(`No network`);
        }
        if (network.vmName !== NetworkVMType.EVM) {
          throw new Error('Only EVM networks supported at the moment');
        }

        const provider = await getProviderForNetwork(network);
        if (!provider) {
          throw new Error(`No network`);
        }

        const tokenToSend = tokensForAccount.find(
          (item) => item.symbol.toLowerCase() === token.toLowerCase(),
        );

        if (!tokenToSend) {
          throw new Error(`Cannot find token`);
        }
        const amountBigInt = stringToBigint(
          amount || '0',
          tokenToSend.decimals,
        );
        const account = accounts.active;

        const isNativeToken = isEvmNativeToken(tokenToSend);

        const isErc20 = isErc20Token(tokenToSend);

        if (isNativeToken) {
          const networkFee = await getNetworkFee(token.coreChainId);

          if (!networkFee) {
            throw new Error('Network fee not found');
          }
          try {
            const hash = await request(
              {
                method: RpcMethod.ETH_SEND_TRANSACTION,
                params: [
                  {
                    from: account.addressC,
                    to: recipient,
                    value: asHex(amountBigInt),
                    chainId: asHex(tokenToSend.coreChainId),
                    maxFeePerGas: asHex(networkFee.high.maxFeePerGas),
                    maxPriorityFeePerGas: asHex(
                      networkFee.high.maxPriorityFeePerGas ?? 1n,
                    ),
                  },
                ],
              },
              {
                scope: chainIdToCaip(tokenToSend.coreChainId),
              },
            );
            return {
              recipient,
              token: tokenToSend,
              amount,
              content: `Transaction successful. Tx hash: ${hash}`,
              link: getExplorerAddressByNetwork(network, hash),
            };
          } catch (e) {
            if (isUserRejectionError(e)) {
              throw new Error('User rejected the transaction');
            }
            throw new Error('Transaction failed');
          }
        }

        if (isErc20) {
          const evmProvider = getEvmProvider(network);
          const networkFee = await getNetworkFee(token.coreChainId);

          if (!networkFee) {
            toast.error(t('Unable to estimate the network fee.'));
            return;
          }
          try {
            const tx = await buildErc20SendTx(
              account.addressC,
              evmProvider,
              networkFee,
              {
                address: recipient,
                amount: amountBigInt,
                token: tokenToSend,
              },
            );

            const hash = await request(
              {
                method: RpcMethod.ETH_SEND_TRANSACTION,
                params: [tx],
              },
              {
                scope: chainIdToCaip(tokenToSend.coreChainId),
              },
            );
            return {
              recipient,
              token: tokenToSend,
              amount,
              content: `Transaction successful. Tx hash: ${hash}`,
              link: getExplorerAddressByNetwork(network, hash),
            };
          } catch (e) {
            if (isUserRejectionError(e)) {
              throw new Error('User rejected the transaction');
            }
            throw new Error('Transaction failed');
          }
        }

        throw new Error('You can only send native tokens or ERC20 tokens');
      },
      switchAccount: async ({ accountId }: { accountId: string }) => {
        await selectAccount(accountId);

        return {
          content: `Success! The new active account is ${accountId}`,
        };
      },
      createContact: async ({
        name,
        address,
        addressBitcoin,
        addressAvalanche,
      }: {
        name: string;
        address: string;
        addressBitcoin?: string;
        addressAvalanche?: string;
      }) => {
        await createContact({
          id: '',
          name,
          address,
          addressBTC: addressBitcoin,
          addressXP: addressAvalanche,
        });

        return {
          content: `Success! New contact added!`,
        };
      },
      goToDapp: async ({ url }) => {
        const openUrl = url.includes('https://') ? url : `https://${url}`;
        chrome.tabs.create({ url: openUrl, active: true }, () =>
          browser.action.openPopup(),
        );
        return {
          content: `${url} opened in a new tab!`,
        };
      },
      buy: async () => {
        chrome.tabs.create({ url: `https://core.app/buy/`, active: true }, () =>
          browser.action.openPopup(),
        );
        return {
          content: `You can buy tokens at https://core.app/buy/ !`,
        };
      },
      swap: async ({
        amount,
        fromTokenAddress,
        toTokenAddress,
      }: {
        amount: number;
        fromTokenAddress: string;
        toTokenAddress: string;
      }) => {
        const bySymbolOrAddress = (id: string) => (tok: FungibleTokenBalance) =>
          tok.symbol.toLowerCase() === id.toLowerCase() ||
          ('address' in tok &&
            (tok as any).address?.toLowerCase() === id.toLowerCase());

        const srcToken = swapTokenList.find(
          bySymbolOrAddress(fromTokenAddress),
        );
        const dstToken = swapTokenList.find(bySymbolOrAddress(toTokenAddress));

        if (!srcToken) throw new Error(`Token not found: ${fromTokenAddress}`);
        if (!dstToken) throw new Error(`Token not found: ${toTokenAddress}`);

        const { quote, dstToken: dst } = await executeTransfer(
          srcToken,
          dstToken,
          amount.toString(),
        );
        const amountOut = bigIntToString(quote.amountOut, dst.decimals);
        return {
          content: `Swap initiated: ${amount} ${srcToken.symbol} for ~${amountOut} ${dst.symbol}.`,
        };
      },
      bridge: async ({
        amount,
        token,
        destinationNetwork,
      }: {
        amount: string;
        token: string;
        destinationNetwork: string;
      }) => {
        const srcToken = swapTokenList.find(
          (tok) => tok.symbol.toLowerCase() === token.toLowerCase(),
        );
        if (!srcToken) throw new Error(`Token not found: ${token}`);

        const dstToken = swapTokenList.find(
          (tok) =>
            tok.chainCaipId === destinationNetwork &&
            tok.symbol.toLowerCase() === token.toLowerCase(),
        );
        if (!dstToken)
          throw new Error(
            `${token} is not bridgeable to ${destinationNetwork}`,
          );

        await executeTransfer(srcToken, dstToken, amount);

        const destNet = getNetwork(caipToChainId(destinationNetwork));
        return {
          content: `Bridge initiated: ${amount} ${srcToken.symbol} to ${destNet?.chainName || destinationNetwork}.`,
        };
      },
      enableNetwork: async ({ chainId }: { chainId: number }) => {
        enableNetwork(chainId);
        return {
          content: `Network with chain ID ${chainId} has been enabled.`,
        };
      },
      disableNetwork: async ({ chainId }: { chainId: number }) => {
        disableNetwork(chainId);
        return {
          content: `Network with chain ID ${chainId} has been disabled.`,
        };
      },
    }),
    [
      getNetwork,
      accounts.active,
      network,
      tokensForAccount,
      getNetworkFee,
      request,
      t,
      selectAccount,
      createContact,
      enableNetwork,
      disableNetwork,
      executeTransfer,
      swapTokenList,
    ],
  );

  const systemPrompt = useMemo(() => {
    if (!network || !tokens || !accounts) {
      return '';
    }
    return systemPromptTemplate
      .replace(
        '__TOKENS__',
        JSON.stringify(
          tokens.map((token) => ({
            name: token.name,
            symbol: token.symbol,
            balance: token.balanceDisplayValue,
          })),
          (_, v) => (typeof v === 'bigint' ? v.toString() : v),
        ),
      )
      .replace(
        '__AVAILABLE_TOKENS__',
        JSON.stringify(
          allAvailableTokens.map((token) => ({
            name: token.name,
            symbol: token.symbol,
            balance: token.balanceDisplayValue,
          })),
          (_, v) => (typeof v === 'bigint' ? v.toString() : v),
        ),
      )
      .replace(
        '__NETWORKS__',
        JSON.stringify(
          networks.map((n) => ({
            id: n.caipId,
            name: n.chainName,
            isTestnet: n.isTestnet,
            vmName: n.vmName,
            chainId: n.chainId,
          })),
        ),
      )
      .replace(
        '__CURRENT_NETWORK_ID__',
        JSON.stringify({
          id: network.caipId,
          name: network.chainName,
          isTestnet: network.isTestnet,
        }),
      )
      .replace('__CONTACTS__', JSON.stringify(contacts))
      .replace(
        '__ACCOUNTS__',
        JSON.stringify(
          [
            ...Object.values(accounts.primary).flat(),
            ...Object.values(accounts.imported),
          ].map((a) => ({
            name: a.name,
            id: a.id,
            address: a.addressC,
            active: a.id === accounts.active?.id,
          })),
        ),
      )
      .replace(
        '__ENABLED_NETWORKS__',
        JSON.stringify(
          enabledNetworks.map((id) => ({
            chainId: id,
          })),
        ),
      );
  }, [
    network,
    tokens,
    accounts,
    allAvailableTokens,
    networks,
    contacts,
    enabledNetworks,
  ]);

  const prompt = useCallback(
    async (message: string) => {
      setIsTyping(true);
      setPrompts((prev) => {
        return [...prev, { role: 'user', content: message }];
      });
      setInput('');

      try {
        if (!isModelReady.current) {
          await setModel({
            tools: [
              {
                functionDeclarations,
              },
            ],
            systemInstruction: systemPrompt,
          })
            .then(() => {
              isModelReady.current = true;
            })
            .catch((e) => {
              if (isModelReady.current) {
                console.error('Failed to update the model configuration');
              }
              throw new Error(e);
            });
        }

        const response = await sendMessage({
          message,
          history: prompts,
          config: {
            tools: [
              {
                functionDeclarations,
              },
            ],
            systemInstruction: systemPrompt,
          },
        });

        // For simplicity, this uses the first function call found.
        const call = response?.functionCalls?.[0];
        if (call) {
          // Call the executable function named in the function call
          // with the arguments specified in the function call and
          // let it call the hypothetical API.
          try {
            captureEncrypted('CoreAssistantFunctionCall', {
              functionName: call.name,
              userMessage: message,
            });
            const apiResponse = await functions[call.name](call.args);
            // Send the API response back to the model so it can generate
            // a text response that can be displayed to the user.
            const functionResult = await sendMessage({
              message,
              parts: [
                { role: 'model', parts: [{ functionCall: { ...call } }] },
                {
                  role: 'function',
                  parts: [
                    {
                      functionResponse: {
                        name: call.name,
                        response: {
                          content: apiResponse.content,
                        },
                      },
                    },
                  ],
                },
              ],
            });
            // Log the text response.
            setPrompts((prev) => {
              return [...prev, { role: 'model', content: functionResult.text }];
            });
          } catch (e: any) {
            const errorMessage =
              'code' in e
                ? errorValues[e.code]?.message || 'Unknown error happened'
                : e.message || e.toString();

            // Send the API response back to the model so it can generate
            // a text response that can be displayed to the user.
            const errorResult = await sendMessage({
              message,
              parts: [
                { role: 'model', parts: [{ functionCall: { ...call } }] },
                {
                  role: 'function',
                  parts: [
                    {
                      functionResponse: {
                        name: call.name,
                        response: {
                          content: `${call.name} failed. ${errorMessage}`,
                        },
                      },
                    },
                  ],
                },
              ],
            });

            // Log the text response.
            setPrompts((prev) => {
              return [...prev, { role: 'model', content: errorResult.text }];
            });
          }
        } else {
          if (!response.text) {
            throw new Error('EMPTY_RESPONSE');
          }
          setPrompts((prev) => {
            return [...prev, { role: 'model', content: response.text }];
          });
        }
      } catch (e: any) {
        Monitoring.sentryCaptureException(
          e as Error,
          Monitoring.SentryExceptionTypes.AI_AGENT,
        );
        captureEncrypted('CoreAssistantFunctionCallError', {
          errorName: e.name,
          errorMessage: e.message,
          userMessage: message,
        });
        if (e.name === 'FirebaseError') {
          setPrompts((prev) => {
            return [
              ...prev,
              {
                role: 'model',
                content:
                  'Whooops... There is something wrong with the service please try again later!',
              },
            ];
          });
        } else if (e.message === 'EMPTY_RESPONSE') {
          setPrompts((prev) => {
            return [
              ...prev,
              {
                role: 'model',
                content:
                  "I'm sorry but I cannot fullfil your request at the moment. You can try again later!",
              },
            ];
          });
        } else {
          setPrompts((prev) => {
            return [
              ...prev,
              {
                role: 'model',
                content:
                  "Whooopsie... We've encountered some issues please try again later!",
              },
            ];
          });
        }
      } finally {
        setIsTyping(false);
      }
    },
    [
      setIsTyping,
      setPrompts,
      setInput,
      sendMessage,
      prompts,
      systemPrompt,
      setModel,
      captureEncrypted,
      functions,
    ],
  );

  return {
    functions,
    userMessages,
    systemPrompt,
    prompt,
  };
};
