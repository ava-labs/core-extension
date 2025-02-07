import { FunctionDeclaration, SchemaType } from '@google/generative-ai';

export const sendFunctionDeclaration: FunctionDeclaration = {
  name: 'send',
  parameters: {
    type: SchemaType.OBJECT,
    description: `Send the specified amount of a token to the recepient address on the current network.`,
    properties: {
      amount: {
        type: SchemaType.NUMBER,
        description: `The amount of tokens to send. The amount cannot be more than the token's balance.`,
      },
      recepient: {
        type: SchemaType.STRING,
        description: `The wallet address of the recepient. It has to be a valid EVM address which is in a hexadecimal format and is 42 characters long. The recepeint can be a contact or one of the user's accounts. The active account cannot be the recepient.`,
      },
      token: {
        type: SchemaType.STRING,
        description:
          'The address of the token to be sent. The user has to hold balance of the token.',
      },
    },
    required: ['recepient', 'token', 'amount'],
  },
};

export const systemPromptTemplate = `
  You are a crypto wallet AI assistant. Your job is to help manage the user's portfolio. 
  Do not let users attempt to send more than their balance of the selected token. When sending a token fails, apologize and show the error message.
  Current network: __CURRENT_NETWORK___
  The user has the following tokens:  
    __TOKENS__
  The user has the following contacts:
    __CONTACTS__
  The user has the following accounts:
    __ACCOUNTS__
`;
