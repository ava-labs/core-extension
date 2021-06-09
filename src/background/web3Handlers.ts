import engine from "./jsonRpcEngine";

export default {
  eth_getChainId(req) {
    return engine
      .handle(req)
      .then((res) => console.log("response: ", res))
      .catch((err) => console.log("error from json rpc: ", err));
  },
  eth_getAssetBalance(req) {
    /**
     * user requests balance
     *
     * 1.
     * - we request the balance
     * - the server responds and says we need signature for this
     * - we popup and ask for it
     * - we then resend with siganture
     * - return response
     *
     * 2.
     * - we know this call requires a signature
     * - we popup and ask for signature
     * - upon approval we make request
     * - return response
     *
     */
    return engine
      .handle(req)
      .then((res) => console.log("response: ", res))
      .catch((err) => console.log("error from json rpc: ", err));
  },
};
