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
import {
  ChatDialogHistory,
  ConfigParams,
} from '@src/background/services/firebase/models';

export interface PromptItem {
  role: 'model' | 'user';
  content: string;
}

const FirebaseContext = createContext<{
  setModel: ({ tools, systemInstruction }: ConfigParams) => Promise<boolean>;
  sendMessage: ({
    message,
    parts,
    history,
    config,
  }: {
    message: string;
    parts?: Content[];
    history?: ChatDialogHistory[];
    config?: ConfigParams;
  }) => Promise<{ text: string; functionCalls?: FunctionCall[] }>;
  prompts: PromptItem[];
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
  const [prompts, setPrompts] = useState<ChatDialogHistory[]>([
    {
      role: 'model',
      content: `Hey there! I'm Core Concierge, here to help you manage your assets safely and smoothly. What can I do for you today?`,
    },
  ]);

  const setModel = useCallback(
    ({ tools, systemInstruction }: ConfigParams) => {
      return request<FirebaseSetModelHandler>({
        method: ExtensionRequest.FIREBASE_SET_MODEL,
        params: {
          tools,
          systemInstruction,
        },
      });
    },
    [request],
  );

  const sendMessage = useCallback(
    ({
      message,
      parts,
      history,
      config,
    }: {
      message: string;
      parts?: Content[];
      history?: ChatDialogHistory[];
      config?: ConfigParams;
    }) => {
      return request<FirebaseSendMessageHandler>({
        method: ExtensionRequest.FIREBASE_SEND_MESSAGE,
        params: { message, parts, history, config },
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
