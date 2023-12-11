import { launchWebAuthFlow } from '../../pages/Onboarding/utils/launchWebAuthFlow';

export async function authenticateWithGoogle(): Promise<string> {
  const manifest = chrome.runtime.getManifest();

  if (!manifest.oauth2 || !manifest.oauth2.scopes) {
    throw new Error('Oauth not configured');
  }

  const redirectUri = 'https://' + chrome.runtime.id + '.chromiumapp.org';
  const url = new URL('https://accounts.google.com/o/oauth2/auth');

  url.searchParams.set('client_id', manifest.oauth2.client_id);
  url.searchParams.set('response_type', 'id_token');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', manifest.oauth2.scopes.join(' '));

  return launchWebAuthFlow(url);
}
