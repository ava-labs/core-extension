import { FcmMessageEvents } from '../firebase/models';

export type ChallengeRequest = {
  id: string;
  registrationId?: string;
  solution?: string;
};

export type ChallengeSolver = (details: string) => string | Promise<string>;

export enum Algorithm {
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
}

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
