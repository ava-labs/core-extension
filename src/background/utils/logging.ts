import { PassThrough } from "stream";

export default function logger(message: string) {
  const logger = new PassThrough({ objectMode: true });

  logger.on("data", (...args) => {
    console.groupCollapsed(message);
    console.log(args);
    console.groupEnd();
  });
  logger.on("end", (...args) => {
    console.log(`${message}-end: `, args);
  });
  logger.on("close", () => {
    console.log(`${message}-closed`);
  });

  return logger;
}
