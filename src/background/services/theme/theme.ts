import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { Subject, concat, from } from 'rxjs';
import { tap } from 'rxjs/operators';
export interface ThemeConfig {
  isDarkMode: boolean;
}

const THEME_STORAGE_NAME = 'theme';
const _themeConfig = new Subject<ThemeConfig>();

class ThemeService {
  themeConfig = concat(from(this.themeFromStorage), _themeConfig);

  private get themeFromStorage() {
    return getFromStorage(THEME_STORAGE_NAME).then((theme) => {
      return theme ?? { isDarkMode: false };
    });
  }

  constructor() {
    _themeConfig
      .pipe(
        tap((config) => {
          saveToStorage({ [THEME_STORAGE_NAME]: config });
        })
      )
      .subscribe();
  }

  async toggleDarkMode() {
    const config = await this.themeFromStorage;

    const conf = {
      isDarkMode: !(config && config[THEME_STORAGE_NAME]?.isDarkMode),
    };

    _themeConfig.next(conf);
    return conf;
  }

  async removeAll() {
    return removeFromStorage(THEME_STORAGE_NAME);
  }
}

export const themeService = new ThemeService();
