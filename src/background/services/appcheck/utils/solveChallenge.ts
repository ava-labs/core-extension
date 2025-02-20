import { ChallengeSolver, ChallengeTypes } from '../models';
import solveBasicChallenge from './challenges/basic';

type Params = {
  type: ChallengeTypes;
  challengeDetails: string;
};

const CHALLENGE_MAP: Record<ChallengeTypes, ChallengeSolver> = {
  [ChallengeTypes.BASIC]: solveBasicChallenge,
};

const solveChallenge = async ({ type, challengeDetails }: Params) => {
  const solver = CHALLENGE_MAP[type];
  return solver(challengeDetails);
};

export default solveChallenge;
