import { PassThrough } from "stream";

export default function logger(message: string) {
  const logger = new PassThrough({ objectMode: true });

  logger.on("data", (...args) => {
    console.log(`${message}: `, args);
  });
  logger.on("end", (...args) => {
    console.log(`${message}-end: `, args);
  });
  logger.on("close", () => {
    console.log(`${message}-closed`);
  });

  return logger;
}
