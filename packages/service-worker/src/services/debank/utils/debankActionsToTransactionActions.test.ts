import { TokenType } from '@avalabs/vm-module-types';
import { TransactionType, TxAction } from '@core/types';
import { debankActionsToTransactionActions } from './debankActionsToTransactionActions';
import { mapNftToTransactionNft } from './mapNftToTransactionNft';
import { mapTokenItemToTransactionToken } from './mapTokenItemToTransactionToken';

jest.mock('./mapNftToTransactionNft');
jest.mock('./mapTokenItemToTransactionToken');

describe('services/debank/utils/debankActionsToTransactionActions', () => {
  const mappedToken = { symbol: 'MAPPED_TOKEN' } as any;
  const mappedNft = { name: 'MAPPED_NFT' } as any;
  const token = { id: 'token' } as any;
  const nft = { id: 'nft' } as any;
  const protocol = { id: 'protocol-id', name: 'Protocol', logo_url: 'logo' };
  const mappedProtocol = {
    id: 'protocol-id',
    name: 'Protocol',
    logoUri: 'logo',
  };

  const convert = (action: { type: string; [key: string]: unknown }) =>
    debankActionsToTransactionActions([action as unknown as TxAction])[0];

  beforeEach(() => {
    jest.mocked(mapTokenItemToTransactionToken).mockReturnValue(mappedToken);
    jest.mocked(mapNftToTransactionNft).mockReturnValue(mappedNft);
  });

  it('returns undefined when actions are missing', () => {
    expect(
      debankActionsToTransactionActions(undefined as unknown as TxAction[]),
    ).toBeUndefined();
  });

  it('maps send_token actions', () => {
    expect(
      convert({ type: 'send_token', from_addr: '0xa', to_addr: '0xb', token }),
    ).toEqual({
      type: TransactionType.SEND_TOKEN,
      fromAddress: '0xa',
      toAddress: '0xb',
      token: mappedToken,
    });
    expect(mapTokenItemToTransactionToken).toHaveBeenCalledWith(token);
  });

  it('maps send_nft actions', () => {
    expect(
      convert({ type: 'send_nft', from_addr: '0xa', to_addr: '0xb', nft }),
    ).toEqual({
      type: TransactionType.SEND_NFT,
      fromAddress: '0xa',
      toAddress: '0xb',
      nft: mappedNft,
    });
    expect(mapNftToTransactionNft).toHaveBeenCalledWith(nft);
  });

  it.each([
    ['approve_token', TransactionType.APPROVE_TOKEN],
    ['revoke_token_approval', TransactionType.REVOKE_TOKEN_APPROVAL],
  ])('maps %s actions', (type, expectedType) => {
    expect(
      convert({ type, owner: '0xo', spender: { id: '0xs', protocol }, token }),
    ).toEqual({
      type: expectedType,
      owner: '0xo',
      spender: { address: '0xs', protocol: mappedProtocol },
      token: mappedToken,
    });
  });

  it.each([
    ['approve_nft', TransactionType.APPROVE_NFT],
    ['revoke_nft_approval', TransactionType.REVOKE_NFT_APPROVAL],
  ])('maps %s actions', (type, expectedType) => {
    expect(
      convert({ type, owner: '0xo', spender: { id: '0xs', protocol }, nft }),
    ).toEqual({
      type: expectedType,
      owner: '0xo',
      spender: { address: '0xs', protocol: mappedProtocol },
      token: mappedNft,
    });
  });

  it.each(['approve_token', 'approve_nft', 'approve_nft_collection'])(
    'leaves spender protocol undefined for %s when missing',
    (type) => {
      const result = convert({
        type,
        owner: '0xo',
        spender: { id: '0xs' },
        token,
        nft,
        collection: { id: '0xc' },
      } as any);

      expect((result as any).spender).toEqual({
        address: '0xs',
        protocol: undefined,
      });
    },
  );

  it.each([
    [
      'approve_nft_collection',
      TransactionType.APPROVE_NFT_COLLECTION,
      true,
      TokenType.ERC1155,
    ],
    [
      'revoke_nft_collection_approval',
      TransactionType.REVOKE_NFT_COLLECTION_APPROVAL,
      false,
      TokenType.ERC721,
    ],
  ])('maps %s actions', (type, expectedType, isErc1155, expectedTokenType) => {
    expect(
      convert({
        type,
        owner: '0xo',
        spender: { id: '0xs', protocol },
        collection: {
          id: '0xc',
          name: 'Collection',
          description: 'desc',
          logo_url: 'collection-logo',
          is_erc1155: isErc1155,
          is_scam: false,
          is_suspicious: true,
        },
      } as any),
    ).toEqual({
      type: expectedType,
      owner: '0xo',
      spender: { address: '0xs', protocol: mappedProtocol },
      collection: {
        id: '0xc',
        name: 'Collection',
        description: 'desc',
        address: '0xc',
        logoUri: 'collection-logo',
        type: expectedTokenType,
        isScam: false,
        isSuspicious: true,
      },
    });
  });

  it('defaults a missing collection description to an empty string', () => {
    const result = convert({
      type: 'approve_nft_collection',
      owner: '0xo',
      spender: { id: '0xs', protocol },
      collection: { id: '0xc', name: 'Collection' },
    } as any);

    expect((result as any).collection.description).toBe('');
  });

  it('maps cancel_tx actions', () => {
    expect(convert({ type: 'cancel_tx', from_addr: '0xa' })).toEqual({
      type: TransactionType.CANCEL_TX,
      fromAddress: '0xa',
    });
  });

  it('maps deploy_contract actions', () => {
    expect(convert({ type: 'deploy_contract', from_addr: '0xa' })).toEqual({
      type: TransactionType.DEPLOY_CONTRACT,
      fromAddress: '0xa',
    });
  });

  it('maps call actions with contract protocol', () => {
    expect(
      convert({
        type: 'call',
        from_addr: '0xa',
        to_addr: '0xb',
        contract: { id: '0xc', protocol },
      }),
    ).toEqual({
      type: TransactionType.CALL,
      fromAddress: '0xa',
      toAddress: '0xb',
      contract: { address: '0xc', protocol: mappedProtocol },
    });
  });

  it('maps call actions without contract protocol', () => {
    expect(
      convert({
        type: 'call',
        from_addr: '0xa',
        to_addr: '0xb',
        contract: { id: '0xc' },
      } as any),
    ).toEqual({
      type: TransactionType.CALL,
      fromAddress: '0xa',
      toAddress: '0xb',
      contract: { address: '0xc', protocol: undefined },
    });
  });

  it('falls back to a call action for unknown types without contract', () => {
    expect(
      convert({ type: 'unknown', from_addr: '0xa', to_addr: '0xb' } as any),
    ).toEqual({
      type: TransactionType.CALL,
      fromAddress: '0xa',
      toAddress: '0xb',
      contract: undefined,
    });
  });
});
