import {
  DropDownMenuItem,
  Toggle,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';

export function Advanced({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { isDefaultExtension, toggleIsDefaultExtension } = useSettingsContext();

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Advanced'}
      />
      <DropDownMenuItem justify="space-between" padding="12px 16px">
        <Typography weight={600} height="24px">
          Set as default wallet
        </Typography>
        <Toggle
          isChecked={isDefaultExtension}
          onChange={() => toggleIsDefaultExtension()}
        />
      </DropDownMenuItem>
    </VerticalFlex>
  );
}
