import {
  DropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsHeader } from '../SettingsHeader';

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
        title={'Legal'}
      />
      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="10px 16px"
        as="a"
        target="_blank"
        href="https://wallet.avax.network/legal?core"
      >
        <Typography size={14} height="17px">
          Terms of Use
        </Typography>
      </DropDownMenuItem>
      <DropDownMenuItem
        justify="space-between"
        align="center"
        padding="10px 16px"
        as="a"
        target="_blank"
        href="https://www.avalabs.org/privacy-policy"
      >
        <Typography size={14} height="17px">
          Privacy Policy
        </Typography>
      </DropDownMenuItem>
    </VerticalFlex>
  );
}
