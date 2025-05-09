import { isAPIError, useAccountsContext, useBridge } from '@core/ui';
import { useConnectionContext } from '@core/ui';
import { useContactsContext } from '@core/ui';
import { useFirebaseContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { useSwapContext } from '@core/ui';
import { useTokensWithBalances } from '@core/ui';
import { buildTx } from '@/pages/Send/utils/buildSendTx';
import {
  Backdrop,
  Button,
  Grow,
  Scrollbars,
  ScrollbarsRef,
  Stack,
  Typography,
  useTheme,
  XIcon,
} from '@avalabs/core-k2-components';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import {
  RpcMethod,
  TokenType,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';
import {
  getExplorerAddressByNetwork,
  getProviderForNetwork,
  stringToBigint,
  Monitoring,
  findMatchingBridgeAsset,
} from '@core/common';
import { errorValues } from 'eth-rpc-errors/dist/error-constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PromptBackground, PromptButton } from './GradientElements';
import { functionDeclarations, systemPromptTemplate } from './models';
import {
  AIDialog,
  TypingAvatar,
  UserDialog,
  UserInput,
} from './PromptElements';
import { useAnalyticsContext } from '@core/ui';
import { toastCardWithLink } from '@/components/common/toastCardWithLink';
import browser from 'webextension-polyfill';

export function Prompt() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [input, setInput] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { network, networks, setNetwork, getNetwork } = useNetworkContext();
  const { contacts, createContact } = useContactsContext();
  const { accounts, selectAccount } = useAccountsContext();
  const { request } = useConnectionContext();
  const { swap, getRate } = useSwapContext();
  const [isTyping, setIsTyping] = useState(false);
  const scrollbarRef = useRef<ScrollbarsRef | null>(null);
  const { setModel, sendMessage, prompts, setPrompts } = useFirebaseContext();
  const isModelReady = useRef(false);
  const { targetChain, transferableAssets, transfer } = useBridge();
  const { captureEncrypted } = useAnalyticsContext();

  const tokens = useTokensWithBalances();
  const allAvailableTokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
  });

  const userMessages = useMemo(
    () =>
      prompts
        .filter((content) => content.role === 'user')
        .map((contents) => contents.content),
    [prompts],
  );

  const scrollToBottom = useCallback(() => {
    if (prompts) {
      scrollbarRef?.current?.scrollToBottom();
    }
  }, [prompts]);
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const functions = useMemo(
    () => ({
      send: async ({ recipient, token, amount }) => {
        if (!accounts.active) {
          throw new Error(`You don't have an active account`);
        }
        if (!network) {
          throw new Error(`No network`);
        }
        const provider = await getProviderForNetwork(network);
        if (!provider) {
          throw new Error(`No network`);
        }

        const tokenToSend = tokens.find(
          (item) => item.symbol === token,
        ) as TokenWithBalanceERC20;
        if (!tokenToSend) {
          throw new Error(`Cannot find token`);
        }

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
        toastCardWithLink({
          title: t('Send Successful'),
          url: getExplorerAddressByNetwork(network, hash),
          label: t('View in Explorer'),
        });
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
        });
        if (
          isAPIError(result) ||
          !result ||
          !result.destAmount ||
          !result.quote
        ) {
          throw new Error(
            `Error while getting swap rate. ${isAPIError(result) ? result.error?.message : ''}`,
          );
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
          quote: result.quote,

          slippage: 0.15,
        });

        return {
          content: `Swap initiated ${amount}${srcToken.symbol} to ${result.destAmount}${toToken.symbol}.`,
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
      setPrompts,
      setModel,
      systemPrompt,
      sendMessage,
      prompts,
      captureEncrypted,
      functions,
    ],
  );

  return (
    <Stack>
      <PromptButton
        onClick={() => {
          setIsDialogOpen(true);
          setIsTyping(false);
        }}
      />
      <Grow in={isDialogOpen}>
        <Backdrop sx={{ zIndex: 1051 }} open>
          <PromptBackground hasAnimation />
          <Stack
            sx={{
              width: '375px',
              height: '568px',
              m: 2,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                p: 2,
              }}
            >
              <Typography variant="h4">{t('Core AI Assistant')}</Typography>
              <Button
                variant="text"
                onClick={() => {
                  setIsDialogOpen(false);
                }}
                sx={{
                  p: 0,
                  height: theme.spacing(3),
                  width: theme.spacing(3),
                  minWidth: theme.spacing(3),
                }}
              >
                <XIcon size={24} sx={{ color: 'primary.main' }} />
              </Button>
            </Stack>
            <Scrollbars ref={scrollbarRef}>
              <Stack sx={{ p: 2, flexGrow: 1 }}>
                {prompts.map((message, i) => {
                  if (message.role === 'model') {
                    return (
                      <AIDialog
                        message={message}
                        key={i}
                        scrollToBottom={scrollToBottom}
                        isDialogOpen={isDialogOpen}
                      />
                    );
                  }
                  return <UserDialog message={message} key={i} />;
                })}
                {isTyping && <TypingAvatar />}
              </Stack>
            </Scrollbars>
            <Stack sx={{ p: 2 }}>
              <UserInput
                input={input}
                setInput={setInput}
                setPrompt={prompt}
                userMessages={userMessages}
              />
            </Stack>
          </Stack>
        </Backdrop>
      </Grow>
    </Stack>
  );
}
