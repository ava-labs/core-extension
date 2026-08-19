# Storage

## Overview

The browser extension uses the [chrome.storage](https://developer.chrome.com/docs/extensions/reference/storage/) API for data persistence.

The `StorageService` exposes a set of methods to utilize this API on the service worker. It lives in `packages/service-worker/src/services/storage`.

## Encryption

Core generates a random storage encryption key during onboarding. This encryption key is used for encrypting all data stored in `chrome.storage.local`, besides a couple of very specific exceptions like the device ID for analytics which should stay the same across onboardings. We use `nacl.secretbox` for encryption.

The encryption key is also stored encrypted in storage at rest using the password set by the user during onboarding. The password is hashed using `Scrypt KDF` from the `@noble/hashes/scrypt` library.

To check the exact implementations out, go here: [`packages/service-worker/src/services/storage/utils/crypto.ts`](https://github.com/ava-labs/core-extension/blob/main/packages/service-worker/src/services/storage/utils/crypto.ts)

## Schema migrations

Stored data is versioned. Every top-level storage key that has ever changed shape has an entry in [`schemaMigrations/schemaMap.ts`](https://github.com/ava-labs/core-extension/blob/main/packages/service-worker/src/services/storage/schemaMigrations/schemaMap.ts), declaring its `latestVersion` and the list of migrations that lead up to it.

On read, `migrateToLatest` compares the `version` field on the stored payload with the schema's `latestVersion` and pipes the data through every intermediate migration in order. Data without a `version` field is treated as version 1. On write, `getDataWithSchemaVersion` stamps the current `latestVersion` onto new records.

When you change the shape of anything persisted:

1. Add a `<key>_v<n>.ts` migration under `schemaMigrations/migrations/`.
2. Register it in `SCHEMA_MAP` and bump that key's `latestVersion`.
3. Cover it with a test — a migration that throws leaves the user with an unreadable wallet, and there is no way to fix it after the fact on a user's machine.

Migrations may depend on another storage key being migrated first; that is what the `loadDependency` argument of `migrateToLatest` is for.

## DOs and DON'Ts

- **DO NOT** use the `chrome.storage` API directly outside of the `StorageService`
- **DO NOT** use other storage for extension state than `chrome.storage`. We want to keep the state consistent, in a single place.
- **DO NOT** store data on the frontend. ie. in localStorage
- **DO** always encrypt the stored data. Unencrypted data can be manipulated by malicious applications directly on the disk. E.g: An attacker changes an address in the address book to theirs. Next time the TX goes to the attacker instead, without the user even noticing it.
- **DO** clean up everything in storage when the user resets the extension.
