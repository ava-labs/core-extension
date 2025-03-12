type Params = {
  registrationId: string;
  solution: string;
};

const VERIFY_TIMEOUT_MS = 10_000;

const verifyChallenge = async ({ registrationId, solution }: Params) => {
  const url = process.env.ID_SERVICE_URL;

  if (!url) {
    throw new Error('ID_SERVICE_URL is missing');
  }

  try {
    const verifyChallengeResponse = await fetch(`${url}/v1/ext/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Type': 'extension',
        'X-App-Version': chrome.runtime.getManifest().version,
      },
      body: JSON.stringify({
        registrationId,
        solution,
      }),
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });

    if (!verifyChallengeResponse.ok) {
      throw new Error(verifyChallengeResponse.statusText);
    }

    return verifyChallengeResponse.json();
  } catch (err) {
    throw new Error(
      `[AppCheck] challenge verification error "${(err as Error).message}"`,
    );
  }
};

export default verifyChallenge;
