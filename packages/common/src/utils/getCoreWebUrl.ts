export const getCoreWebUrl = (address?: string, networkId?: number) => {
  const baseCoreWebUrl = process.env.CORE_WEB_BASE_URL;
  if (!address) {
    return baseCoreWebUrl;
  }

  if (address && networkId) {
    return `${baseCoreWebUrl}/account/${address}?network=${networkId}`;
  }
  return `${baseCoreWebUrl}/account/${address}`;
};
