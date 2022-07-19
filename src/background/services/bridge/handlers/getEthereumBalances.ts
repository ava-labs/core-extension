import {
  Assets,
  AssetType,
  Blockchain,
  EthereumConfigAsset,
  fetchTokenBalances,
} from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import Big from 'big.js';
import { injectable } from 'tsyringe';
import { TokenPricesService } from '../../balances/TokenPricesService';
import { NetworkService } from '../../network/NetworkService';
import { SettingsService } from '../../settings/SettingsService';
import { BIG_ZERO } from '@avalabs/utils-sdk';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_GET_ETH_BALANCES,
  {
    [symbol: string]:
      | {
          balance: Big;
          logoUri?: string | undefined;
          price?: number | undefined;
        }
      | undefined;
  },
  [assets: Assets, account: string, deprecated: boolean]
>;

@injectable()
export class BridgeGetEthereumBalancesHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_GET_ETH_BALANCES as const;

  constructor(
    private networkService: NetworkService,
    private settingsService: SettingsService,
    private tokenPricesService: TokenPricesService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const [assets, account, deprecated] = (request.params || []) as [
      assets: Assets,
      account: string,
      deprecated: boolean
    ];
    const provider = await this.networkService.getEthereumProvider();
    const ethereumBalancesBySymbol = await fetchTokenBalances(
      assets,
      Blockchain.ETHEREUM,
      provider,
      account,
      deprecated
    );
    const networks = await this.networkService.activeNetworks.promisify();
    const tokens =
      networks[ChainId.AVALANCHE_MAINNET_ID]?.tokens ||
      networks[ChainId.AVALANCHE_TESTNET_ID]?.tokens ||
      [];
    const logosBySymbol = tokens?.reduce((acc, token) => {
      acc[token.symbol] = token.logoUri;
      return acc;
    }, {});

    const erc20Assets = Object.values(assets).filter(
      (a): a is EthereumConfigAsset => a.assetType === AssetType.ERC20
    );
    const addresses = erc20Assets.map((a) => ({
      address: a.nativeContractAddress,
    }));
    const { currency } = await this.settingsService.getSettings();
    const nativeTokenPrice = await this.tokenPricesService.getPriceByCoinId(
      'ethereum',
      currency
    );
    const tokenPrices = await this.tokenPricesService.getTokenPricesByAddresses(
      addresses,
      'ethereum',
      'ethereum'
    );

    const balances: {
      [symbol: string]:
        | { balance: Big; logoUri?: string; price?: number }
        | undefined;
    } = {};

    Object.entries(assets).forEach(([symbol, asset]) => {
      const price =
        asset.assetType === AssetType.NATIVE
          ? nativeTokenPrice
          : asset.assetType === AssetType.ERC20
          ? tokenPrices[asset.nativeContractAddress]
          : undefined;

      balances[symbol] = {
        balance: ethereumBalancesBySymbol?.[symbol] || BIG_ZERO,
        logoUri: logosBySymbol[symbol],
        price,
      };
    });

    return {
      ...request,
      result: balances,
    };
  };
}
