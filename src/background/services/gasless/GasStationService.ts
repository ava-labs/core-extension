import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { GaslessEvents, GaslessMessage } from './model';
import { AppCheckService } from '../appcheck/AppCheckService';

@singleton()
export class GasStationService {
  #eventEmitter = new EventEmitter();
  constructor(private appCheckService: AppCheckService) {
    this.createOffScreen();
  }

  async #getAppcheckToken() {
    const token = await this.appCheckService.getAppcheckToken();
    return token;
  }

  async createOffScreen() {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['WORKERS'],
      justification: 'offload computation',
    });
  }

  async closeOffscreen() {
    await chrome.offscreen.closeDocument();
    return true;
  }
  async sendMessage(message) {
    const token = await this.#getAppcheckToken();
    console.log('GasStationService sendMessage message: ', message);
    this.#eventEmitter.emit(GaslessEvents.SEND_MESSAGE, { message, token });
  }

  getChallange() {}
  solveChallange() {}
  fundTx() {}
  addListener(event: GaslessEvents, callback: (data: GaslessMessage) => void) {
    this.#eventEmitter.on(event, callback);
  }
}
