import { PassThrough } from "stream";

export default function logger(message: string) {
  const logger = new PassThrough({ objectMode: true });

  logger.on("data", (...args) => {
    console.log(`${message}: `, args);
  });

  return logger;
}
