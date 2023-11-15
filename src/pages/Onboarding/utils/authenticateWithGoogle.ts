export async function authenticateWithGoogle(): Promise<string> {
  const manifest = chrome.runtime.getManifest();

  if (!manifest.oauth2 || !manifest.oauth2.scopes) {
    throw new Error('Oauth not configured');
  }

  const clientId = encodeURIComponent(manifest.oauth2.client_id);
  const scopes = encodeURIComponent(manifest.oauth2.scopes.join(' '));
  const redirectUri = encodeURIComponent(
    'https://' + chrome.runtime.id + '.chromiumapp.org'
  );

  const url =
    'https://accounts.google.com/o/oauth2/auth' +
    '?client_id=' +
    clientId +
    '&response_type=id_token' +
    '&redirect_uri=' +
    redirectUri +
    '&scope=' +
    scopes;

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: url,
        interactive: true,
      },
      (redirectedTo) => {
        if (!redirectedTo) {
          reject(new Error('Redirect url is undefined'));
          return;
        }

        if (chrome.runtime.lastError) {
          // Example: Authorization page could not be loaded.
          reject(chrome.runtime.lastError);
        } else {
          const response = redirectedTo.split('#', 2)[1];
          const idToken = response?.split('&')[0]?.replace('id_token=', '');

          if (!idToken) {
            reject(new Error('Id token not found'));
            return;
          }

          resolve(idToken);
        }
      }
    );
  });
}
