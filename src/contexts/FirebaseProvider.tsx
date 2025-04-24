import { createContext, useCallback, useContext } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { FirebaseStartChatHandler } from '@src/background/services/firebase/handlers/startChat';
import { Content, FunctionCall } from '@firebase/vertexai';
import { FirebaseSendMessageHandler } from '@src/background/services/firebase/handlers/sendMessage';
import { ConfigParams } from '@src/background/services/firebase/models';

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
}>({
  getModel: () => false,
} as any);

export function FirebaseContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();

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
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseContext() {
  return useContext(FirebaseContext);
}
