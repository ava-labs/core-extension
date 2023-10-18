# Fireblocks - open questions

## Importing accounts

When user submits the API Key and the Secret Key, we’ll possibly get access to multiple vault accounts.

These accounts then have dedicated wallets for different assets. Each of these asset wallets then will have _at least_ one address. Some may have multiple addresses (i.e. BTC).

Also, newly created vault accounts will have no asset wallets added and therefore will have no addresses defined at all.

So there are multiple questions here:

- How do we choose which vault account to import?
- Should we allow importing multiple vault accounts?
- How do we ensure the selected vault account(s) have at least the EVM address defined?
- If an asset (i.e. BTC) has multiple addresses defined, how do we choose the proper one?
  - Here, we should probably choose the address denoted as `permanent`.
- _probably more will arise_

## Asset IDs

Fireblocks have their own "symbols" for each asset. For example:

- ETH Goerli is `ETH_TEST3`
- Avalanche Fuji is `AVAXTEST`.

For BTC this is not an issue, because there are only two symbols: `BTC` for mainnet and `BTC_TEST` for testnet.

If we use WalletConnect for EVM transactions, things are still simple - nothing to worry about here.

However, if we ever want to support EVM through Fireblocks API - things get complicated, as we have no way of knowing the Fireblocks asset IDs for network-native tokens.

There is a `/supported_assets` on the API, but it's only helpful for non-native tokens. For native assets, it does not show the contract address that we could use to match the tokens.

## Avalanche Bridge

Bridging `BTC` -> `BTC.b` _SimplyWorks™_, but the `BTC.b` token does not show up in the Fireblocks console automatically.

The token needs to be added manually by doing the following:

1. Go to a vault account
2. Click `+ Asset Wallet`
3. Type random characters in the search field until it shows an `Add a non-listed ERC20 asset` option
4. In the dialog:
   - **For Fuji:** specify `Avalanche Fuji` as the Blockchain Network and `0x0f2071079315Ba5a1c6d5b532a01a132c157AC83` as the contract address.
   - **For Mainnet:** specify `Avalanche` as the Blockchain Network and `0x152b9d0FdC40C096757F570A51E494bd4b943E50` as the contract address.

We should probably inform the users about that when they start bridging using Fireblocks account.
