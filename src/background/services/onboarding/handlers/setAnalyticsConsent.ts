import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { onboardingAnalyticsConsent$ } from '../onboardingFlows';

export async function setAnalyticsMnemonic(
  request: ExtensionConnectionMessage
) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: 'params missing from request',
    };
  }

  const [consent] = params;

  onboardingAnalyticsConsent$.next(consent);
  return {
    ...request,
    result: true,
  };
}

export const SetOnboardingAnalyticsConsentRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ONBOARDING_SET_ANALYTICS_CONSENT, setAnalyticsMnemonic];
