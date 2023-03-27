# Keystone

This document is about how to implement the Keystone integration to the extension. The basic approach is to generate and read QR codes with the Keystone device.
The current firmware version is M-10.3

## What we have discovered so far

There is an App for Core. It requires beta firmware for the time being.
Go to the Menu -> Software Waller -> Core Wallet and select it by tapping on Confirm in the top right corner.

### Create Wallet

To create a new wallet we need a QR code from keystone.
There are three dots in the top right corner, tap them, and choose the Connect Software Wallet option. It's displaying a QR code e.g.: `UR:CRYPTO-MULTI-ACCOUNTS/SOMELONGSTRING`
We need to decode that code and get addresses from it:

```js
import { URDecoder } from '@ngraveio/bc-ur';
import { CryptoMultiAccounts } from '@keystonehq/bc-ur-registry-eth';
import {
  getAddressFromXPub,
  getBech32AddressFromXPub,
} from '@avalabs/wallets-sdk';

const decoder = new URDecoder();
decoder.receivePart(qrcode2);
if (decoder.isSuccess()) {
  const ur = decoder.resultUR();
  const cryptoMultiAccounts = CryptoMultiAccounts.fromCBOR(ur.cbor);
  const masterFingerprint = cryptoMultiAccounts.getMasterFingerprint(); // _WE WILL USE THIS TO CREATE TRANSACTIONS AND OTHERS, IT IDENTIFIES THE DEVICE_
  const keys = cryptoMultiAccounts.getKeys();

  const firstKey = keys[0]; // _IT IS FOR THE STANDARD BITCOIN PATH, WE CAN'T USE THAT NOW_
  const secondKey = keys[1]; // _FOR NOW, WE NEED THE SECOND KEY TO GET BOTH OF THE ADDRESSES_

  if (secondKey) {
    const xpub = secondKey.getBip32Key(); // base58 string format xpub;
    const publicKey = secondKey.getKey();
    const keypath = secondKey.getOrigin()?.getPath(); // WE CAN CHECK THE DERIVATION PATH HERE
    const address = getAddressFromXPub(xpub, 0);
    const addressBTC = getBech32AddressFromXPub(xpub, 0, networks.bitcoin);
  }
}
```

### Create transaction sign QR Code to read by Keystone device

```js
 // EXAMPLE TRANSACTION PARAMS FOR EVM
 import QRCode from 'qrcode.react';
  import {
    EthSignRequest,
    DataType,
    } from '@keystonehq/bc-ur-registry-eth';
  import { rlp } from 'ethereumjs-util';
  import Common from '@ethereumjs/common';
  import { v4 as uuidv4 } from 'uuid';
  const getQRCode = () => {
    const _txParams = {
      nonce: 1,
      chainId: 43114,
      gasPrice: 20000,
      gasLimit: 257038,
      // data: '0x',
      to: '0x633674D1E468BbF68899cCC3EC04844251c5f719',
      value: 100000000,
    };
    const tx = Transaction.fromTxData(_txParams, {
      common: Common.custom({ chainId: 43114 }) as any, // _WE MUST SET THE CHAINID HERE OTHERWISE IT WILL BE SET TO 1_
    });
    const dataType =
      tx.type === 0 ? DataType.transaction : DataType.typedTransaction;
    let messageToSign: Buffer;
    if (tx.type === 0) {
      messageToSign = Buffer.from(
        rlp.encode((tx as Transaction).getMessageToSign(false))
      );
    } else {
      return '';
      // messageToSign = (tx as FeeMarketEIP1559Transaction).getMessageToSign( // _THIS HAS TO BE DEBUGGED, IT HAS TS ERRORS_
      //   false
      // );
    }
    const requestId = uuidv4();

    const masterFingerprint = cryptoMultiAccounts.getMasterFingerprint();
    const keyPath = "M/44'/60'/0'/0/0";
    const xfp = masterFingerprint.toString('hex');
    const ethSignRequest = EthSignRequest.constructETHRequest(
      messageToSign,
      dataType,
      keyPath,
      xfp, // master fingerprint
      requestId,
      43114, // chainId
      '0x633674D1E468BbF68899cCC3EC04844251c5f719'
    );
    const eachChunkNumberInEachQR = 400;
    const urEncoder = ethSignRequest.toUREncoder(eachChunkNumberInEachQR);
    return urEncoder.nextPart();
    }
    <QRCode renderAs="svg" value={getQRCode()} level="L" size={400} /> // _DON'T FORGET THE QR CODE HAS TO GET A WHITE BACKGROUND, OTHERWISE THE KEYSTONE CAN'T READ IT_

```

### BTC Transaction

For this, we will need a bit of tweaking for our existing psbt to add a property called `bip32Derivation`.
So first of all we will need the psbt with the new property (this code snippet was in the SendServiceBTC.ts after getting psbt => (const { fee, psbt } = createTransferTx())

```js
const qrcode2 =
  'UR:CRYPTO-MULTI-ACCOUNTS/OEADCYAYTLSFKKAOLFTAADDLOSAOWKAXHDCLAOGSGOCXINIAJYIAFRAONYGMNYAYNYLODALTSNGAMWFDATKIOEFWEYVELGBDWZBAVTAAHDCXSGGHWZPLHHSSJZIAFGYAOXJPFEHHHGKEMOLAFRPSPLGHWMTNZOFDIYLUPEJTCAJNAHTAADEHOEADAEAOAEAMTAADDYOTADLNCSDWYKAEYKAEYKAOCYAYTLSFKKAXAXAYCYIYCLSOTBASISGRIHKKJKJYJLJTIHTAADDLPTAOWKAXHDCLAXVOLBDISTTSVTKKUOSENTGOTPDTOSSSBNISIHCKMSHFOSIHKKDKQDUOVYYTWNFSHSAAHDCXIDNDDMRLQZGDQDAMJEDELFIMOXKPFHCNYKMUSNNSZCTLWFTORYFEATZEIHLUFZSGAHTAADEHOEADCSFNAOAEAMTAADDYOTADLNCSDWYKCSFNYKAEYKAOCYAYTLSFKKAXAXATTAADDYOEADLRAEWKLAWKAXAEAYCYPERKGSEOASISGRIHKKJKJYJLJTIHBKJOHSIAIAJLKPJTJYDMJKJYHSJTIEHSJPIEKNFHRERP'; // this is my account from the keystone
const decoder = new URDecoder();
decoder.receivePart(qrcode2);
if (decoder.isSuccess()) {
  const ur = decoder.resultUR();
  const cryptoMultiAccounts = CryptoMultiAccounts.fromCBOR(ur.cbor);
  const masterFingerprint = cryptoMultiAccounts.getMasterFingerprint();
  const keys = cryptoMultiAccounts.getKeys();
  const secondKey = keys[1]; // we use this key to generate the BTC tx as well, maybe it will change with a new firmware version
  if (secondKey) {
    const xpub = secondKey.getBip32Key();
    const pubKey = getAddressPublicKeyFromXPub(xpub, 0);
    const path = "M/44'/60'/0'/0/0";
    psbt?.data.inputs.forEach((input, index) => {
      psbt?.updateInput(index, {
        bip32Derivation: [
          {
            masterFingerprint,
            pubkey: pubKey,
            path,
          },
        ],
      });
    });
    console.log('psbt: ', psbt?.toHex()); // this is the psbt which is needed for the QR code
  }
}
```

After that generate the QR code:

```js
const getQRCode = () => {
  const ChunkNumberInEachQR = 400;
  const psbtFromSend =
    '70736274ff0100710200000001eff2d9e0cfab9c7d210d42c28be86e7ec0239a2588d6efc286cb249ea93acb490100000000ffffffff02e8030000000000001600146631fb42bf71fb8760b459d22b260381ce01af533e8c150000000000160014f4bd4793112fbdb22d46d092f93ca520e74cd3b9000000000001011f9c9b150000000000160014f4bd4793112fbdb22d46d092f93ca520e74cd3b9220603d2ea5a4919cac8f3bcaacd9f494285bcd982ad065a34fe2d9438d3365f4e86c71808d5cc792c0000803c000080000000800000000001000000000000'; // this is the psbt from the code above
  const cryptoPSBT = new CryptoPSBT(Buffer.from(psbtFromSend, 'hex'));
  const urEncoder = cryptoPSBT.toUREncoder(ChunkNumberInEachQR);
  return urEncoder.cbor.toString('hex');
};
```

Display the QR code:

```js
<AnimatedQRCode cbor={getQRCode()} type="crypto-psbt" />
```

### Animated QR Code

We want to use the Animated QR code component because it can be much more data in a transaction we can store there.
The possible type props (based on my knowledge so far):
"bytes", "crypto-hdkey", "crypto-keypath", "crypto-coin-info", "crypto-eckey", "crypto-output", "crypto-psbt", "crypto-account", "eth-signature" "eth-sign-request".
But we should use only these two: "eth-sign-request" for C-Chain transactions and "crypto-psbt" for BTC.
we can ask the type with:
`cryptoPSBT.getRegistryType().getType()` and `cryptoPSBT.getRegistryType().getType()`

```js
    import { AnimatedQRCode } from '@keystonehq/animated-qr';

    ...

    const getQRCode = () => {
        ...here are the same lines as before
        return urEncoder.cbor.toString('hex'); // _WE HAVE TO RETURN THE CBOR HEX STRING INSTEAD OF THE NEXTPART (AS BEFORE)_
    }

    return (
        <AnimatedQRCode cbor={getQRCode()} type="eth-sign-request" />
    )
```
