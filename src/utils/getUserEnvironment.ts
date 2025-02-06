import browser from 'webextension-polyfill';
import { UserEnvironmentAnalytics } from '@src/background/services/analytics/models';

// This is being used for analytics
export async function getUserEnvironment(): Promise<UserEnvironmentAnalytics> {
  const os = await getOs();
  const chromeVersion = getChromeVersion();

  return {
    $os: os,
    $browser: 'Chrome',
    $browser_version: chromeVersion,
  };
}

async function getOs() {
  return (await browser.runtime.getPlatformInfo()).os;
}

function getChromeVersion() {
  const chromeData = /Chrome\/([0-9.]+)/.exec(navigator.userAgent);

  if (chromeData && chromeData[1]) {
    return chromeData[1];
  } else {
    return '';
  }
}
