import { FcmMessageEvents } from '../firebase/models';

export type ChallengeRequest = {
  id: string;
  registrationId?: string;
  solution?: string;
};

export enum ChallengeTypes {
  BASIC = 'BASIC',
}

export type AppCheckRegistrationChallenge = {
  requestId: string;
  registrationId: string;
  type: ChallengeTypes;
  event: FcmMessageEvents.ID_CHALLENGE;
  details: string;
};
