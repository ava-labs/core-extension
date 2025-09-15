import {
  isAPIError,
  useAccountsContext,
  useAnalyticsContext,
  useBridge,
  useConnectionContext,
  useContactsContext,
  useFirebaseContext,
  useLiveBalance,
  useNetworkContext,
  useSwapContext,
  useTokensWithBalances,
} from '@core/ui';
import {
  isAvmCapableAccount,
  isBtcCapableAccount,
  isBtcToken,
  isEvmNativeToken,
  isPvmCapableAccount,
  isSolanaNativeToken,
  isSolanaSplToken,
  isSvmCapableAccount,
  isErc20Token,
} from '@core/types';
import { useCallback, useMemo, useRef } from 'react';
import { functionDeclarations, systemPromptTemplate } from '../model';
import {
  NetworkVMType,
  RpcMethod,
  TokenType,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';
import {
  findMatchingBridgeAsset,
  getProviderForNetwork,
  Monitoring,
  stringToBigint,
} from '@core/common';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { useTranslation } from 'react-i18next';
import { errorValues } from 'eth-rpc-errors/dist/error-constants';
import { toast } from '@avalabs/k2-alpine';
import browser from 'webextension-polyfill';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { useEvmNativeSend } from '@/pages/Send/components/SendBody/hooks';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export const useFunctions = ({ setIsTyping, setInput }) => {
  useLiveBalance(POLLED_BALANCES);
  const { t } = useTranslation();
  // const [input, setInput] = useState<string>('');
  const { network, networks, setNetwork, getNetwork } = useNetworkContext();
  const { contacts, createContact } = useContactsContext();
  const { accounts, selectAccount } = useAccountsContext();
  const { request } = useConnectionContext();
  const { swap, getRate } = useSwapContext();
  // const [isTyping, setIsTyping] = useState(false);
  const { setModel, sendMessage, prompts, setPrompts } = useFirebaseContext();
  console.log('prompts: ', prompts);
  const isModelReady = useRef(false);
  const { targetChain, transferableAssets, transfer } = useBridge();
  const { captureEncrypted } = useAnalyticsContext();
  const tokens = useTokensWithBalances();
  console.log('tokens: ', tokens);
  const allAvailableTokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
  });
  const tokensForAccount = useTokensForAccount(accounts.active);
  console.log('tokensForAccount: ', tokensForAccount);

  const { isSending, isValid, error, send } = useEvmNativeSend({
    token,
    amount: amountBigInt,
    from,
    to,
    network,
  });

  const { isSending, isValid, error, send } = useEvmErc20Send({
    token,
    amount: amountBigInt,
    from,
    to,
    network,
  });

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
          (item) => item.symbol === token,
        );
        if (!tokenToSend) {
          throw new Error(`Cannot find token`);
        }
        console.log('tokenToSend: ', tokenToSend);
        const account = accounts.active;
        console.log('account: ', account);
        const isNativeToken = isEvmNativeToken(tokenToSend);
        console.log('isNativeToken: ', isNativeToken);
        const isErc20 = isErc20Token(tokenToSend);
        console.log('isErc20: ', isErc20);
        // const isBTCToken = isBtcToken(token) && isBtcCapableAccount(account);
        // const isXChain = isXChainToken(token) && isAvmCapableAccount(account);
        // const isPChain = isPChainToken(token) && isPvmCapableAccount(account);
        // const isSolanaToken =
        //   (isSolanaNativeToken(token) || isSolanaSplToken(token)) &&
        //   isSvmCapableAccount(account);
        return {
          account,
          isNativeToken,
          isErc20,
        };

        const tx = await buildTx(
          accounts.active.addressC,
          provider as JsonRpcBatchInternal,
          {
            amount: amount.toString(),
            address: recipient,
            token: tokenToSend,
          },
        );

        const hash = await request({
          method: RpcMethod.ETH_SEND_TRANSACTION,
          params: [
            {
              ...tx,
              chainId: network.chainId,
            },
          ],
        });
        // toastCardWithLink({
        //   title: t('Send Successful'),
        //   url: getExplorerAddressByNetwork(network, hash),
        //   label: t('View in Explorer'),
        // });

        // TODO: fix the toast
        toast.success(t('Transaction sent successfully'));
        return {
          recipient,
          token,
          amount,
          content: `Transaction successful. Tx hash: ${hash}`,
        };
      },
      switchAccount: async ({ accountId }: { accountId: string }) => {
        await selectAccount(accountId);

        return {
          content: `Success! The new active account is ${accountId}`,
        };
      },
      switchNetwork: async ({ networkId }: { networkId: string }) => {
        const newActiveNetwork = getNetwork(networkId);
        if (!newActiveNetwork) {
          throw new Error(`Cannot find the new network you want to activate.`);
        }
        setNetwork(newActiveNetwork);
        return {
          content: `Success! The new active network is ${newActiveNetwork.chainName}`,
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
          transferableAssets,
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
        const [bridgeType] =
          foundAsset?.destinations[targetChain?.caipId ?? ''] ?? [];
        await transfer(
          {
            bridgeType,
            gasSettings: undefined,
          },
          newAmount,
          destinationNetwork,
          foundAsset,
        );
        return {
          content: `Bridge initiated ${amount}${foundAsset.symbol} to ${destinationNetwork}.`,
        };
      },
    }),
    [
      accounts.active,
      allAvailableTokens,
      createContact,
      getNetwork,
      getRate,
      network,
      request,
      selectAccount,
      setNetwork,
      swap,
      t,
      targetChain?.caipId,
      tokens,
      transfer,
      transferableAssets,
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
          transferableAssets.map((token) => ({
            name: token.name,
            symbol: token.symbol,
          })),
          (_, v) => (typeof v === 'bigint' ? v.toString() : v),
        ),
      );
  }, [
    network,
    tokens,
    accounts,
    allAvailableTokens,
    networks,
    contacts,
    transferableAssets,
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
                        name: 'send',
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
                ? errorValues[e.code]?.message || 'Unkown error happened'
                : e.toString();

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
                        name: 'send',
                        response: {
                          content: `Send failed. ${errorMessage}`,
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
