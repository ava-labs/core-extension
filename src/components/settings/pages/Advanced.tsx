import {
  DropDownMenuItem,
  HorizontalFlex,
  InfoIcon,
  Toggle,
  Tooltip,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { isProductionBuild } from '@src/utils/environment';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Trans, useTranslation } from 'react-i18next';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

function TooltipContent({ text }: { text: React.ReactNode }) {
  return (
    <VerticalFlex width="240px">
      <Typography size={12} height="1.5">
        {text}
      </Typography>
    </VerticalFlex>
  );
}

export function Advanced({ goBack, navigateTo, width }: SettingsPageProps) {
  const { t } = useTranslation();
  const theme = useTheme();
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
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Advanced')}
      />

      <DropDownMenuItem
        data-testid="test-net-mode-menu-item"
        justify="space-between"
        padding="10px 16px"
      >
        <HorizontalFlex margin="0 0 0 6px" align="center">
          <Typography size={14} height="17px" margin="0 8px 0 0">
            {t('Testnet Mode')}
          </Typography>
          <Tooltip
            placement={'bottom'}
            content={
              <TooltipContent
                text={t(
                  'Testnet mode changes the interface to allow you to interact with supported testnets.'
                )}
              />
            }
          >
            <InfoIcon height="12px" color={theme.colors.text1} />
          </Tooltip>
        </HorizontalFlex>
        <Toggle
          isChecked={isDeveloperMode}
          onChange={() => {
            setDeveloperMode(!isDeveloperMode);
            history.push('/home');
          }}
        />
      </DropDownMenuItem>

      {!isProductionBuild() ? (
        <DropDownMenuItem
          data-testid="bridge-dev-env-menu-item"
          justify="space-between"
          padding="10px 16px"
        >
          <HorizontalFlex margin="0 0 0 6px" align="center">
            <Typography size={14} height="17px" margin="0 8px 0 0">
              {t('Bridge DEV Environment')}
            </Typography>
            <Tooltip
              placement={'bottom'}
              content={
                <TooltipContent
                  text={
                    <>
                      {
                        <Trans i18nKey="When both this AND Testnet Mode are enabled then the Bridge will use the DEV warden config.<br /><br />Only available for internal builds." />
                      }
                    </>
                  }
                />
              }
            >
              <InfoIcon height="12px" color={theme.colors.text1} />
            </Tooltip>
          </HorizontalFlex>
          <Toggle
            isChecked={isBridgeDevEnv}
            onChange={() => {
              setIsBridgeDevEnv(!isBridgeDevEnv);
            }}
          />
        </DropDownMenuItem>
      ) : undefined}

      <DropDownMenuItem
        data-testid="show-tokens-without-balance-option"
        justify="space-between"
        padding="10px 16px"
      >
        <Typography size={14} height="17px" margin="0 0 0 6px">
          {t('Show Tokens Without Balance')}
        </Typography>
        <Toggle
          isChecked={showTokensWithoutBalances}
          onChange={() => toggleShowTokensWithoutBalanceSetting()}
        />
      </DropDownMenuItem>

      <DropDownMenuItem
        data-testid="set-default-extension-option"
        justify="space-between"
        padding="12px 16px"
      >
        <Typography size={14} height="17px" margin="0 0 0 6px">
          {t('Set as Default Extension')}
        </Typography>
        <Toggle
          isChecked={isDefaultExtension}
          onChange={() => toggleIsDefaultExtension()}
        />
      </DropDownMenuItem>
    </VerticalFlex>
  );
}
