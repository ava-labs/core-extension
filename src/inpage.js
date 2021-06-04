import log from "loglevel";
import { WindowPostMessageStream } from "@metamask/post-message-stream";
import { initializeProvider } from "@metamask/providers/dist/initializeInpageProvider";
import { CONTENT_SCRIPT, INPAGE_SCRIPT } from "./common";

const avalancheStream = new WindowPostMessageStream({
  name: INPAGE_SCRIPT,
  target: CONTENT_SCRIPT,
});

initializeProvider({
  connectionStream: avalancheStream,
  logger: log,
  shouldShimWeb3: true,
});
