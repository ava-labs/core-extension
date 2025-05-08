import Joi from 'joi';
import { Algorithm } from '@core/types';
import getHashByAlgorithm from '../getHashByAlgorithm';

type BasicChallengeDetails = {
  token: string;
  difficulty: number;
  algorithm: Algorithm;
};

const challengeDetailsSchema = Joi.object<BasicChallengeDetails, true>({
  token: Joi.string().required(),
  difficulty: Joi.number().required(),
  algorithm: Joi.string()
    .valid(...Object.values(Algorithm))
    .required(),
}).required();

const _calculate = ({
  token,
  difficulty,
  algorithm,
}: {
  token: string;
  difficulty: number;
  algorithm: Algorithm;
}) => {
  let nonce = 0;
  let hash = '';

  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    hash = getHashByAlgorithm(algorithm, `${token}${++nonce}`);
  }

  return { hash, nonce };
};

const solveBasicChallenge = (details: string) => {
  const parsedDetails = JSON.parse(details) as BasicChallengeDetails;

  const { error: schemaValidationError } =
    challengeDetailsSchema.validate(parsedDetails);

  if (schemaValidationError) {
    throw new Error('invalid basic challenge details');
  }

  const result = _calculate({ ...parsedDetails });

  return `${result.hash}.${result.nonce}`;
};

export default solveBasicChallenge;
