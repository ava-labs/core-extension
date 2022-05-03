import { isMainnetNetwork } from '@avalabs/avalanche-wallet-sdk';
import {
  ActiveNetwork,
  networkUpdates$,
} from '@avalabs/wallet-react-components';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { LockService } from '../lock/LockService';
import { LockEvents } from '../lock/models';
import { StorageEvents } from '../storage/models';
import { StorageService } from '../storage/StorageService';
import {
  NetworkEvents,
  NETWORK_STORAGE_KEY,
  supportedNetworks,
  MAINNET_NETWORK,
} from './models';

@singleton()
export class NetworkService {
  private eventEmitter = new EventEmitter();

  private _activeNetwork?: ActiveNetwork;

  public get activeNetwork(): ActiveNetwork | undefined {
    return this._activeNetwork;
  }

  public get isMainnet(): boolean {
    return this._activeNetwork?.config
      ? isMainnetNetwork(this._activeNetwork.config)
      : false;
  }

  constructor(
    private storageService: StorageService,
    private lockService: LockService
  ) {
    this.storageService.addListener(StorageEvents.INITIALIZED, () => {
      this.init();
    });

    // Implement tsyringe Disposable interface once it's released
    this.lockService.addListener(LockEvents.LOCKED, () => {
      this._activeNetwork = undefined;
    });
    this.lockService.addListener(LockEvents.UNLOCKED, () => {
      this.init();
    });
  }

  async init() {
    const network = await this.storageService.load<ActiveNetwork>(
      NETWORK_STORAGE_KEY
    );
    this._activeNetwork = network || MAINNET_NETWORK;

    networkUpdates$.next(this._activeNetwork);
    this.eventEmitter.emit(
      NetworkEvents.NETWORK_UPDATE_EVENT,
      this._activeNetwork
    );
  }

  async setNetwork(networkName: string) {
    const selectedNetwork = supportedNetworks.get(networkName);
    if (!selectedNetwork) {
      throw new Error('selected network not supported');
    }

    this._activeNetwork = selectedNetwork;

    this.storageService.save(NETWORK_STORAGE_KEY, this.activeNetwork);
    this.eventEmitter.emit(
      NetworkEvents.NETWORK_UPDATE_EVENT,
      this.activeNetwork
    );
    networkUpdates$.next(this._activeNetwork);
  }

  addListener(event: NetworkEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
