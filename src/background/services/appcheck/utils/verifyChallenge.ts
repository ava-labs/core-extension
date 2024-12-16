type Params = {
  registrationId: string;
  solution: string;
};

const verifyChallenge = async ({ registrationId, solution }: Params) => {
  const url = process.env.ID_SERVICE_URL;

  if (!url) {
    throw new Error('ID_SERVICE_URL is missing');
  }

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
  });

  if (!verifyChallengeResponse.ok) {
    throw new Error(
      `challenge verification error: "${verifyChallengeResponse.statusText}"`,
    );
  }

  return verifyChallengeResponse.json();
};

export default verifyChallenge;
