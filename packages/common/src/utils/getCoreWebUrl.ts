export const getCoreWebUrl = (address?: string) => {
  const baseCoreWebUrl = process.env.CORE_WEB_BASE_URL;
  if (!address) {
    return baseCoreWebUrl;
  }

  return `${baseCoreWebUrl}/portfolio/${address}`;
};

export const getCoreWebPortfolioUrl = (query?: string) => {
  const baseCoreWebUrl = process.env.CORE_WEB_BASE_URL;
  const portfolioUrl = `${baseCoreWebUrl}/portfolio`;
  return query ? `${portfolioUrl}?${query}` : portfolioUrl;
};
