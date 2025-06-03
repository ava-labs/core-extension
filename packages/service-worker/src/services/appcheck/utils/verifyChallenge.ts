import { createHash } from 'crypto';
import { isDevelopment } from '@core/common';
import { Challenge } from '@core/types';
import { sendRequest } from './sendRequest';

const VERIFY_TIMEOUT_MS = 10_000;
const VERIFY_PATH = 'v2/ext/verify';

const _solveChallenge = async ({ path, nonce }: Challenge) => {
  if (isDevelopment()) {
    const manifestResponse = await fetch(
      chrome.runtime.getURL('manifest.json'),
    );
    const manifestBuffer = await manifestResponse.arrayBuffer();
    const encodedManifest = Buffer.from(manifestBuffer).toString('base64');

    const checksum = createHash('sha256')
      .update(`${chrome.runtime.getManifest().version}:${encodedManifest}`)
      .digest('hex');

    const solution = createHash('sha256')
      .update(`${checksum}:${nonce}`)
      .digest('hex');

    return solution;
  }

  const fileResponse = await fetch(chrome.runtime.getURL(path));
  const fileBuffer = await fileResponse.arrayBuffer();
  const encodedFile = Buffer.from(fileBuffer).toString('base64');

  const checksum = createHash('sha256')
    .update(`${chrome.runtime.getManifest().version}:${encodedFile}`)
    .digest('hex');

  const solution = createHash('sha256')
    .update(`${checksum}:${nonce}`)
    .digest('hex');

  return solution;
};

const verifyChallenge = async ({ challengeId, path, nonce }: Challenge) => {
  const url = process.env.ID_SERVICE_URL;

  if (!url) {
    throw new Error('ID_SERVICE_URL is missing');
  }

  const solution = await _solveChallenge({ challengeId, path, nonce });

  try {
    const verifyChallengeResponse = await sendRequest({
      path: VERIFY_PATH,
      payload: {
        challengeId,
        solution,
      },
      timeout: VERIFY_TIMEOUT_MS,
    });

    if (!verifyChallengeResponse.ok) {
      throw new Error(
        `verification failed with status ${verifyChallengeResponse.status}: ${verifyChallengeResponse.statusText}`,
      );
    }

    return verifyChallengeResponse.json();
  } catch (err) {
    throw new Error(
      `[AppCheck] challenge verification error "${(err as Error).message}"`,
    );
  }
};

export default verifyChallenge;
