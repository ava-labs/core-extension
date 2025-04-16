import { createContext, useCallback, useContext } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { FirebaseStartChatHandler } from '@src/background/services/firebase/handlers/startChat';
import { EnhancedGenerateContentResponse } from '@firebase/vertexai';
import { FirebaseSendMessageHandler } from '@src/background/services/firebase/handlers/sendMessage';

// {
//     modelVersion:,
//     generationConfig:,
//     tools,
//     toolConfig,
//     systemInstruction,
// }: {
//     modelVersion: string;
//     generationConfig: any;
//     tools: any;
//     toolConfig: any;
//     systemInstruction: any;
// }

const FirebaseContext = createContext<{
  startChat: ({
    tools,
    toolConfig,
    systemInstruction,
  }: any) => Promise<boolean>;
  sendMessage: (
    message: string | { functionResponse: { name: string; response: any } }[],
  ) => Promise<EnhancedGenerateContentResponse>;
}>({
  getModel: () => false,
} as any);

export function FirebaseContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();

  const startChat = useCallback(
    ({ tools, toolConfig, systemInstruction, history }) => {
      return request<FirebaseStartChatHandler>({
        method: ExtensionRequest.FIREBASE_START_CHAT,
        params: {
          tools,
          toolConfig,
          systemInstruction,
          history,
        },
      });
    },
    [request],
  );

  const sendMessage = useCallback(
    (message) => {
      return request<FirebaseSendMessageHandler>({
        method: ExtensionRequest.FIREBASE_SEND_MESSAGE,
        params: message,
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
