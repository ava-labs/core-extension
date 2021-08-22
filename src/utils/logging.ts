import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { Observable, tap } from 'rxjs';
import { PassThrough } from 'stream';
import { JsonRpcRequest } from './jsonRpcEngine';
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
    color?: LoggerColors | string;
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

export function requestParser(request: ExtensionConnectionMessage) {
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

export function toLogger<T = any>(name: any, showLogs = true) {
  return (observer: Observable<T>) => {
    return observer.pipe(tap((value) => showLogs && formatAndLog(name, value)));
  };
}

export function connectionLog(message: string) {
  console.log('%c%s', style('#F2C53D'), `⚡️ connection: ${message}`);
}

export function responseLog(message: string, data?: any) {
  formatAndLog(`🚀 ${message}`, data, { color: '#A6BF4B' });
}

export function requestLog(message: string, data?: any) {
  formatAndLog(`📫 ${message}`, data, { color: '#424242' });
}

export function eventLog(message: string, data?: any) {
  formatAndLog(`🎯 ${message}`, data, { color: '#598AFA' });
}

export function stateLog(data?: any) {
  formatAndLog(`📚 Background State`, data, { color: '#E346C5' });
}
