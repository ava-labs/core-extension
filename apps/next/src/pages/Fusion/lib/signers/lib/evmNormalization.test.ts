import { EvmTransactionRequest } from '@avalabs/fusion-sdk';

import {
  normalizeTransaction,
  normalizeTransactionsBatch,
} from './evmNormalization';

const baseTx: EvmTransactionRequest = {
  from: '0x1234567890abcdef1234567890abcdef12345678',
  chainId: '43114',
};

describe('normalizeTransaction', () => {
  it('converts bigint values to hex strings', () => {
    const tx: EvmTransactionRequest = {
      ...baseTx,
      value: 1000000000000000000n,
      gas: 21000n,
    };

    const result = normalizeTransaction(tx);

    expect(result.value).toBe('0xde0b6b3a7640000');
    expect(result.gas).toBe('0x5208');
  });

  it('converts number values to hex strings', () => {
    const tx: EvmTransactionRequest = {
      ...baseTx,
      nonce: 42,
      type: 2,
    };

    const result = normalizeTransaction(tx);

    expect(result.nonce).toBe('0x2a');
    expect(result.type).toBe('0x2');
  });

  it('removes null values from the result', () => {
    const tx: EvmTransactionRequest = {
      ...baseTx,
      to: null,
      gasPrice: null,
    };

    const result = normalizeTransaction(tx);

    expect(result).not.toHaveProperty('to');
    expect(result).not.toHaveProperty('gasPrice');
  });

  it('removes undefined values from the result', () => {
    const tx: EvmTransactionRequest = {
      ...baseTx,
      data: undefined,
      maxFeePerGas: undefined,
    };

    const result = normalizeTransaction(tx);

    expect(result).not.toHaveProperty('data');
    expect(result).not.toHaveProperty('maxFeePerGas');
  });

  it('preserves string values unchanged', () => {
    const tx: EvmTransactionRequest = {
      ...baseTx,
      data: '0xabcdef',
      to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    };

    const result = normalizeTransaction(tx);

    expect(result.from).toBe('0x1234567890abcdef1234567890abcdef12345678');
    expect(result.chainId).toBe('43114');
    expect(result.data).toBe('0xabcdef');
    expect(result.to).toBe('0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef');
  });

  it('normalizes a full transaction payload', () => {
    const tx: EvmTransactionRequest = {
      from: '0x1234567890abcdef1234567890abcdef12345678',
      to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      chainId: '43114',
      value: 1000000000000000000n,
      gas: 21000n,
      nonce: 5,
      type: 2,
      maxFeePerGas: 25000000000n,
      maxPriorityFeePerGas: 1500000000n,
      data: '0x',
      gasPrice: null,
    };

    const result = normalizeTransaction(tx);

    expect(result).toEqual({
      from: '0x1234567890abcdef1234567890abcdef12345678',
      to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      chainId: '43114',
      value: '0xde0b6b3a7640000',
      gas: '0x5208',
      nonce: '0x5',
      type: '0x2',
      maxFeePerGas: '0x5d21dba00',
      maxPriorityFeePerGas: '0x59682f00',
      data: '0x',
    });
  });
});

describe('normalizeTransactionsBatch', () => {
  const tx1: EvmTransactionRequest = {
    ...baseTx,
    value: 100n,
    to: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  };

  const tx2: EvmTransactionRequest = {
    ...baseTx,
    value: 200n,
    to: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  };

  const tx3: EvmTransactionRequest = {
    ...baseTx,
    value: 300n,
    to: '0xcccccccccccccccccccccccccccccccccccccccc',
  };

  it('throws error for empty array', () => {
    expect(() => normalizeTransactionsBatch([])).toThrow(
      'At least two transactions are required for a batch call.',
    );
  });

  it('throws error for single transaction', () => {
    expect(() => normalizeTransactionsBatch([tx1])).toThrow(
      'At least two transactions are required for a batch call.',
    );
  });

  it('normalizes an array of two transactions', () => {
    const result = normalizeTransactionsBatch([tx1, tx2]);

    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('0x64');
    expect(result[0].to).toBe('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    expect(result[1].value).toBe('0xc8');
    expect(result[1].to).toBe('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
  });

  it('normalizes an array of more than two transactions', () => {
    const result = normalizeTransactionsBatch([tx1, tx2, tx3]);

    expect(result).toHaveLength(3);
    expect(result[0].value).toBe('0x64');
    expect(result[1].value).toBe('0xc8');
    expect(result[2]?.value).toBe('0x12c');
  });
});
