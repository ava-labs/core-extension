import {
  Box,
  Button,
  Drawer,
  InputAdornment,
  SendIcon,
  Stack,
  TextField,
  Typography,
  useTheme,
  XIcon,
} from '@avalabs/core-k2-components';
import { useCallback, useMemo, useState } from 'react';
import { FunctionCallingMode, GoogleGenerativeAI } from '@google/generative-ai';
import { sendFunctionDeclaration, systemPromptTemplate } from './models';
import { useTranslation } from 'react-i18next';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { buildTx } from '@src/pages/Send/utils/buildSendTx';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { RpcMethod, TokenWithBalanceERC20 } from '@avalabs/vm-module-types';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { rpcErrors } from '@metamask/rpc-errors';
import { errorValues } from 'eth-rpc-errors/dist/error-constants';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export function Prompt() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [input, setInput] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const { network } = useNetworkContext();
  const { contacts } = useContactsContext();
  const { accounts } = useAccountsContext();
  const { request } = useConnectionContext();

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
  const tokens = useTokensWithBalances();

  const functions = {
    send: async ({ recepient, token, amount }) => {
      console.log('SEND CALLED', { recepient, token, amount });
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

      return `Transaction successful. Tx hash: ${hash}`;
    },
  };

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
      .replace('__CURRENT_NETWORK___', JSON.stringify(network))
      .replace('__CONTACTS__', JSON.stringify(contacts))
      .replace('__ACCOUNTS__', JSON.stringify(accounts));
  }, [tokens, network, contacts, accounts]);

  const model = useMemo(() => {
    console.log('SYSTEM PROMPT', systemPrompt);
    return genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      tools: [
        {
          functionDeclarations: [sendFunctionDeclaration],
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

          console.log('PROMPT apiResponse', apiResponse);
          // Send the API response back to the model so it can generate
          // a text response that can be displayed to the user.
          const result2 = await chat.sendMessage([
            {
              functionResponse: {
                name: 'send',
                response: { ...call.args, content: apiResponse },
              },
            },
          ]);
          console.log('PROMPT result2', result2);

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

          console.log('PROMPT ERROR', errorMessage);
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
    },
    [model],
  );

  return (
    <>
      <TextField
        placeholder="Core AI - Manage your wallet"
        value={input}
        size="small"
        sx={{
          mt: 2,
          mb: 1,
          mx: 2,
        }}
        onChange={(e) => {
          if (e.target.value !== '') {
            setIsDrawerOpen(true);
          }
          setInput(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            prompt(input);
          }
        }}
        onClick={() => {
          setIsDrawerOpen(true);
        }}
      />
      <Drawer anchor="bottom" open={isDrawerOpen}>
        <Stack
          sx={{
            height: 'calc(100vh - 70px)',
            overflow: 'hidden',
            width: '100vw',
            position: 'relative',
            backgroundColor: 'background.paper',
            p: 2,
          }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h4">{t('Core AI Assistant')}</Typography>
            <Button
              variant="text"
              onClick={() => {
                setIsDrawerOpen(false);
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
          <Stack sx={{ flexGrow: 1 }}>
            <Scrollbars>
              {prompts.map((p, i) => (
                <Box
                  key={i}
                  sx={{
                    backgroundColor:
                      p.type === 'system'
                        ? theme.palette.grey[600]
                        : theme.palette.grey[800],
                    py: 1,
                    px: 2,
                    my: 1,
                    maxWidth: '70%',
                    width: 'fit-content',
                    borderRadius: 1,
                    justifySelf:
                      p.type === 'system' ? 'flex-start' : 'flex-end',
                  }}
                >
                  <Typography>{p.content}</Typography>
                </Box>
              ))}
            </Scrollbars>
          </Stack>
          <TextField
            placeholder="Core AI - Manage your wallet"
            value={input}
            size="small"
            focused
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SendIcon
                    sx={{
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      prompt(input);
                    }}
                  />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                prompt(input);
              }
            }}
          />
        </Stack>
      </Drawer>
    </>
  );
}
