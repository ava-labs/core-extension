import {
  Stack,
  List,
  ListItem,
  ListItemText,
  Switch,
  Tooltip,
  InfoCircleIcon,
} from '@avalabs/k2-components';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { isProductionBuild } from '@src/utils/environment';
import { useHistory } from 'react-router-dom';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useTranslation, Trans } from 'react-i18next';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

export function Advanced({ goBack, navigateTo, width }: SettingsPageProps) {
  const { t } = useTranslation();
  const { setDeveloperMode, isDeveloperMode } = useNetworkContext();
  const { isBridgeDevEnv, setIsBridgeDevEnv } = useBridgeContext();
  const {
    showTokensWithoutBalances,
    toggleShowTokensWithoutBalanceSetting,
    isDefaultExtension,
    toggleIsDefaultExtension,
  } = useSettingsContext();
  const history = useHistory();

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Advanced')}
      />
      <List>
        <ListItem data-testid="test-net-mode-menu-item">
          <ListItemText
            sx={{ display: 'flex', fontSize: '14px', alignItems: 'center' }}
            disableTypography
          >
            {t('Testnet Mode')}
            <Tooltip
              sx={{ ml: 0.5 }}
              PopperProps={{
                sx: {
                  maxWidth: '240px',
                },
              }}
              title={t(
                'Testnet mode changes the interface to allow you to interact with supported testnets.'
              )}
            >
              <InfoCircleIcon sx={{ cursor: 'pointer' }} size="16" />
            </Tooltip>
          </ListItemText>
          <Switch
            size="small"
            checked={isDeveloperMode}
            onChange={() => {
              setDeveloperMode(!isDeveloperMode);
              history.push('/home');
            }}
          />
        </ListItem>
        {!isProductionBuild() ? (
          <ListItem data-testid="bridge-dev-env-menu-item">
            <ListItemText
              sx={{ display: 'flex', fontSize: '14px', alignItems: 'center' }}
              disableTypography
            >
              {t('Bridge DEV Environment')}
              <Tooltip
                sx={{ ml: 0.5 }}
                PopperProps={{
                  sx: {
                    maxWidth: '240px',
                  },
                }}
                title={
                  <Trans i18nKey="When both this AND Testnet Mode are enabled then the Bridge will use the DEV warden config.<br /><br />Only available for internal builds." />
                }
              >
                <InfoCircleIcon sx={{ cursor: 'pointer' }} size="16" />
              </Tooltip>
            </ListItemText>
            <Switch
              size="small"
              checked={isBridgeDevEnv}
              onChange={() => {
                setIsBridgeDevEnv(!isBridgeDevEnv);
              }}
            />
          </ListItem>
        ) : undefined}
        <ListItem data-testid="show-tokens-without-balance-option">
          <ListItemText sx={{ fontSize: '14px' }} disableTypography>
            {t('Show Tokens Without Balance')}
          </ListItemText>
          <Switch
            size="small"
            checked={showTokensWithoutBalances}
            onChange={() => toggleShowTokensWithoutBalanceSetting()}
          />
        </ListItem>
        <ListItem data-testid="set-default-extension-option">
          <ListItemText sx={{ fontSize: '14px' }} disableTypography>
            {t('Set as Default Extension')}
          </ListItemText>
          <Switch
            size="small"
            checked={isDefaultExtension}
            onChange={() => toggleIsDefaultExtension()}
          />
        </ListItem>
      </List>
    </Stack>
  );
}
