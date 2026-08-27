import { RpcMethod } from '@avalabs/vm-module-types';
import { SolanaSigner } from '@avalabs/core-wallets-sdk';
import { getProviderForNetwork } from '@core/common';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { Network } from '@core/types';

import { WalletService } from './WalletService';

jest.mock('@core/common', () => {
  const actual = jest.requireActual('@core/common');
  return {
    ...actual,
    getProviderForNetwork: jest.fn(),
    Monitoring: {
      ...actual.Monitoring,
      sentryCaptureException: jest.fn(),
    },
  };
});

/**
 * Bounty #86602: Solana messages carry no chain id, so a dApp could request a
 * signature under a `solana:devnet` scope while supplying a transaction built
 * on a fresh Mainnet blockhash, then submit the returned signature to Mainnet.
 */
describe('WalletService Solana cluster binding', () => {
  // A minimal v0 transaction whose lifetime is the blockhash below.
  const SERIALIZED_TX =
    'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAAAQKo9pFOiKGw4hAVPvdjrisAwrk9FsEk0sBTehAEgAAA3fS9Owj8B10Abix46FXAI/UfwKL0rpcbksjQ4hzpymIAAA==';
  const BLOCKHASH = 'FwRYtTPRk5NfqNsQBJTZFy1phFPo2VmbjnZ3AtDrDwK7';

  const network = {
    chainName: 'Solana Devnet',
    chainId: 1,
    vmName: NetworkVMType.SVM,
    isTestnet: true,
  } as unknown as Network;

  const tx = {
    type: RpcMethod.SOLANA_SIGN_TRANSACTION,
    account: 'SoLaNaAccount',
    data: SERIALIZED_TX,
  } as any;

  let walletService: WalletService;
  let solanaSigner: jest.Mocked<SolanaSigner>;
  let isBlockhashValid: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    solanaSigner = Object.create(SolanaSigner.prototype);
    solanaSigner.signTx = jest.fn().mockResolvedValue('signed');

    isBlockhashValid = jest.fn();
    (getProviderForNetwork as jest.Mock).mockResolvedValue({
      isBlockhashValid,
    });

    const stub = {} as any;
    walletService = new WalletService(
      stub,
      stub,
      stub,
      stub,
      stub,
      stub,
      {
        getActiveAccount: jest
          .fn()
          .mockResolvedValue({ addressSVM: 'SoLaNaAccount' }),
      } as any,
      stub,
    );

    jest
      .spyOn(walletService as any, 'getWallet')
      .mockResolvedValue(solanaSigner);
  });

  it('refuses to sign a transaction whose blockhash is unknown on the target cluster', async () => {
    isBlockhashValid.mockReturnValue({
      send: jest.fn().mockResolvedValue({ value: false }),
    });

    await expect(walletService.sign(tx, network)).rejects.toThrow(
      'This transaction was not built for Solana Devnet',
    );

    expect(isBlockhashValid).toHaveBeenCalledWith(BLOCKHASH);
    expect(solanaSigner.signTx).not.toHaveBeenCalled();
  });

  it('signs when the blockhash belongs to the target cluster', async () => {
    isBlockhashValid.mockReturnValue({
      send: jest.fn().mockResolvedValue({ value: true }),
    });

    const { signedTx } = await walletService.sign(tx, network);

    expect(signedTx).toBe('signed');
    expect(solanaSigner.signTx).toHaveBeenCalled();
  });

  it('fails open when the blockhash cannot be checked', async () => {
    isBlockhashValid.mockReturnValue({
      send: jest.fn().mockRejectedValue(new Error('network down')),
    });

    const { signedTx } = await walletService.sign(tx, network);

    expect(signedTx).toBe('signed');
  });
});
