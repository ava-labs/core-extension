type Params = {
  token: string;
  requestId: string;
};

const REGISTER_TIMEOUT_MS = 10_000;

const registerForChallenge = async ({ token, requestId }: Params) => {
  const url = process.env.ID_SERVICE_URL;

  if (!url) {
    throw new Error('ID_SERVICE_URL is missing');
  }

  try {
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
      signal: AbortSignal.timeout(REGISTER_TIMEOUT_MS),
    });

    if (!registerResponse.ok) {
      throw new Error(registerResponse.statusText);
    }
  } catch (err) {
    throw new Error(
      `[AppCheck] challenge registration error "${(err as Error).message}"`,
    );
  }
};

export default registerForChallenge;
