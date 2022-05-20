import {
  DropDownMenuItem,
  Toggle,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';

export function Advanced({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { setDeveloperMode, isDeveloperMode } = useNetworkContext();
  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title="Advanced"
      />

      <DropDownMenuItem justify="space-between" padding="10px 16px">
        <Typography size={14} height="17px">
          Developer Mode
        </Typography>
        <Toggle
          isChecked={isDeveloperMode}
          onChange={() => setDeveloperMode(!isDeveloperMode)}
        />
      </DropDownMenuItem>
    </VerticalFlex>
  );
}
