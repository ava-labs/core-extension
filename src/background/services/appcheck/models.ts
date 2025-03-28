import { FcmMessageEvents } from '../firebase/models';
import * as Sentry from '@sentry/browser';

export type ChallengeRequest = {
  id: string;
  tracker: Sentry.Transaction;
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
  REVERSE = 'REVERSE',
}

export type AppCheckRegistrationChallenge = {
  requestId: string;
  registrationId: string;
  type: ChallengeTypes;
  event: FcmMessageEvents.ID_CHALLENGE;
  details: string;
};
