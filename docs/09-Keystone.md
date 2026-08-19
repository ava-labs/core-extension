# Keystone

## Overview

Core supports Keystone hardware wallets. Unlike Ledger, Keystone devices are air-gapped by default: the extension and the device exchange [BC-UR](https://developer.blockchaincommons.com/ur/) encoded payloads through animated QR codes. Newer devices (Keystone 3 Pro) can additionally be connected over WebUSB, which removes the QR scanning step.

Both transports are handled behind the same `KeystoneTransport` interface (`packages/types/src/keystone.ts`), so the wallet implementations do not need to care which one is in use:

```ts
interface KeystoneTransport {
  requestSignature(cbor: CBOR, tabId?: number): Promise<Buffer>;
}
```

## Two device generations, two secret types

| Secret type               | Transport         | Notes                                                                    |
| ------------------------- | ----------------- | ------------------------------------------------------------------------ |
| `SecretType.Keystone`     | QR                | Older devices. EVM and Bitcoin only.                                     |
| `SecretType.Keystone3Pro` | USB (QR fallback) | Keystone 3 Pro. Also stores an Avalanche extended public key (`xpubXP`). |

`KeystoneWallet` branches on the presence of `xpubXP` to decide whether it can talk to the device over USB (`packages/service-worker/src/services/keystone/KeystoneWallet.ts`).

Accounts onboarded before Avalanche X/P support was added may be missing public keys. The `KEYSTONE_MIGRATE_MISSING_PUBKEYS` handler backfills them by reconnecting to the device over USB.

## QR transport

`KeystoneService` (`packages/service-worker/src/services/keystone/KeystoneService.ts`) is the service-worker side of the QR transport. It is intentionally thin — it owns no crypto, only the request/response correlation:

1. A wallet calls `requestSignature(cbor, tabId)`. The service generates a `requestId` and pushes a `KeystoneEvent.DEVICE_REQUEST` event to the frontend.
2. The frontend renders the payload as an animated QR code for the user to scan with their device.
3. The user approves on the device, which displays its own animated QR code containing the signature.
4. The frontend scans it and calls the `keystoneSubmitSignature` handler, which feeds the response back into the service.
5. `requestSignature` resolves with the first response whose `requestId` matches.

Because the pending request only lives in an RxJS subject, an unanswered request does not survive a service worker restart. The subscription is set up in `onUnlock` and torn down in `onLock`.

The QR code must be rendered on a white background — the device cannot read it otherwise.

## USB transport

`KeystoneUsbProvider` (`packages/ui/src/contexts/KeystoneUsbProvider.tsx`) owns the WebUSB connection, for the same reason as Ledger: WebUSB is not available in the service worker. It exposes device selection, extended public key retrieval, and the master fingerprint to the onboarding flow.

### Firmware version quirk

The firmware version reported over USB is intentionally offset by 10 major versions — a device that displays `2.4.2` in its own UI reports `12.4.2` through `getConfig()`. `parseKeystoneFirmwareVersion` (`packages/ui/src/contexts/utils/parseKeystoneFirmwareVersion.ts`) normalizes it back to what the user sees on the device, so never show the raw value in the UI.

## Signing

### EVM

`KeystoneWallet` builds an `EthSignRequest` from the transaction. Legacy transactions have to be RLP-encoded before being passed in; EIP-1559 transactions must not be. The `chainId` has to be set explicitly via `Common.custom()`, otherwise it defaults to mainnet Ethereum — and EIP-1559 transactions additionally need `hardfork: Hardfork.London`, or the fee properties are rejected.

The response comes back as an `ETHSignature`, whose 65-byte payload splits into `r` (bytes 0–32), `s` (bytes 32–64), and `v` (the remainder).

The derivation path sent to the device is currently hardcoded to BIP44 (`M/44'/60'/0'/0/<accountIndex>`). Keystone accounts onboarded with a different derivation scheme are not supported.

### Bitcoin

`BitcoinKeystoneWallet` wraps the PSBT in a `CryptoPSBT`. Before sending, every input needs a `bip32Derivation` entry containing the master fingerprint, the public key, and the derivation path — without it the device cannot tell which key to sign with.

## Most common issues

- The device is on the wrong app or has not been unlocked. Keystone will simply not react to the QR code.
- Animated QR codes that carry a large payload can take a while to transfer. Do not lower the chunk size unless you have tested it against a real device.
- A USB connection can be claimed by another tab or application; the user may need to close other Core windows before connecting.

## DOs and DON'Ts

- **DO NOT** sign on the frontend. The frontend only relays QR payloads and USB responses; signing logic belongs in `KeystoneWallet` / `BitcoinKeystoneWallet` on the service worker.
- **DO NOT** display the raw firmware version reported over USB. Run it through `parseKeystoneFirmwareVersion` first.
- **DO** assume a signature request may never be answered — the user can walk away from an air-gapped device.
