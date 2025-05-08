import {
  Button,
  ScrollbarsRef,
  Stack,
  Typography,
  useTheme,
  XIcon,
  Scrollbars,
  Grow,
  Backdrop,
} from '@avalabs/core-k2-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FunctionCallingMode } from '@google/generative-ai';
import { functionDeclarations, systemPromptTemplate } from './models';
import { useTranslation } from 'react-i18next';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { buildTx } from '@src/pages/Send/utils/buildSendTx';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import {
  RpcMethod,
  TokenType,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { errorValues } from 'eth-rpc-errors/dist/error-constants';
import { useSwapContext } from '@src/contexts/SwapProvider';
import { stringToBigint } from '@src/utils/stringToBigint';
import { isAPIError } from '@src/pages/Swap/utils';
import { PromptBackground, PromptButton } from './GradientElements';
import {
  AIDialog,
  UserInput,
  TypingAvatar,
  UserDialog,
} from './PromptElements';
import { useFirebaseContext } from '@src/contexts/FirebaseProvider';
import { toastCardWithLink } from '@src/utils/toastCardWithLink';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

export function Prompt() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [input, setInput] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { network, networks } = useNetworkContext();
  const { contacts, createContact } = useContactsContext();
  const { accounts, selectAccount } = useAccountsContext();
  const { request } = useConnectionContext();
  const { swap, getRate } = useSwapContext();
  const [isTyping, setIsTyping] = useState(false);
  const scrollbarRef = useRef<ScrollbarsRef | null>(null);
  const { setModel, sendMessage, prompts, setPrompts } = useFirebaseContext();
  const isModelReady = useRef(false);

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
    }),
    [
      accounts.active,
      allAvailableTokens,
      createContact,
      getRate,
      network,
      request,
      selectAccount,
      swap,
      t,
      tokens,
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
      );
  }, [network, tokens, accounts, allAvailableTokens, networks, contacts]);

  const prompt = useCallback(
    async (message: string) => {
      setIsTyping(true);
      setPrompts((prev) => {
        return [...prev, { role: 'user', content: message }];
      });
      setInput('');

      try {
        await setModel({
          tools: [
            {
              functionDeclarations,
            },
          ],
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingMode.AUTO,
            },
          },
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

        const response = await sendMessage(message);

        // For simplicity, this uses the first function call found.
        const call = response?.functionCalls?.[0];
        if (call) {
          // Call the executable function named in the function call
          // with the arguments specified in the function call and
          // let it call the hypothetical API.
          try {
            const apiResponse = await functions[call.name](call.args);

            // Send the API response back to the model so it can generate
            // a text response that can be displayed to the user.
            const functionResult = await sendMessage(message, [
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
            ]);
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
            const errorResult = await sendMessage(message, [
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
            ]);

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
        sentryCaptureException(e as Error, SentryExceptionTypes.AI_AGENT);
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
    [functions, sendMessage, setPrompts, setModel, systemPrompt],
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
