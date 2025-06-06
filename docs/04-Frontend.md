# Frontend

## Overview

The extension frontend is a React application using built-in React tools for state management. It communicates with the background script and some hardware devices such as Ledger (since WebUSB is not available on the background script).

## Entry points

Even though we only have a single bundle, the frontend has multiple entry points created during the build process. You can use the utils in `src/utils/isSpecificContextContainer.ts` to determine the current context the frontend is running in.

- **POPUP** The popup is the main extension UI. It's displayed when the user clicks on the extension's icon in the browser navigation bar. Due to browser restrictions, it can't be opened programmatically (imagine how annoying would that be for a user).
- **CONFIRM** The confirmation UIs are the standalone popup windows that are triggered by Dapp interactions. They are used for requesting the user's consent on various actions like approving transactions or website connections.
- **HOME** The fullscreen version of the extension. Only used for onboarding at the moment. It's opened automatically when the user has installed the extension.

## Component library

The UI is using the [K2](https://github.com/ava-labs/k2-components) component library.
The UX team and the frontend team have made the decision to align all components and screens to use K2 to ease development and provide consistency across the Core suite.

When you implement designs from Figma, please be mindful of a couple of things:
If you find yourself overwriting MUI classes or default colors, stop and ask the question "Why are Figma and K2 not aligned? Should Figma be updated or should we add a new variant to K2?". Consistency is key and is the main goal of using a component library. If you create one-offs, even if Figma deviated from the standard, consistency will not be met.<br/>
**Ask!** Talk to UX and ask in the `k2-product-design-system` Slack channel.

You can find the deployed storybook version of K2 here: [https://k2-components.pages.dev/](https://k2-components.pages.dev/)

## DOs and DON'Ts

- **DO NOT** store data on the frontend in localStorage to avoid accidental data leaks. Use the background script with encryption instead.
- **DO NOT** use plain input fields to show sensitive data. Chrome caches their content on the disk unencrypted. Use a password field instead!
- **DO** try to avoid one-off components when implementing the UI. We have a component library for a reason. When in doubt, ask!
- **DO** keep it simple. Frontend should be light, background script should be complex. The background code is also a lot easier to reuse and share with other apps like Core Mobile.
