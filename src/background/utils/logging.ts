import { PassThrough } from 'stream';
import { JsonRpcRequest } from '../rpc/jsonRpcEngine';
export const repeat = (str, times) => new Array(times + 1).join(str);

export const padStart = (num, maxLength, char = ' ') =>
  repeat(char, maxLength - num.toString().length) + num;

export const formatTime = (time) => {
  const h = padStart(time.getHours(), 2, '0');
  const m = padStart(time.getMinutes(), 2, '0');
  const s = padStart(time.getSeconds(), 2, '0');
  const ms = padStart(time.getMilliseconds(), 3, '0');
  return `${h}:${m}:${s}.${ms}`;
};

export const now = () => formatTime(new Date());

const style = (color, bold = true) => {
  return `color:${color};font-weight:${bold ? '600' : '300'};font-size:11px`;
};

export enum LoggerColors {
  info = '#424242',
  success = '#43a047',
}

export function formatAndLog(
  message: string,
  value: any,
  config?: {
    color?: LoggerColors;
  }
) {
  console.groupCollapsed(
    '%c%s  %s',
    style(config?.color ?? LoggerColors.info),
    now(),
    message
  );
  console.log(value.data ? requestParser(value.data) : value);
  console.groupEnd();
}

export default function logger(
  message: string,
  config?: {
    color?: LoggerColors;
  }
) {
  const logger = new PassThrough({ objectMode: true });

  logger.on('data', (value) => {
    formatAndLog(message, value, config);
  });
  logger.on('end', (...args) => {
    console.log(`${message}-end: `, args);
  });
  logger.on('close', () => {
    console.log(`${message}-closed`);
  });

  return logger;
}

export function requestParser(request: JsonRpcRequest<any>) {
  function setKeyAndValue(key: string) {
    if (key === 'params') {
      return `${key}: ${JSON.stringify(request[key] || [])}`;
    }
    return `${key}: ${request[key]}`;
  }

  return Object.keys(request).reduce((acc, key) => {
    return acc ? `${acc}\n${setKeyAndValue(key)}` : setKeyAndValue(key);
  }, ``);
}
