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
import { FunctionCallingMode, GoogleGenerativeAI } from '@google/generative-ai';
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

  const [prompts, setPrompts] = useState<
    {
      type: 'system' | 'user';
      content: string;
    }[]
  >([
    {
      type: 'system',
      content: `Hey there! I'm Core AI, here to help you manage your assets safely and smoothly. What can I do for you today?`,
    },
  ]);

  // const isTyping = prompts[prompts.length - 1]?.type === 'user';

  const tokens = useTokensWithBalances();
  useEffect(() => {
    if (prompts) {
      scrollbarRef?.current?.scrollToBottom();
    }
  }, [prompts]);

  const functions = useMemo(
    () => ({
      close: async () => {
        setIsDialogOpen(false);
        return true;
      },
      send: async ({ recepient, token, amount }) => {
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
            address: recepient,
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

        return {
          recepient,
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
        const toToken = tokens.find(
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

        const rate = await getRate({
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
          isAPIError(rate.optimalRate) ||
          !rate.optimalRate ||
          !rate.destAmount
        ) {
          throw new Error(
            `Error while getting swap rate. ${isAPIError(rate.optimalRate) ? rate.optimalRate.message : ''}`,
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
          srcAmount: rate.optimalRate.srcAmount,
          priceRoute: rate.optimalRate,
          destAmount: rate.destAmount,
          slippage: 0.1,
        });

        return {
          content: `Swap successful. Successfully swapped ${amount}${srcToken.symbol} to ${rate.destAmount}${toToken.symbol}.`,
        };
      },
    }),
    [
      accounts.active,
      createContact,
      getRate,
      network,
      request,
      selectAccount,
      swap,
      tokens,
    ],
  );

  const systemPrompt = useMemo(() => {
    if (!network || !tokens) {
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
        '__NETWORKS___',
        JSON.stringify(
          networks.map((n) => ({
            id: n.caipId,
            name: n.chainName,
            isTestnet: n.isTestnet,
          })),
        ),
      )
      .replace(
        '__CURRENT_NETWORK___',
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
          ].map((a) => ({ name: a.name, id: a.id, address: a.addressC })),
        ),
      );
  }, [tokens, network, contacts, accounts, networks]);

  const model = useMemo(() => {
    return genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.5,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
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
    });
  }, [systemPrompt]);

  const prompt = useCallback(
    async (message: string) => {
      setIsTyping(true);
      setPrompts((prev) => {
        return [...prev, { type: 'user', content: message }];
      });
      setInput('');

      const chat = model.startChat();

      // Send the message to the model.
      const result = await chat.sendMessage(message);

      // For simplicity, this uses the first function call found.
      const call = result?.response?.functionCalls()?.[0];

      if (call) {
        // Call the executable function named in the function call
        // with the arguments specified in the function call and
        // let it call the hypothetical API.
        try {
          const apiResponse = await functions[call.name](call.args);

          // Send the API response back to the model so it can generate
          // a text response that can be displayed to the user.
          const result2 = await chat.sendMessage([
            {
              functionResponse: {
                name: 'send',
                response: apiResponse,
              },
            },
          ]);
          // Log the text response.
          setPrompts((prev) => {
            return [
              ...prev,
              { type: 'system', content: result2.response.text() },
            ];
          });
        } catch (e: any) {
          const errorMessage =
            'code' in e
              ? errorValues[e.code]?.message || 'Unkown error happened'
              : e.toString();

          // Send the API response back to the model so it can generate
          // a text response that can be displayed to the user.
          const errorResult = await chat.sendMessage([
            {
              functionResponse: {
                name: 'send',
                response: {
                  content: `Send failed. ${errorMessage}`,
                },
              },
            },
          ]);

          // Log the text response.
          setPrompts((prev) => {
            return [
              ...prev,
              { type: 'system', content: errorResult.response.text() },
            ];
          });
        }
      } else {
        setPrompts((prev) => {
          return [...prev, { type: 'system', content: result.response.text() }];
        });
      }
      setIsTyping(false);
    },
    [functions, model],
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
                  if (message.type === 'system') {
                    return <AIDialog message={message} key={i} />;
                  }
                  return <UserDialog message={message} key={i} />;
                })}
                {isTyping && <TypingAvatar />}
              </Stack>
            </Scrollbars>
            <Stack sx={{ p: 2 }}>
              <UserInput input={input} setInput={setInput} prompt={prompt} />
            </Stack>
          </Stack>
        </Backdrop>
      </Grow>
    </Stack>
  );
}
