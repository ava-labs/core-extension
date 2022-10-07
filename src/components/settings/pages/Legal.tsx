import {
  DropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsHeader } from '../SettingsHeader';
import { t } from 'i18next';

export function Legal({ goBack, navigateTo, width }) {
  const theme = useTheme();
  return (
    <VerticalFlex
      width={width}
      background={theme.colors.bg2}
      height="100%"
      justify="flex-start"
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Legal')}
      />
      <DropDownMenuItem
        data-testid="terms-of-use-link"
        justify="space-between"
        align="center"
        padding="10px 16px"
        as="a"
        target="_blank"
        href="https://wallet.avax.network/legal?core"
      >
        <Typography size={14} height="17px">
          {t('Terms of Use')}
        </Typography>
      </DropDownMenuItem>
      <DropDownMenuItem
        data-testid="privacy-policy-link"
        justify="space-between"
        align="center"
        padding="10px 16px"
        as="a"
        target="_blank"
        href="https://www.avalabs.org/privacy-policy"
      >
        <Typography size={14} height="17px">
          {t('Privacy Policy')}
        </Typography>
      </DropDownMenuItem>
    </VerticalFlex>
  );
}
