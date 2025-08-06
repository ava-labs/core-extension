export const getCoreWebUrl = (address?: string) => {
  const baseCoreWebUrl = process.env.CORE_WEB_BASE_URL;
  if (!address) {
    return baseCoreWebUrl;
  }

  return `${baseCoreWebUrl}/portfolio/${address}`;
};
