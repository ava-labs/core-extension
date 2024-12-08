import { strip0x } from '@avalabs/core-utils-sdk';
import { getBtcAddressFromPubKey } from '@avalabs/core-wallets-sdk';
import { networks, payments } from 'bitcoinjs-lib';

import { evmKey } from './fixtures/rawKeys';
import { SeedlessBtcSigner } from './SeedlessBtcSigner';

jest.mock('@avalabs/core-wallets-sdk');

describe('src/background/services/seedless/SeedlessWallet', () => {
  it('validates the provided public key', () => {
    expect(
      () =>
        new SeedlessBtcSigner(
          'la la la',
          {} as any,
          0,
          [],
          networks.bitcoin,
          {} as any,
        ),
    ).toThrow('Invalid public key');

    expect(
      () =>
        new SeedlessBtcSigner(
          evmKey.publicKey,
          {} as any,
          0,
          [],
          networks.bitcoin,
          {} as any,
        ),
    ).not.toThrow();
  });

  it('derives BTC address from public key', () => {
    jest.mocked(getBtcAddressFromPubKey).mockReturnValue('my-btc-address');

    const signer = new SeedlessBtcSigner(
      evmKey.publicKey,
      {} as any,
      0,
      [],
      networks.bitcoin,
      {} as any,
    );

    expect(signer.address).toEqual('my-btc-address');
    expect(getBtcAddressFromPubKey).toHaveBeenCalledWith(
      Buffer.from(evmKey.publicKey, 'hex'),
      networks.bitcoin,
    );
  });

  it('compresses the public key', () => {
    jest.mocked(getBtcAddressFromPubKey).mockReturnValue('my-btc-address');

    const signer = new SeedlessBtcSigner(
      evmKey.publicKey,
      {} as any,
      0,
      [],
      networks.bitcoin,
      {} as any,
    );

    const pubKey = Buffer.from(strip0x(evmKey.publicKey), 'hex');
    const parity = (pubKey[64] ?? 0) & 1;

    const compressed = pubKey.subarray(0, 33);
    compressed[0] = 2 | parity;

    expect(signer.publicKey).toEqual(compressed);
  });

  describe('.sign()', () => {
    const paymentScript = Buffer.from('1234', 'hex');
    const input = { value: 500, txHash: 'txHash', sequence: 1, index: 0 };
    const input2 = { value: 500, txHash: 'txHash', sequence: 1, index: 1 };
    const output = { value: 1000, script: Buffer.from('0xabcd', 'hex') };
    const psbt: any = {
      version: 2,
      locktime: 30,
      txInputs: [input, input2],
      txOutputs: [output],
    };
    const signature = Buffer.from(Array(65)).toString('hex');
    const session: any = {
      signBtc: jest.fn().mockResolvedValue({
        data() {
          return {
            signature,
          };
        },
      }),
    };

    const getExpectedSignPayload = (index) => ({
      sig_kind: {
        Segwit: {
          input_index: index,
          script_code: `0x${paymentScript.toString('hex')}`,
          value: psbt.txInputs[index].value,
          sighash_type: 'All',
        },
      },
      tx: {
        version: psbt.version,
        lock_time: psbt.locktime,
        input: psbt.txInputs.map((utxo) => ({
          script_sig: '',
          witness: [],
          previous_output: `${utxo.txHash}:${utxo.index}`,
          sequence: psbt.txInputs[index].sequence,
        })),
        output: [
          {
            value: output.value,
            script_pubkey: output.script.toString('hex'),
          },
        ],
      },
    });

    let signer: SeedlessBtcSigner;

    beforeEach(() => {
      jest.spyOn(payments, 'p2pkh').mockReturnValue({
        output: paymentScript,
      });

      signer = new SeedlessBtcSigner(
        evmKey.publicKey,
        psbt,
        0,
        psbt.txInputs,
        networks.bitcoin,
        session,
      );
    });

    it('constructs the RPC request', async () => {
      const mockedPubKey = Buffer.from('0x1234', 'hex');
      // eslint-disable-next-line
      // @ts-ignore
      signer.publicKey = mockedPubKey;

      await signer.sign();

      expect(payments.p2pkh).toHaveBeenCalledWith({
        pubkey: mockedPubKey,
        network: networks.bitcoin,
      });
    });

    it('raises an error if RPC request cannot be created', async () => {
      await signer.sign();

      jest.spyOn(payments, 'p2pkh').mockImplementation(() => {
        throw new Error('nope');
      });

      await expect(signer.sign()).rejects.toThrow('nope');
    });

    it('signs the specified input through signer session', async () => {
      await signer.sign();

      expect(session.signBtc).toHaveBeenCalledWith(
        signer.address,
        getExpectedSignPayload(0),
      );

      const nextInputSigner = new SeedlessBtcSigner(
        evmKey.publicKey,
        psbt,
        1,
        psbt.txInputs,
        networks.bitcoin,
        session,
      );

      await nextInputSigner.sign();

      expect(session.signBtc).toHaveBeenCalledWith(
        nextInputSigner.address,
        getExpectedSignPayload(1),
      );
    });

    it('validates the signature length', async () => {
      session.signBtc.mockResolvedValueOnce({
        data: () => ({
          signature: '0x1234',
        }),
      });

      await expect(signer.sign()).rejects.toThrow(
        /Unexpected signature length/,
      );
    });

    it('trims the recovery byte off the signature', async () => {
      const mockedSignature = `0x${'1234567890'.repeat(13)}`;
      session.signBtc.mockResolvedValueOnce({
        data: () => ({
          signature: mockedSignature,
        }),
      });

      expect(await signer.sign()).toEqual(
        Buffer.from(strip0x(mockedSignature), 'hex').subarray(0, 64),
      );
    });
  });
});
