import browser from 'webextension-polyfill';

export interface GoToDappParams {
  url: string;
}

export const createGoToDappFunction = () => {
  return async ({ url }: GoToDappParams) => {
    const openUrl = url.includes('https://') ? url : `https://${url}`;
    chrome.tabs.create({ url: openUrl, active: true }, () =>
      browser.action.openPopup(),
    );
    return {
      content: `${url} opened in a new tab!`,
    };
  };
};

export const createBuyFunction = () => {
  return async () => {
    chrome.tabs.create({ url: `https://core.app/buy/`, active: true }, () =>
      browser.action.openPopup(),
    );
    return {
      content: `You can buy tokens at https://core.app/buy/ !`,
    };
  };
};
