# Analytics and Feature Flags

## Overview

The Core suite of applications uses Posthog for analytics and feature flags.
Analytics is a sensitive topic and is a balancing act. As a product, we need to learn as much as possible about the usage patterns of users without compromising their privacy even a tiny bit.
While originally it was a self-hosted instance, it has been migrated to the cloud due to Posthog's portfolio changes. This makes tracking even more sensitive.

For error reporting we use Sentry.io
Posthog url: https://app.posthog.com

Ask IT for access!

## Environments

The Extension uses 2 separate Posthog projects. The main reasons behind this duality are:

1. Be able to toggle feature flags separately
2. Access control. Only give production access to a limited set of people.

- Local development, the main branch build, and the Blue builds are hooked up to the `TEST Posthog organization`
- Production is using the `production Posthog organization`. Access is provisioned separately.

## Reporting events

Core Extension directly communicates with the Posthog APIs, without using their libraries.

- It eliminates accidental data tracking. No auto capture.
- The nature of the background and frontend lifecycle of the app made it difficult for the SDK to identify sessions.
- The SDK was using XMLHttpRequest which is unavailable on the background script
- We wanted to limit fetching the feature flags to one place, which is the background script.

### To report events

On the frontend use the Analytics Context:

```js
const { capture } = useAnalyticsContext();

capture(`BuyClicked`);
```

On the background script, use the AnalyticsServicePosthog object to report events:

```js
    constructor(private analyticsServicePosthog: AnalyticsServicePosthog) {}

    doSomething() {
        this.analyticsServicePosthog.captureEvent(`DoSomethingCalled`)
    }
```

## Feature flags

The feature flags are fetched and updated periodically by the `FeatureFlagService` on the background script.

To use a feature flag on the background script you can either use `FeatureFlagService.ensureFlagEnabled` which throws an Exception if the feature is disabled or use the `FeatureFlagService.featureFlags` getter to get a list of all flags.

On the frontend, use the `useFeatureFlagContext` hook to get flags from the `FeatureFlagProvider`.

## Reporting errors

We use Sentry.io for exception tracking, error reporting, and alerting. Sentry is initialized on both the background and the frontend script separately.
It can be used for transaction monitoring as well, to see how long a given task took.
On top of the restrictions applied to the sentry library, make sure proper data scrubbing is set up on your Sentry project.

To report an error to Sentry, use the `console.error` method. Unhandled exceptions are reported automatically.

## DOs and DON'Ts

- **DO NOT** report any PII information to the analytics systems
- **DO NOT** use any auto capturing and tracking feature of analytics SDKs. Be 100% in control of the reported data. In case of a nasty bug reporting unwanted data, cleaning up 3rd party databases is hard and you never can be sure it's fully redacted from the cloud.
- **DO NOT** track or store IP addresses anywhere
- **DO NOT** report full objects to any of the 3rd party systems. Even though they might not contain sensitive data now, you can't know when a property with PII will be added.
- **DO** monitor Posthog and Sentry constantly to ensure there is no PII reported.
- **DO** be careful about consecutive events. For example, a token selection event itself does not identify the transaction, but with an amount and the timestamp of pushing the send button, it's easy to figure out the source.
- **DO** add analytics events for new features
- **DO** default to the less bad when integrating feature flags. If the feature flag service is down, should we disable the feature by default or is it worse if we can't disable it?
- **DO** make sure your new Feature Flags are added to both environments and have the correct default values before merging your PR.
- **DO** fix the bugs and handle the exceptions found in Sentry.
