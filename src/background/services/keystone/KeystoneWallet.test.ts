import {
  DataType,
  ETHSignature,
  EthSignRequest,
} from '@keystonehq/bc-ur-registry-eth';
import { BigNumber } from 'ethers';
import { KeystoneWallet } from './KeystoneWallet';
import { KeystoneTransport } from './models';
import { serializeTransaction } from 'ethers/lib/utils';
import { FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx';

jest.mock('ethers/lib/utils', () => {
  const etherUtils = jest.requireActual('ethers/lib/utils');

  return {
    ...etherUtils,
    serializeTransaction: jest.fn(),
  };
});

const FIXTURES = {
  LEGACY_TRANSACTION_REQUEST: {
    nonce: 7,
    chainId: 5,
    gasPrice: BigNumber.from('0x215b33677b'),
    gasLimit: 21000,
    to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
    value: '0x5af3107a4000',
  },
  EIP_1559_TRANSACTION_REQUEST: {
    nonce: 7,
    chainId: 5,
    maxFeePerGas: BigNumber.from('0x215b33677b'),
    maxPriorityFeePerGas: BigNumber.from('0x12a05f200'),
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
    'hex'
  ),
};

const keystoneTransport: KeystoneTransport = {
  requestSignature: jest.fn().mockResolvedValue(FIXTURES.SIGNATURE_RESPONSE),
};
const fingerprint = '80d3bb22';
const currentChainId = 1337;
const tabId = 852;

describe('src/background/services/keystone/KeystoneWallet.ts', () => {
  describe('.signTransaction()', () => {
    let wallet: KeystoneWallet;

    beforeEach(() => {
      wallet = new KeystoneWallet(
        fingerprint,
        0,
        keystoneTransport,
        currentChainId,
        tabId
      );
    });

    it('builds proper transaction request', async () => {
      wallet.signTransaction(FIXTURES.LEGACY_TRANSACTION_REQUEST);
      expect(keystoneTransport.requestSignature).toHaveBeenCalledWith(
        FIXTURES.LEGACY_SIGNATURE_REQUEST,
        tabId
      );
    });

    describe('when transaction does not set chainId explicitly', () => {
      const { chainId, ...txRequest } = FIXTURES.LEGACY_TRANSACTION_REQUEST; // eslint-disable-line @typescript-eslint/no-unused-vars

      it(`falls back to the current network's chainId if not explicitly set in the transaction`, async () => {
        await wallet.signTransaction(txRequest);

        expect(serializeTransaction).toHaveBeenCalledWith(
          expect.objectContaining({ chainId: currentChainId }),
          expect.anything()
        );
      });
    });

    it('builds the signature using received response', async () => {
      jest.spyOn(ETHSignature, 'fromCBOR');

      await wallet.signTransaction(FIXTURES.LEGACY_TRANSACTION_REQUEST);

      expect(ETHSignature.fromCBOR).toHaveBeenCalledWith(
        FIXTURES.SIGNATURE_RESPONSE
      );
    });

    it('uses ECDSA outputs to serialize the transaction', async () => {
      const { chainId, gasLimit, gasPrice, nonce, to, value } =
        FIXTURES.LEGACY_TRANSACTION_REQUEST;

      await wallet.signTransaction(FIXTURES.LEGACY_TRANSACTION_REQUEST);

      const r =
        '0xc60a745b056a2851dbfd28cdfa7e7069ebb76cebb4a18adb9b715db37f955d85';
      const s =
        '0x659cd1b54ea949317aa685831bcf241bc58089747437a8e49759158b5982cc08';
      const v = 46;

      expect(serializeTransaction).toHaveBeenCalledWith(
        { chainId, gasLimit, gasPrice, nonce, to, value },
        { r, s, v }
      );
    });

    describe('for legacy transactions', () => {
      it('uses Transaction.fromTxData', async () => {
        jest.spyOn(Transaction, 'fromTxData');

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
          expect.anything()
        );
      });
    });

    describe('for EIP-1559 transactions', () => {
      it('uses FeeMarketEIP1559Transaction.fromTxData', async () => {
        jest.spyOn(FeeMarketEIP1559Transaction, 'fromTxData');

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
          expect.anything()
        );
      });

      it('builds a proper EIP-1559 transaction request', async () => {
        wallet.signTransaction(FIXTURES.EIP_1559_TRANSACTION_REQUEST);
        expect(keystoneTransport.requestSignature).toHaveBeenCalledWith(
          FIXTURES.EIP_1559_SIGNATURE_REQUEST,
          tabId
        );
      });
    });
  });
});
