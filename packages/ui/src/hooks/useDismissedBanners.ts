import { useLocalStorage } from './useLocalStorage';

const DISMISSED_BANNERS_STORAGE_KEY = 'dismissed-banners';

export const useDismissedBanners = () => {
  const { get, set } = useLocalStorage();

  return {
    async isDismissed(bannerId: string) {
      const dismissedBanners = await get<string[]>(
        DISMISSED_BANNERS_STORAGE_KEY,
      );

      return dismissedBanners && Array.isArray(dismissedBanners)
        ? dismissedBanners.includes(bannerId)
        : false;
    },
    async dismiss(bannerId: string) {
      const alreadyDismissedBanners = await get<string[]>(
        DISMISSED_BANNERS_STORAGE_KEY,
      );
      const newDismissedBanners = alreadyDismissedBanners
        ? [...alreadyDismissedBanners, bannerId]
        : [bannerId];

      return set(DISMISSED_BANNERS_STORAGE_KEY, newDismissedBanners);
    },
  };
};
