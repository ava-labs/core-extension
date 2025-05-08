import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@core/types';
import type {
  FirebaseSendMessageHandler,
  FirebaseStartChatHandler,
} from '@core/service-worker';
import { Content, FunctionCall } from '@firebase/vertexai';
import { ConfigParams } from '@core/types';

interface ChatDialog {
  role: 'model' | 'user';
  content: string;
}

const FirebaseContext = createContext<{
  startChat: ({
    tools,
    toolConfig,
    systemInstruction,
  }: any) => Promise<boolean>;
  sendMessage: (
    message: string,
    parts?: Content[],
  ) => Promise<{ text: string; functionCalls?: FunctionCall[] }>;
  prompts: {
    role: 'model' | 'user';
    content: string;
  }[];
  setPrompts: Dispatch<
    SetStateAction<
      {
        role: 'model' | 'user';
        content: string;
      }[]
    >
  >;
}>({
  getModel: () => false,
} as any);

export function FirebaseContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();
  const [prompts, setPrompts] = useState<ChatDialog[]>([
    {
      role: 'model',
      content: `Hey there! I'm Core AI, here to help you manage your assets safely and smoothly. What can I do for you today?`,
    },
  ]);

  const startChat = useCallback(
    ({ tools, toolConfig, systemInstruction }: ConfigParams) => {
      return request<FirebaseStartChatHandler>({
        method: ExtensionRequest.FIREBASE_START_CHAT,
        params: {
          tools,
          toolConfig,
          systemInstruction,
        },
      });
    },
    [request],
  );

  const sendMessage = useCallback(
    (message, parts) => {
      return request<FirebaseSendMessageHandler>({
        method: ExtensionRequest.FIREBASE_SEND_MESSAGE,
        params: [message, parts],
      });
    },
    [request],
  );

  return (
    <FirebaseContext.Provider
      value={{
        startChat,
        sendMessage,
        prompts,
        setPrompts,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseContext() {
  return useContext(FirebaseContext);
}
