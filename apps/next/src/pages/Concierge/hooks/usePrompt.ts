import { useCallback, useRef } from 'react';
import { Monitoring } from '@core/common';
import { errorValues } from 'eth-rpc-errors/dist/error-constants';
import { functionDeclarations } from '../model';

interface UsePromptParams {
  setIsTyping: (isTyping: boolean) => void;
  setInput: (input: string) => void;
  prompts: any[];
  setPrompts: React.Dispatch<React.SetStateAction<any[]>>;
  systemPrompt: string;
  functions: Record<string, (args: any) => Promise<any>>;
  setModel: (config: any) => Promise<any>;
  sendMessage: (params: any) => Promise<any>;
  captureEncrypted: (eventName: string, data: any) => void;
}

export const usePrompt = ({
  setIsTyping,
  setInput,
  prompts,
  setPrompts,
  systemPrompt,
  functions,
  setModel,
  sendMessage,
  captureEncrypted,
}: UsePromptParams) => {
  const isModelReady = useRef(false);

  return useCallback(
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

        const call = response?.functionCalls?.[0];
        if (call) {
          try {
            captureEncrypted('CoreAssistantFunctionCall', {
              functionName: call.name,
              userMessage: message,
            });
            const apiResponse = await functions[call.name]?.(call.args);
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

            setPrompts((prev) => {
              return [...prev, { role: 'model', content: functionResult.text }];
            });
          } catch (e: any) {
            const errorMessage =
              'code' in e
                ? errorValues[e.code]?.message || 'Unkown error happened'
                : e.toString();

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
};
