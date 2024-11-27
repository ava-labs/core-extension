import Joi from 'joi';

type BasicChallengeDetails = {
  token: string;
};

const challengeDetailsSchema = Joi.object<BasicChallengeDetails, true>({
  token: Joi.string().required(),
}).required();

const solveBasicChallenge = (details: string) => {
  const parsedDetails = JSON.parse(details) as BasicChallengeDetails;

  const { error: schemaValidationError } =
    challengeDetailsSchema.validate(parsedDetails);

  if (schemaValidationError) {
    throw new Error('invalid basic challenge details');
  }

  return parsedDetails.token;
};

export default solveBasicChallenge;
