import {
  bnToEthersBigNumber,
  ethersBigNumberToBN,
  resolve,
} from '@avalabs/utils-sdk';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { TransactionRequest } from '@ethersproject/providers';
import BN from 'bn.js';
import { BigNumber, Contract } from 'ethers';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import ERC1155 from '@openzeppelin/contracts/build/contracts/ERC1155.json';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { NetworkService } from '../network/NetworkService';
import {
  SendErrorMessage,
  SendServiceHelper,
  SendState,
  ValidSendState,
} from './models';
import {
  TokenType,
  TokenWithBalanceERC20,
  NftTokenWithBalance,
} from '../balances/models';
import { isAddress } from 'ethers/lib/utils';
import { isNFT } from '../balances/nft/utils/isNFT';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';

@singleton()
export class SendServiceEVM implements SendServiceHelper {
  constructor(
    private accountsService: AccountsService,
    private networkService: NetworkService,
    private networkBalancesService: BalanceAggregatorService
  ) {}

  async getTransactionRequest(
    sendState: ValidSendState
  ): Promise<TransactionRequest> {
    const unsignedTx = await this.getUnsignedTx(sendState);
    const network = this.networkService.activeNetwork;
    const chainId = network?.chainId;
    const provider = await this.getProvider();
    const nonce = await provider.getTransactionCount(this.fromAddress);
    const gasLimit = await this.getGasLimit(sendState);

    return {
      ...unsignedTx,
      chainId,
      gasLimit: sendState.customGasLimit ?? gasLimit,
      gasPrice: sendState.gasPrice,
      nonce,
    };
  }

  async validateStateAndCalculateFees(
    sendState: SendState
  ): Promise<SendState | ValidSendState> {
    const { amount, address, gasPrice, token } = sendState;

    // This *should* always be defined and set by the UI
    if (!token) return this.getErrorState(sendState, 'Invalid token');

    const gasLimit = await this.getGasLimit(sendState);

    const sendFee = gasPrice
      ? new BN(gasLimit).mul(ethersBigNumberToBN(gasPrice))
      : undefined;

    const maxAmount =
      token.type === TokenType.NATIVE
        ? token.balance.sub(sendFee || new BN(0))
        : (token as TokenWithBalanceERC20).balance;

    const newState: SendState = {
      ...sendState,
      canSubmit: true,
      loading: token.balance.gt(new BN(0)) ? !maxAmount || !gasPrice : false,
      error: undefined,
      gasLimit,
      gasPrice,
      maxAmount,
      sendFee,
    };

    if (!address)
      return this.getErrorState(newState, SendErrorMessage.ADDRESS_REQUIRED);

    if (!isAddress(address))
      return this.getErrorState(newState, SendErrorMessage.INVALID_ADDRESS);

    if (!gasPrice || gasPrice.isZero())
      return this.getErrorState(newState, SendErrorMessage.INVALID_NETWORK_FEE);

    if (!isNFT(token.type) && (!amount || amount.isZero()))
      return this.getErrorState(newState, SendErrorMessage.AMOUNT_REQUIRED);

    if (amount?.gt(maxAmount))
      return this.getErrorState(
        newState,
        SendErrorMessage.INSUFFICIENT_BALANCE
      );

    if (
      token.type !== TokenType.NATIVE &&
      sendFee &&
      !(await this.hasEnoughBalanceForGasForNonNative(sendFee))
    )
      return this.getErrorState(
        newState,
        SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE
      );
    return newState;
  }

  private get fromAddress() {
    if (!this.accountsService.activeAccount)
      throw new Error('no active account');
    return this.accountsService.activeAccount.addressC;
  }

  private async getProvider() {
    const network = this.networkService.activeNetwork;
    if (!network) throw new Error('No active network');
    const provider = this.networkService.getProviderForNetwork(network);
    if (!(provider instanceof JsonRpcBatchInternal))
      throw new Error('Not EVM provider');
    return provider;
  }

  private async getGasLimit(sendState: SendState): Promise<number> {
    if (!sendState.address) return 0;

    const provider = await this.getProvider();
    const unsignedTx = await this.getUnsignedTx(sendState);
    const [gasLimit, error] = await resolve(provider.estimateGas(unsignedTx));
    if (
      error &&
      !(error as Error).toString().includes('insufficient funds for gas')
    ) {
      console.error(error);
    }
    // add 20% padding to ensure the tx will be accepted
    const paddedGasLimit = Math.round((gasLimit?.toNumber() || 0) * 1.2);
    return paddedGasLimit;
  }

  private async hasEnoughBalanceForGasForNonNative(sendFee: BN) {
    const tokens = this.networkBalancesService.balances;
    const network = this.networkService.activeNetwork;
    const address = this.fromAddress;
    if (!network?.chainId || !address || !tokens) {
      return false;
    }
    const nativeToken = Object.values(
      tokens[network.chainId]?.[address] ?? {}
    )?.find((token) => token.type === TokenType.NATIVE);

    return nativeToken?.balance.gte(sendFee) ? true : false;
  }

  private getErrorState(sendState: SendState, errorMessage: string): SendState {
    return {
      ...sendState,
      error: { error: true, message: errorMessage },
      canSubmit: false,
    };
  }

  private async getUnsignedTx(
    sendState: SendState
  ): Promise<TransactionRequest> {
    if (!sendState.token) throw new Error('Missing token');

    if (sendState.token.type === TokenType.NATIVE) {
      return this.getUnsignedTxNative(sendState);
    } else if (sendState.token.type === TokenType.ERC20) {
      return this.getUnsignedTxERC20(
        sendState as SendState<TokenWithBalanceERC20>
      );
    } else if (sendState.token.type === TokenType.ERC721) {
      return this.getUnsignedTxERC721(
        sendState as SendState<NftTokenWithBalance>
      );
    } else if (sendState.token.type === TokenType.ERC1155) {
      return this.getUnsignedTxERC1155(
        sendState as SendState<NftTokenWithBalance>
      );
    } else {
      throw new Error('Unsupported token');
    }
  }

  private async getUnsignedTxNative(
    sendState: SendState
  ): Promise<TransactionRequest> {
    const { amount, address } = sendState;
    return {
      from: this.fromAddress,
      to: address,
      value: bnToEthersBigNumber(amount || new BN(0)),
    };
  }

  private async getUnsignedTxERC20(
    sendState: SendState<TokenWithBalanceERC20>
  ): Promise<TransactionRequest> {
    if (!sendState.address)
      throw new Error('Cannot create transaction without an address');
    const provider = await this.getProvider();
    const contract = new Contract(
      sendState.token?.address || '',
      ERC20.abi,
      provider
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const populatedTransaction = await contract.populateTransaction.transfer!(
      sendState.address,
      sendState.amount
        ? bnToEthersBigNumber(sendState.amount)
        : BigNumber.from(0)
    );
    const unsignedTx: TransactionRequest = {
      ...populatedTransaction, // only includes `to` and `data`
      from: this.fromAddress,
    };
    return unsignedTx;
  }

  private async getUnsignedTxERC721(
    sendState: SendState<NftTokenWithBalance>
  ): Promise<TransactionRequest> {
    const provider = await this.getProvider();
    const contract = new Contract(
      sendState.token?.address || '',
      ERC721.abi,
      provider
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const populatedTransaction = await contract.populateTransaction[
      'safeTransferFrom(address,address,uint256)'
    ]!(this.fromAddress, sendState.address, sendState.token?.tokenId);
    const unsignedTx: TransactionRequest = {
      ...populatedTransaction, // only includes `to` and `data`
      from: this.fromAddress,
    };
    return unsignedTx;
  }

  private async getUnsignedTxERC1155(
    sendState: SendState<NftTokenWithBalance>
  ): Promise<TransactionRequest> {
    const provider = await this.getProvider();
    const contract = new Contract(
      sendState.token?.address || '',
      ERC1155.abi,
      provider
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const populatedTransaction = await contract.populateTransaction[
      'safeTransferFrom(address,address,uint256,uint256,bytes)'
    ]!(this.fromAddress, sendState.address, sendState.token?.tokenId, 1, []);
    const unsignedTx: TransactionRequest = {
      ...populatedTransaction,
      from: this.fromAddress,
    };
    return unsignedTx;
  }
}
