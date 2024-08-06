# Storage

## Overview

The browser extension uses the [chrome.storage](https://developer.chrome.com/docs/extensions/reference/storage/) API for data persistence.

The `StorageService` exposes a set of methods to utilize this API on the background script.

## Encryption

Core generates a random storage encryption key during onboarding. This encryption key is used for encrypting all data stored in `chrome.storage.local`, besides a couple of very specific exceptions like the device ID for analytics which should stay the same across onboardings. We use `nacl.secretbox` for encryption.

The encryption key is also stored encrypted in storage at rest using the password set by the user during onboarding. The password is hashed using `Scrypt KDF` from the `@noble/hashes/scrypt` library.

To check the exact implementations out, go here: [`src/background/services/storage/utils/crypto.ts`](https://github.com/ava-labs/core-extension/blob/main/src/background/services/storage/utils/crypto.ts)

## DOs and DON'Ts

- **DO NOT** use the `chrome.storage` API directly outside of the `StorageService`
- **DO NOT** use other storage for extension state than `chrome.storage`. We want to keep the state consistent, in a single place.
- **DO NOT** store data on the frontend. ie. in localStorage
- **DO** always encrypt the stored data. Unencrypted data can be manipulated by malicious applications directly on the disk. E.g: An attacker changes an address in the address book to theirs. Next time the TX goes to the attacker instead, without the user even noticing it.
- **DO** clean up everything in storage when the user resets the extension.
