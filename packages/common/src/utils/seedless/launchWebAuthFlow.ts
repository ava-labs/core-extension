export function launchWebAuthFlow(url: URL): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: url.toString(),
        interactive: true,
      },
      (redirectedTo) => {
        if (!redirectedTo) {
          reject(new Error('Redirect url is undefined'));
          return;
        }

        if (chrome.runtime.lastError) {
          // Example: Authorization page could not be loaded.
          return reject(chrome.runtime.lastError);
        }

        const parsedUrl = new URL(redirectedTo);
        const params = new URLSearchParams(parsedUrl.hash.slice(1)); // hash contains a query string
        const idToken = params.get('id_token');

        if (!idToken) {
          return reject(new Error('no id token'));
        }

        resolve(idToken);
      },
    );
  });
}
