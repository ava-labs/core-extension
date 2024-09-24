import { Contract } from 'ethers';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import ERC1155 from '@openzeppelin/contracts/build/contracts/ERC1155.json';

import * as builder from './buildSendTx';
import { TokenType } from '@avalabs/vm-module-types';
import { stringToBigint } from '@src/utils/stringToBigint';

jest.mock('ethers');

describe('src/pages/Send/utils/buildSendTx', () => {
  const from = '0x1234';
  const provider = {} as any;

  describe('buildErc20Tx', () => {
    const populateTransaction = jest.fn().mockResolvedValue({
      chainId: 1234,
      to: '0x9876',
      data: '0x1234321',
    });
    const contract = jest
      .fn()
      .mockReturnValue({ transfer: { populateTransaction } } as any);

    const options = {
      address: '0x9876',
      amount: '123456789',
      token: {
        address: '0xTOKEN',
        decimals: 8,
      },
    } as any;

    beforeEach(() => {
      jest.mocked(Contract).mockImplementation(contract);
    });

    it('constructs the contract with proper params', async () => {
      await builder.buildErc20Tx(from, provider, options);

      expect(contract).toHaveBeenCalledWith(
        options.token.address,
        ERC20.abi,
        provider
      );
    });

    it('builds a transfer transaction using ERC-20 contract', async () => {
      await builder.buildErc20Tx(from, provider, options);

      expect(populateTransaction).toHaveBeenCalledWith(
        options.address,
        `0x${stringToBigint(options.amount, options.token.decimals)}`
      );
    });

    it('returns the populated transaction', async () => {
      expect(await builder.buildErc20Tx(from, provider, options)).toEqual({
        from,
        to: '0x9876',
        data: '0x1234321',
        chainId: 1234,
      });
    });
  });

  describe('buildErc721Tx', () => {
    const populateTransaction = jest.fn().mockResolvedValue({
      chainId: 1234,
      to: '0x9876',
      data: '0x1234321',
    });
    const contract = jest.fn().mockReturnValue({
      'safeTransferFrom(address,address,uint256)': { populateTransaction },
    } as any);

    const options = {
      address: '0x9876',
      amount: '123456789',
      token: {
        address: '0xTOKEN',
        tokenId: 1337,
      },
    } as any;

    beforeEach(() => {
      jest.mocked(Contract).mockImplementation(contract);
    });

    it('constructs the contract with proper params', async () => {
      await builder.buildErc721Tx(from, provider, options);

      expect(contract).toHaveBeenCalledWith(
        options.token.address,
        ERC721.abi,
        provider
      );
    });

    it('builds a transfer transaction using ERC-721 contract', async () => {
      await builder.buildErc721Tx(from, provider, options);

      expect(populateTransaction).toHaveBeenCalledWith(
        from,
        options.address,
        options.token.tokenId
      );
    });

    it('returns the populated transaction', async () => {
      expect(await builder.buildErc721Tx(from, provider, options)).toEqual({
        from,
        to: '0x9876',
        data: '0x1234321',
        chainId: 1234,
      });
    });
  });

  describe('buildErc1155Tx', () => {
    const populateTransaction = jest.fn().mockResolvedValue({
      chainId: 1234,
      to: '0x9876',
      data: '0x1234321',
    });
    const contract = jest.fn().mockReturnValue({
      'safeTransferFrom(address,address,uint256,uint256,bytes)': {
        populateTransaction,
      },
    } as any);

    const options = {
      address: '0x9876',
      amount: '123456789',
      token: {
        address: '0xTOKEN',
        tokenId: 1337,
      },
    } as any;

    beforeEach(() => {
      jest.mocked(Contract).mockImplementation(contract);
    });

    it('constructs the contract with proper params', async () => {
      await builder.buildErc1155Tx(from, provider, options);

      expect(contract).toHaveBeenCalledWith(
        options.token.address,
        ERC1155.abi,
        provider
      );
    });

    it('builds a transfer transaction using ERC-1155 contract', async () => {
      await builder.buildErc1155Tx(from, provider, options);

      expect(populateTransaction).toHaveBeenCalledWith(
        from,
        options.address,
        options.token.tokenId,
        1, // amount is constant and set to 1 at the moment
        new Uint8Array()
      );
    });

    it('returns the populated transaction', async () => {
      expect(await builder.buildErc1155Tx(from, provider, options)).toEqual({
        from,
        to: '0x9876',
        data: '0x1234321',
        chainId: 1234,
      });
    });
  });

  describe('buildNativeTx', () => {
    const options = {
      address: '0x9876',
      amount: '123456789',
      token: {
        address: '0xTOKEN',
        decimals: 8,
      },
    } as any;

    it('constructs a native send transaction', async () => {
      expect(builder.buildNativeTx(from, options)).toEqual({
        from,
        to: options.address,
        value: '0x2bdc545d587500',
      });
    });
  });

  describe('buildTx', () => {
    const token = {
      address: '0xTOKEN',
      decimals: 8,
    } as any;
    const baseOptions = {
      address: '0x9876',
      amount: '123456789',
    } as any;

    beforeEach(() => {
      jest.spyOn(builder, 'buildErc20Tx').mockImplementation(() => ({} as any));
      jest
        .spyOn(builder, 'buildErc721Tx')
        .mockImplementation(() => ({} as any));
      jest
        .spyOn(builder, 'buildErc1155Tx')
        .mockImplementation(() => ({} as any));
      jest
        .spyOn(builder, 'buildNativeTx')
        .mockImplementation(() => ({} as any));
    });

    it('uses buildNativeTx for sending native tokens', async () => {
      const nativeToken = { ...token, type: TokenType.NATIVE };
      const options = { ...baseOptions, token: nativeToken };

      await builder.buildTx('from', provider, options);

      expect(builder.buildNativeTx).toHaveBeenCalledWith('from', options);
      expect(builder.buildErc20Tx).not.toHaveBeenCalled();
      expect(builder.buildErc721Tx).not.toHaveBeenCalled();
      expect(builder.buildErc1155Tx).not.toHaveBeenCalled();
    });

    it('uses buildErc20Tx for sending ERC-20 tokens', async () => {
      const erc20Token = { ...token, type: TokenType.ERC20 };
      const options = { ...baseOptions, token: erc20Token };

      await builder.buildTx('from', provider, options);

      expect(builder.buildErc20Tx).toHaveBeenCalledWith(
        'from',
        provider,
        options
      );
      expect(builder.buildNativeTx).not.toHaveBeenCalled();
      expect(builder.buildErc721Tx).not.toHaveBeenCalled();
      expect(builder.buildErc1155Tx).not.toHaveBeenCalled();
    });

    it('uses buildErc721Tx for sending ERC-721 tokens', async () => {
      const erc721Token = { ...token, type: TokenType.ERC721 };
      const options = { ...baseOptions, token: erc721Token };

      await builder.buildTx('from', provider, options);

      expect(builder.buildErc721Tx).toHaveBeenCalledWith(
        'from',
        provider,
        options
      );
      expect(builder.buildNativeTx).not.toHaveBeenCalled();
      expect(builder.buildErc20Tx).not.toHaveBeenCalled();
      expect(builder.buildErc1155Tx).not.toHaveBeenCalled();
    });

    it('uses buildErc1155Tx for sending ERC-1155 tokens', async () => {
      const erc1155Token = { ...token, type: TokenType.ERC1155 };
      const options = { ...baseOptions, token: erc1155Token };

      await builder.buildTx('from', provider, options);

      expect(builder.buildErc1155Tx).toHaveBeenCalledWith(
        'from',
        provider,
        options
      );
      expect(builder.buildNativeTx).not.toHaveBeenCalled();
      expect(builder.buildErc20Tx).not.toHaveBeenCalled();
      expect(builder.buildErc721Tx).not.toHaveBeenCalled();
    });

    it('throws error for unknown send options', async () => {
      await expect(
        builder.buildTx('from', provider, { token: { type: 'hmmm' } } as any)
      ).rejects.toThrow('Unknown send options object');
    });
  });

  it('recognizes different send options', () => {
    const native = { token: { type: TokenType.NATIVE } } as any;
    const erc20 = { token: { type: TokenType.ERC20 } } as any;
    const erc721 = { token: { type: TokenType.ERC721 } } as any;
    const erc1155 = { token: { type: TokenType.ERC1155 } } as any;

    expect(builder.isNativeSend(native)).toBe(true);
    expect(builder.isNativeSend(erc20)).toBe(false);
    expect(builder.isNativeSend(erc721)).toBe(false);
    expect(builder.isNativeSend(erc1155)).toBe(false);

    expect(builder.isErc20Send(native)).toBe(false);
    expect(builder.isErc20Send(erc20)).toBe(true);
    expect(builder.isErc20Send(erc721)).toBe(false);
    expect(builder.isErc20Send(erc1155)).toBe(false);

    expect(builder.isErc721Send(native)).toBe(false);
    expect(builder.isErc721Send(erc20)).toBe(false);
    expect(builder.isErc721Send(erc721)).toBe(true);
    expect(builder.isErc721Send(erc1155)).toBe(false);

    expect(builder.isErc1155Send(native)).toBe(false);
    expect(builder.isErc1155Send(erc20)).toBe(false);
    expect(builder.isErc1155Send(erc721)).toBe(false);
    expect(builder.isErc1155Send(erc1155)).toBe(true);
  });
});
