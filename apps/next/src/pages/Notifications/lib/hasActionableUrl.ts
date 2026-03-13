import { AppNotification } from '@core/types';

export const hasActionableUrl = (notification: AppNotification): boolean => {
  const url = notification.deepLinkUrl;
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol.replace(':', '');
    return protocol === 'https:' || protocol === 'chrome-extension:';
  } catch {
    return false;
  }
};
