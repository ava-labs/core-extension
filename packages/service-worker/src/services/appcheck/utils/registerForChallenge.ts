import { Challenge } from '@core/types';
import { sendRequest } from './sendRequest';

type Params = {
  requestId: string;
};

const REGISTER_TIMEOUT_MS = 10_000;
const REGISTER_PATH = 'v2/ext/register';

const registerForChallenge = async ({ requestId }: Params) => {
  try {
    const registerResponse = await sendRequest({
      path: REGISTER_PATH,
      payload: {
        requestId,
      },
      timeout: REGISTER_TIMEOUT_MS,
    });

    if (!registerResponse.ok) {
      throw new Error(
        `registration failed with status ${registerResponse.status}: ${registerResponse.statusText}`,
      );
    }

    return registerResponse.json() as Promise<Challenge>;
  } catch (err) {
    throw new Error(
      `[AppCheck] challenge registration error "${(err as Error).message}"`,
    );
  }
};

export default registerForChallenge;
