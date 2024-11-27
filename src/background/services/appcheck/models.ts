import { Events } from '../firebase/models';

export enum ChallengeTypes {
  BASIC = 'BASIC',
}

export type AppCheckRegistrationChallenge = {
  requestId: string;
  registrationId: string;
  type: ChallengeTypes;
  event: Events.ID_CHALLENGE;
  details: string;
};
