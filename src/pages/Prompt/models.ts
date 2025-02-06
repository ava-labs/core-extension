import { FunctionDeclaration, SchemaType } from '@google/generative-ai';

export const sendFunctionDeclaration: FunctionDeclaration = {
  name: 'send',
  parameters: {
    type: SchemaType.OBJECT,
    description: `Send the specified amount of a token to the recepient address on the current network.`,
    properties: {
      amount: {
        type: SchemaType.NUMBER,
        description:
          'The amount of tokens to send. It cannot be more than the users current balance of the given token on the current network.',
      },
      recepient: {
        type: SchemaType.STRING,
        description: `The wallet address of the recepient. It has to be in a hexadecimal format or must be the name of one of the user's contacts.`,
      },
      token: {
        type: SchemaType.STRING,
        description:
          'The symbol or the address of the token to be sent. The user has to hold balance of the token.',
      },
    },
    required: ['recepient', 'token', 'amount'],
  },
};

export const functions = {
  send: ({ recepient, token, amount }) => {
    return console.log('SEND called', { recepient, token, amount });
  },
};

export const systemPrompt = `
  You are a crypto wallet AI assistant. Your job is to help manage the user's portfolio. 
  Current network: Avalanche
  The user has the following tokens: 
    - {symbol: 'USDC', name: 'USDC', amount: 12.345, network: 'Avalanche'}
    - {symbol: 'Yak', name: 'Yield Yak', amount: 8.1, network: 'Avalanche'}
    - {symbol: 'USDC', name: 'USDC', amount: 50, network: 'Ethereum'}
    - {symbol: 'AVAX', name: 'AVAX', amount: 2, network: 'Avalanche'}
  The user has the following contacts:
    - {'name': 'Feri', 'address': '0x123123'}
    - {'name': 'Csaba', 'address': '0x45345345'}
`;
