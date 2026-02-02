import {
  DataType,
  ETHSignature,
  EthSignRequest,
} from '@keystonehq/bc-ur-registry-eth';
import * as hwTransportWebusb from '@keystonehq/hw-transport-webusb';
import KeystoneUSBAvalancheSDK from '@keystonehq/hw-app-avalanche';
import { KeystoneWallet } from './KeystoneWallet';
import { KeystoneTransport } from '@core/types';
import { FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx';
import { UnsignedTx } from '@avalabs/avalanchejs';

jest.mock('@keystonehq/hw-transport-webusb');
jest.mock('@keystonehq/hw-app-avalanche');

const FIXTURES = {
  LEGACY_TRANSACTION_REQUEST: {
    nonce: 7,
    chainId: 5,
    gasPrice: BigInt('0x215b33677b'),
    gasLimit: 21000,
    to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
    value: '0x5af3107a4000',
  },
  EIP_1559_TRANSACTION_REQUEST: {
    nonce: 7,
    chainId: 5,
    maxFeePerGas: BigInt('0x215b33677b'),
    maxPriorityFeePerGas: BigInt('0x12a05f200'),
    gasLimit: 21000,
    type: 2, // EIP-1559 tx
    to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
    value: '0x5af3107a4000',
  },
  LEGACY_SIGNATURE_REQUEST: {
    cbor: 'a501d825500000000000000000000000000000000002582bea0785215b33677b82520894473b6494e2632ec1c9f90ce05327e96e30767638865af3107a4000800580800301040505d90130a2018a182cf5183cf500f500f400f4021a80d3bb22',
    type: 'eth-sign-request',
  },
  EIP_1559_SIGNATURE_REQUEST: {
    cbor: 'a501d825500000000000000000000000000000000002583102ef050785012a05f20085215b33677b82520894473b6494e2632ec1c9f90ce05327e96e30767638865af3107a400080c00304040505d90130a2018a182cf5183cf500f500f400f4021a80d3bb22',
    type: 'eth-sign-request',
  },
  SIGNATURE_RESPONSE: Buffer.from(
    'a201d8255095a1762eef6e41bdb339c2a15b5d8d70025841c60a745b056a2851dbfd28cdfa7e7069ebb76cebb4a18adb9b715db37f955d85659cd1b54ea949317aa685831bcf241bc58089747437a8e49759158b5982cc082e',
    'hex',
  ),
  XPUB: 'xpub661MyMwAqRbcGSmFWVZk2h773zMrcPFqDUWi7cFRpgPhfn7y9HEPzPsBDEXYxAWfAoGo7E7ijjYfB3xAY86MYzfvGLDHmcy2epZKNeDd4uQ',
  XPUB_XP:
    'xpub661MyMwAqRbcFFDMuFiGQmA1EqWxxgDLdtNvxxiucf9qkfoVrvwgnYyshxWoewWtkZ1aLhKoVDrpeDvn1YRqxX2szhGKi3UiSEv1hYRMF8q',
  P_CHAIN_TX: {
    codecId: '0',
    vm: 'PVM',
    txBytes:
      '0x0000000000220000000100000000000000000000000000000000000000000000000000000000000000000000000221e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000000186a000000000000000000000000100000001512e7191685398f00663e12197a3d8f6012d9ea321e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000005a59edd00000000000000000000000100000001512e7191685398f00663e12197a3d8f6012d9ea300000001c602a764abcc0a2e6a301b423877fc6201f0fe44864a40b5e9b4d94b048edbfc0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000000005a739b8000000010000000000000000',
    utxos: [
      '0xc602a764abcc0a2e6a301b423877fc6201f0fe44864a40b5e9b4d94b048edbfc0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000005a739b800000000000000000000000100000001512e7191685398f00663e12197a3d8f6012d9ea3',
    ],
    addressMaps: [[['0x512e7191685398f00663e12197a3d8f6012d9ea3', 0]]],
    credentials: [
      [
        '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      ],
    ],
  },
  P_CHAIN_REQUEST_UR:
    'UR:AVAX-SIGN-REQUEST/ONADTPDAGDMDAEJNAYDWKNFDRPLAFHIOBDTDRPNNSOAOHKADDMAEAEAEAEAECPAEAEAEADAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAOCLVAJKCHSBSSRNDRWMAEIOKNTBFGDIKSPDYKCPJYRHTBAHURDAMEPRDYDIPDKIZMAEAEAEATAEAEAEAEAEADLNNBAEAEAEAEAEAEAEAEAEAEAEADAEAEAEADGYDMJSMEISGUMKWTAMIAVYCLMSOTTPYNADDPNNOTCLVAJKCHSBSSRNDRWMAEIOKNTBFGDIKSPDYKCPJYRHTBAHURDAMEPRDYDIPDKIZMAEAEAEATAEAEAEAEAHONNNUTAEAEAEAEAEAEAEAEAEAEAEADAEAEAEADGYDMJSMEISGUMKWTAMIAVYCLMSOTTPYNADDPNNOTAEAEAEADSWAOOSIEPYSFBKDMIMDYCWFWETKTZTIDADWTZEFYLNGEFZREWLQZTAGRAAMNUYZTAEAEAEADCLVAJKCHSBSSRNDRWMAEIOKNTBFGDIKSPDYKCPJYRHTBAHURDAMEPRDYDIPDKIZMAEAEAEAHAEAEAEAEAHOSESROAEAEAEADAEAEAEAEAEAEAEAEAXCYBGGDRPRFAMKSJLKSJOKPIDENENEHGTKKGTKTFPJSGMIDIAFGFGFYGTKPFGINFLGYJNFPEHFEJSHGKSKSIOFYGSIEJYGLKOKSKSINKPIAIYESJSJEIYJLHFJPKOKTIOJTHKKKJKISKSHGJLIHKTHGJYJEHTEHHSGSISGRJLHFFYJPJOIHFYKOJTEHHKGMJSKSHDEYJKKNISFLGRINEOGOINGUFEKOEHISHKGMGTFGETJSATAEPACSDIZS',
  P_CHAIN_RESPONSE_UR:
    'UR:AVAX-SIGNATURE/OEADGDMDAEJNAYDWKNFDRPLAFHIOBDTDRPNNSOAOHDFPNSLBAXDYGWVWKOCSHTPESARPLKDMCAMNTACHVLFEHDMETEKIAYJKKOMTYKOSJEVSBAGOHGHSCNGSQZRYPYIMTSDIOLHSSPVTPLFYAYHYBBPMZTSOPSBGSOURJPRHWNINADSABWWZOL',
  P_CHAIN_SIGNATURE:
    '9c7f03304fe576185aafc2b68c2e1d8ed917e3455891d37d08737696f5a76be80e555761234cb4bdab6ad727a661c8e0ae44085e14adfcc9ac12c9df72b9f16901',
  P_CHAIN_SIGNED_TX: {
    codecId: '0',
    vm: 'PVM',
    txBytes:
      '0x0000000000220000000100000000000000000000000000000000000000000000000000000000000000000000000221e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000000000186a000000000000000000000000100000001512e7191685398f00663e12197a3d8f6012d9ea321e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000005a59edd00000000000000000000000100000001512e7191685398f00663e12197a3d8f6012d9ea300000001c602a764abcc0a2e6a301b423877fc6201f0fe44864a40b5e9b4d94b048edbfc0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000000005a739b8000000010000000000000000',
    utxos: [
      '0xc602a764abcc0a2e6a301b423877fc6201f0fe44864a40b5e9b4d94b048edbfc0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000005a739b800000000000000000000000100000001512e7191685398f00663e12197a3d8f6012d9ea3',
    ],
    addressMaps: [[['0x512e7191685398f00663e12197a3d8f6012d9ea3', 0]]],
    credentials: [
      [
        '9c7f03304fe576185aafc2b68c2e1d8ed917e3455891d37d08737696f5a76be80e555761234cb4bdab6ad727a661c8e0ae44085e14adfcc9ac12c9df72b9f16901',
      ],
    ],
  },
};

let keystoneTransport: KeystoneTransport;
const fingerprint = '80d3bb22';
const currentChainId = 1337;
const tabId = 852;

describe('src/background/services/keystone/KeystoneWallet.ts', () => {
  let wallet: KeystoneWallet;
  let keystone3Wallet: KeystoneWallet;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ETHSignature, 'fromCBOR');
    jest.spyOn(Transaction, 'fromTxData');
    jest
      .spyOn(FeeMarketEIP1559Transaction, 'fromTxData')
      .mockImplementation(() => new FeeMarketEIP1559Transaction({}));

    keystoneTransport = {
      requestSignature: jest
        .fn()
        .mockResolvedValue(FIXTURES.SIGNATURE_RESPONSE),
    };

    wallet = new KeystoneWallet(
      fingerprint,
      0,
      keystoneTransport,
      currentChainId,
      tabId,
    );

    keystone3Wallet = new KeystoneWallet(
      fingerprint,
      0,
      keystoneTransport,
      currentChainId,
      tabId,
      FIXTURES.XPUB,
      FIXTURES.XPUB_XP,
    );
  });

  describe('.signTransaction()', () => {
    it('builds proper transaction request', async () => {
      await wallet.signTransaction(FIXTURES.LEGACY_TRANSACTION_REQUEST);
      expect(keystoneTransport.requestSignature).toHaveBeenCalledWith(
        FIXTURES.LEGACY_SIGNATURE_REQUEST,
        tabId,
      );
    });

    describe('when transaction does not set chainId explicitly', () => {
      const { chainId, ...txRequest } = FIXTURES.LEGACY_TRANSACTION_REQUEST;

      it(`falls back to the current network's chainId if not explicitly set in the transaction`, async () => {
        wallet = new KeystoneWallet(
          fingerprint,
          0,
          keystoneTransport,
          chainId,
          tabId,
        );

        await wallet.signTransaction(txRequest);

        expect(Transaction.fromTxData).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            common: expect.objectContaining({
              _chainParams: expect.objectContaining({ chainId: chainId }),
            }),
          }),
        );
      });
    });

    it('builds the signature using received response', async () => {
      await wallet.signTransaction(FIXTURES.LEGACY_TRANSACTION_REQUEST);

      expect(ETHSignature.fromCBOR).toHaveBeenCalledWith(
        FIXTURES.SIGNATURE_RESPONSE,
      );
    });

    it('uses ECDSA outputs to serialize the transaction', async () => {
      const { to, value } = FIXTURES.LEGACY_TRANSACTION_REQUEST;

      await wallet.signTransaction(FIXTURES.LEGACY_TRANSACTION_REQUEST);

      const r =
        '0xc60a745b056a2851dbfd28cdfa7e7069ebb76cebb4a18adb9b715db37f955d85';
      const s =
        '0x659cd1b54ea949317aa685831bcf241bc58089747437a8e49759158b5982cc08';
      const v = 46;

      expect(Transaction.fromTxData).toHaveBeenCalledWith(
        {
          data: undefined,
          gasLimit: '0x5208',
          gasPrice: '0x215b33677b',
          nonce: '0x7',
          to,
          value,
          r,
          s,
          v,
        },
        expect.anything(),
      );
    });

    describe('for legacy transactions', () => {
      it('uses Transaction.fromTxData', async () => {
        await wallet.signTransaction(FIXTURES.LEGACY_TRANSACTION_REQUEST);

        expect(Transaction.fromTxData).toHaveBeenCalled();
      });

      it('uses DataType.transaction to encode the signature request', async () => {
        jest.spyOn(EthSignRequest, 'constructETHRequest');

        await wallet.signTransaction(FIXTURES.LEGACY_TRANSACTION_REQUEST);

        expect(EthSignRequest.constructETHRequest).toHaveBeenCalledWith(
          expect.anything(),
          DataType.transaction,
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
        );
      });
    });

    describe('for EIP-1559 transactions', () => {
      it('uses FeeMarketEIP1559Transaction.fromTxData', async () => {
        await wallet.signTransaction(FIXTURES.EIP_1559_TRANSACTION_REQUEST);

        expect(FeeMarketEIP1559Transaction.fromTxData).toHaveBeenCalled();
      });

      it('uses DataType.typedTransaction to encode the signature request', async () => {
        jest.spyOn(EthSignRequest, 'constructETHRequest');

        await wallet.signTransaction(FIXTURES.EIP_1559_TRANSACTION_REQUEST);

        expect(EthSignRequest.constructETHRequest).toHaveBeenCalledWith(
          expect.anything(),
          DataType.typedTransaction,
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
        );
      });
    });
  });

  describe('keystone3.signTransaction()', () => {
    beforeEach(() => {
      jest
        .spyOn(hwTransportWebusb, 'createKeystoneTransport')
        .mockResolvedValue({} as any);
      (KeystoneUSBAvalancheSDK as unknown as jest.Mock).mockImplementation(
        () => {
          return {
            signTx: jest.fn().mockResolvedValue([FIXTURES.P_CHAIN_SIGNATURE]),
          };
        },
      );
    });

    it('when signing a transaction with p/x chain', async () => {
      const unsignedXChainTx = UnsignedTx.fromJSON(
        JSON.stringify(FIXTURES.P_CHAIN_TX),
      );
      const pChainRes = await keystone3Wallet.signTx({
        tx: unsignedXChainTx,
      });

      expect(pChainRes).toEqual(
        UnsignedTx.fromJSON(JSON.stringify(FIXTURES.P_CHAIN_SIGNED_TX)),
      );
    });
  });
});
