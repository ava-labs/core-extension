import { MessagePayload } from 'firebase/messaging';
import {
  Content,
  GenerationConfig,
  Part,
  Tool,
  ToolConfig,
} from 'firebase/vertexai';

export enum FirebaseEvents {
  FCM_INITIALIZED = 'FCM_INITIALIZED',
  FCM_TERMINATED = 'FCM_TERMINATED',
}

export type FcmMessageListener = (
  payload: MessagePayload,
) => unknown | Promise<unknown>;

export interface ConfigParams {
  tools?: Tool[];
  toolConfig?: ToolConfig;
  systemInstruction?: string | Part | Content;
}
export interface ChatConfig extends ConfigParams {
  generationConfig: GenerationConfig;
}

export interface ChatDialogHistory {
  role: 'model' | 'user';
  content: string;
}
