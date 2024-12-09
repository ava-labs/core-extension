type Params = {
  token: string;
  requestId: string;
};

const registerForChallenge = async ({ token, requestId }: Params) => {
  const url = process.env.ID_SERVICE_URL;

  if (!url) {
    throw new Error('ID_SERVICE_URL is missing');
  }

  const registerResponse = await fetch(`${url}/v1/ext/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Type': 'extension',
      'X-App-Version': chrome.runtime.getManifest().version,
    },
    body: JSON.stringify({
      token,
      requestId,
    }),
  });

  if (!registerResponse.ok) {
    throw new Error(
      `challenge registration error: "${registerResponse.statusText}"`
    );
  }
};

export default registerForChallenge;
