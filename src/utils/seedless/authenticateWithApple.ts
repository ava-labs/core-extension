import { launchWebAuthFlow } from '../../pages/Onboarding/utils/launchWebAuthFlow';

export async function authenticateWithApple(): Promise<string> {
  const clientId = process.env.APPLE_OAUTH_CLIENT_ID;
  const redirectUrl = process.env.APPLE_OAUTH_REDIRECT_URL;

  // This is the base URL that the Core Seedless API should redirect to after receiving the data from Apple.
  const baseUrl = 'https://' + chrome.runtime.id + '.chromiumapp.org';

  if (!clientId || !redirectUrl) {
    throw new Error('Apple OAuth not configured');
  }

  const url = new URL('https://appleid.apple.com/auth/authorize');

  url.searchParams.set('client_id', clientId);
  url.searchParams.set('nonce', crypto.randomUUID());
  url.searchParams.set('response_type', 'code id_token');
  url.searchParams.set('state', baseUrl);
  url.searchParams.set('redirect_uri', redirectUrl);
  url.searchParams.set('scope', 'email');
  // "form_post" response mode is forced since we request user's email in "scope".
  // Reference: https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server#query-parameters
  url.searchParams.set('response_mode', 'form_post');

  return launchWebAuthFlow(url);
}
