import { MessagePayload } from 'firebase/messaging';

export enum FirebaseEvents {
  FCM_INITIALIZED = 'FCM_INITIALIZED',
  FCM_TERMINATED = 'FCM_TERMINATED',
}

export enum FcmMessageEvents {
  ID_CHALLENGE = 'ID_CHALLENGE',
}

export type FcmMessageListener = (
  payload: MessagePayload
) => unknown | Promise<unknown>;
