import Joi from 'joi';

type ReverseChallengeDetails = {
  token: string;
};

const challengeDetailsSchema = Joi.object<ReverseChallengeDetails, true>({
  token: Joi.string().length(64).required(),
}).required();

const solveReverseChallenge = (details: string) => {
  const parsedDetails = JSON.parse(details) as ReverseChallengeDetails;

  const { error: schemaValidationError } =
    challengeDetailsSchema.validate(parsedDetails);

  if (schemaValidationError) {
    throw new Error('invalid reverse challenge details');
  }

  const result = parsedDetails.token.split('').reverse().join('');

  return result;
};

export default solveReverseChallenge;
