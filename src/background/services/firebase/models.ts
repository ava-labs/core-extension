import { MessagePayload } from 'firebase/messaging';

export enum FirebaseEvents {
  FCM_READY = 'FCM_READY',
}

export enum FcmMessageEvents {
  ID_CHALLENGE = 'ID_CHALLENGE',
}

export type FcmMessageListener = (
  payload: MessagePayload
) => unknown | Promise<unknown>;
