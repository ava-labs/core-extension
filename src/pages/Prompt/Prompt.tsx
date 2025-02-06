import { Stack, TextField, Typography } from '@avalabs/core-k2-components';
import { useCallback, useEffect, useState } from 'react';
import { FunctionCallingMode, GoogleGenerativeAI } from '@google/generative-ai';
import { functions, sendFunctionDeclaration, systemPrompt } from './models';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
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

export function Prompt() {
  const [input, setInput] = useState<string>('');

  useEffect(() => {}, []);

  const prompt = useCallback(async (message: string) => {
    const chat = model.startChat();

    // Send the message to the model.
    const result = await chat.sendMessage(message);

    // For simplicity, this uses the first function call found.
    const call = result?.response?.functionCalls()?.[0];

    if (call) {
      // Call the executable function named in the function call
      // with the arguments specified in the function call and
      // let it call the hypothetical API.
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
      console.log(result2.response.text());
    }
  }, []);

  return (
    <Stack>
      <Typography variant="h3">Core AI</Typography>

      <TextField
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            prompt(input);
          }
        }}
      />
    </Stack>
  );
}
