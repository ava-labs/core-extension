import {
  isAPIError,
  useAccountsContext,
  useAnalyticsContext,
  useConnectionContext,
  useContactsContext,
  useFirebaseContext,
  useLiveBalance,
  useNetworkContext,
  useNetworkFeeContext,
  useSwapContext,
  useTokensWithBalances,
} from '@core/ui';
import { isEvmNativeToken, isErc20Token } from '@core/types';
import { useCallback, useMemo, useRef } from 'react';
import { functionDeclarations, systemPromptTemplate } from '../model';
import {
  NetworkVMType,
  RpcMethod,
  TokenType,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';
import {
  chainIdToCaip,
  findMatchingBridgeAsset,
  getExplorerAddressByNetwork,
  getProviderForNetwork,
  isUserRejectionError,
  Monitoring,
  stringToBigint,
  caipToChainId,
} from '@core/common';
import { useTranslation } from 'react-i18next';
import { errorValues } from 'eth-rpc-errors/dist/error-constants';
import { toast } from '@avalabs/k2-alpine';
import browser from 'webextension-polyfill';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { asHex } from '@/pages/Send/components/SendBody/lib/asHex';
import { buildErc20SendTx } from '@/pages/Send/components/SendBody/lib/buildErc20SendTx';
import { getEvmProvider } from '@/lib/getEvmProvider';
import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';

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
  const { swap, getRate } = useSwapContext();
  const { setModel, sendMessage, prompts, setPrompts } = useFirebaseContext();
  const isModelReady = useRef(false);
  const { getTransferableAssets, transferAsset } =
    useNextUnifiedBridgeContext();
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
        if (network && network.vmName !== NetworkVMType.EVM) {
          throw new Error('Only EVM networks supported at the moment');
        }
        const srcToken = tokens.find(
          (item) =>
            item.symbol === fromTokenAddress ||
            ('address' in item && item.address === fromTokenAddress),
        );
        const toToken = allAvailableTokens.find(
          (item) =>
            item.symbol === toTokenAddress ||
            ('address' in item && item.address === toTokenAddress),
        );
        if (
          !srcToken ||
          (srcToken.type !== TokenType.ERC20 &&
            srcToken.type !== TokenType.NATIVE)
        ) {
          throw new Error(`Cannot find the source token`);
        }
        if (
          !toToken ||
          (toToken.type !== TokenType.ERC20 &&
            toToken.type !== TokenType.NATIVE)
        ) {
          throw new Error(`Cannot find the destination token`);
        }

        const amountBigInt = stringToBigint(
          amount.toString(),
          srcToken.decimals,
        );

        const result = await getRate({
          srcDecimals: srcToken.decimals,
          srcToken:
            srcToken.type === TokenType.ERC20
              ? srcToken.address
              : srcToken.symbol,
          destToken:
            toToken.type === TokenType.ERC20 ? toToken.address : toToken.symbol,
          destDecimals: toToken.decimals,
          srcAmount: amountBigInt.toString(),
          slippageTolerance: '0.15',
          onUpdate: () => {},
        });
        if (
          isAPIError(result) ||
          !result ||
          !result.quotes ||
          !result.selected ||
          !result.selected.quote
        ) {
          throw new Error(`An unknown error occurred`);
        }
        const selected = result.selected;
        const amountOut = selected.metadata.amountOut;

        if (!amountOut) {
          throw new Error('No rate found');
        }

        await swap({
          srcToken:
            srcToken.type === TokenType.ERC20
              ? srcToken.address
              : srcToken.symbol,
          destToken:
            toToken.type === TokenType.ERC20 ? toToken.address : toToken.symbol,
          srcDecimals: srcToken.decimals,
          destDecimals: toToken.decimals,
          quote: selected.quote,
          swapProvider: result.provider,
          amountIn: amount.toString(),
          amountOut,
          slippage: 0.15,
        });

        return {
          content: `Swap initiated ${amount}${srcToken.symbol} to ${amountOut}${toToken.symbol}.`,
        };
      },
      bridge: async ({
        amount,
        token,
        sourceNetwork,
        destinationNetwork,
      }: {
        amount: string;
        token: string;
        sourceNetwork: string;
        destinationNetwork: string;
      }) => {
        if (!amount) {
          throw new Error('You have to grant the amount you want to bridge.');
        }
        if (!token) {
          throw new Error('You have to grant the token you want to bridge.');
        }
        const tokenData = tokens.find(
          (item) => item.symbol === token,
        ) as TokenWithBalanceERC20;

        if (!tokenData) {
          throw new Error('You have to grant the token you want to bridge.');
        }
        const newAmount = stringToBigint(amount, tokenData?.decimals);

        const foundAsset = findMatchingBridgeAsset(
          getTransferableAssets(sourceNetwork),
          tokenData,
        );
        if (!foundAsset) {
          throw new Error(`You cannot bridge the token ${token}.`);
        }

        if (!sourceNetwork) {
          throw new Error(
            'You have to grant the source network you want to bridge.',
          );
        }
        if (!destinationNetwork) {
          throw new Error(
            'You have to grant the destination network you want to bridge.',
          );
        }

        // Check if destination is available for this asset
        const destinationCaipId = destinationNetwork;
        const bridgeTypes = foundAsset?.destinations[destinationCaipId] ?? [];
        if (bridgeTypes.length === 0) {
          const availableDestinations = Object.keys(
            foundAsset?.destinations ?? {},
          )
            .map((caipId) => {
              const net = getNetwork(caipToChainId(caipId));
              return net?.chainName || caipId;
            })
            .join(', ');
          throw new Error(
            `Cannot bridge ${foundAsset.symbol} to ${destinationNetwork}. Available destinations: ${availableDestinations || 'none'}.`,
          );
        }

        await transferAsset(
          foundAsset.symbol,
          newAmount,
          sourceNetwork,
          destinationNetwork,
        );

        const destNet = getNetwork(caipToChainId(destinationNetwork));

        return {
          content: `Bridge initiated ${amount} ${foundAsset.symbol} to ${destNet?.chainName || destinationNetwork}`,
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
      tokens,
      allAvailableTokens,
      getRate,
      swap,
      enableNetwork,
      disableNetwork,
      transferAsset,
      getTransferableAssets,
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
        '__BRIDGE_DATA__',
        JSON.stringify(
          network
            ? getTransferableAssets(network.caipId).map((asset) => {
                return {
                  symbol: asset.symbol,
                  name: asset.name,
                };
              })
            : [],
          (_, v) => (typeof v === 'bigint' ? v.toString() : v),
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
    getTransferableAssets,
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
