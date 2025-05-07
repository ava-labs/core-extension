import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { FirebaseSetModelHandler } from '@src/background/services/firebase/handlers/setModel';
import { Content, FunctionCall } from '@firebase/vertexai';
import { FirebaseSendMessageHandler } from '@src/background/services/firebase/handlers/sendMessage';
import { ConfigParams } from '@src/background/services/firebase/models';

interface ChatDialog {
  role: 'model' | 'user';
  content: string;
}

const FirebaseContext = createContext<{
  setModel: ({ tools, toolConfig, systemInstruction }: any) => Promise<boolean>;
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

  const setModel = useCallback(
    ({ tools, toolConfig, systemInstruction }: ConfigParams) => {
      return request<FirebaseSetModelHandler>({
        method: ExtensionRequest.FIREBASE_SET_MODEL,
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
        setModel,
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
