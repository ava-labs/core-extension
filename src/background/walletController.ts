import { Duplex } from "stream";
import providerHandlers from "./providerHandlers";
import web3Handlers from "./web3Handlers";

export class WalletController {
  handlers = {
    ...providerHandlers,
    ...web3Handlers,
  };

  async mapChunkToHandler(request) {
    const method = request.data.method;
    const handler = this.handlers[method];

    console.log("method: ", method, "handler exists: ", !!handler);

    const result = await handler(request.data);
    return { ...request, data: result };
  }
}

export class WalletControllerStream extends Duplex {
  controller = new WalletController();

  constructor() {
    super({ objectMode: true });
  }

  _read() {}

  _write(chunk, encoding, cb) {
    this.controller.mapChunkToHandler(chunk).then((result) => {
      this.push(result);
      cb();
    });
  }

  _final() {
    this.push(null);
  }
}

export default new WalletControllerStream();
