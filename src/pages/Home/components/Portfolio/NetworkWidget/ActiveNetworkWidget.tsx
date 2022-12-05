import { Assetlist } from './Assetlist';
import {
  BridgeIcon,
  HorizontalFlex,
  HorizontalSeparator,
  LinkIcon,
  SecondaryButton,
  Skeleton,
  TextButton,
  Tooltip,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { NetworkCard } from './common/NetworkCard';
import { useHistory } from 'react-router-dom';
import { ZeroWidget } from './ZeroWidget';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { TokenIcon } from '@src/components/common/TokenImage';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import { useTranslation } from 'react-i18next';
import { getCoreWebUrl } from '@src/utils/getCoreWebUrl';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { ChainId } from '@avalabs/chains-sdk';

interface ActiveNetworkWidgetProps {
  assetList: TokenWithBalance[];
  activeNetworkBalance: number;
}

const Badge = styled.div`
  border-radius: 66px;
  background-color: ${({ theme }) => theme.palette.white};
  padding: 0 8px;
  user-select: none;
`;

const LogoContainer = styled.div`
  margin-top: 4px;
  margin-right: 16px;
`;

const StyledBridgeIcon = styled(BridgeIcon)`
  height: 14px;
  margin: 0 8px 0 0;
  color: ${({ theme }) => theme.colors.icon1};
`;

function TooltipContent({ text }: { text: React.ReactNode }) {
  return (
    <VerticalFlex width="120px">
      <Typography size={12}>{text}</Typography>
    </VerticalFlex>
  );
}

export function ActiveNetworkWidget({
  assetList,
  activeNetworkBalance,
}: ActiveNetworkWidgetProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const { network, isCustomNetwork } = useNetworkContext();
  const { currencyFormatter } = useSettingsContext();
  const { activeAccount } = useAccountsContext();

  if (!network || !assetList?.length) {
    return <Skeleton height="234px" delay={250} />;
  }

  const showCoreWebLink =
    network.chainId === ChainId.BITCOIN || isCustomNetwork(network.chainId)
      ? false
      : true;

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (network.chainId === ChainId.BITCOIN) {
      history.push('/token');
    } else {
      history.push('/tokenlist');
    }
  };

  return (
    <>
      <NetworkCard
        data-testid="active-network-card"
        display="block"
        onClick={handleCardClick}
      >
        <VerticalFlex height="100%">
          <HorizontalFlex
            justify="space-between"
            align="stretch"
            width="100%"
            height="100%"
          >
            <HorizontalFlex>
              <LogoContainer>
                <TokenIcon
                  width="32px"
                  height="32px"
                  src={network.logoUri}
                  name={network.chainName}
                >
                  <NetworkLogo width="40px" height="40px" padding="8px" />
                </TokenIcon>
              </LogoContainer>
              <VerticalFlex>
                <Typography
                  data-testid="active-network-name"
                  color={theme.colors.text1}
                  weight={600}
                  height="24px"
                  size={16}
                >
                  {network?.chainName}
                </Typography>
                <Typography
                  data-testid="active-network-total-balance"
                  color={theme.colors.text1}
                  weight={600}
                  height="24px"
                  size={16}
                >
                  {currencyFormatter(activeNetworkBalance)}
                </Typography>
              </VerticalFlex>
            </HorizontalFlex>
            <VerticalFlex justify="space-between" align="flex-end">
              <Badge>
                <Typography
                  color={theme.palette.grey[900]}
                  size={10}
                  height="17px"
                >
                  {t('Active')}
                </Typography>
              </Badge>
              {showCoreWebLink ? (
                <Tooltip
                  placement={'left'}
                  content={<TooltipContent text={t('View in Core Web')} />}
                >
                  <TextButton
                    as="a"
                    target="_blank"
                    href={getCoreWebUrl(
                      activeAccount?.addressC,
                      network.chainId
                    )}
                    onClick={(e) => e.stopPropagation()}
                    data-testid="core-web-link-icon"
                  >
                    <LinkIcon height="12" color={theme.colors.icon1} />
                  </TextButton>
                </Tooltip>
              ) : null}
            </VerticalFlex>
          </HorizontalFlex>
        </VerticalFlex>
        {assetList.length ? (
          <>
            <HorizontalSeparator
              color={`${theme.colors.bg3}80`}
              margin="16px 0"
              width="auto"
            />
            <Assetlist assetList={assetList} />
          </>
        ) : (
          <ZeroWidget />
        )}
        {network.chainId === ChainId.BITCOIN ? (
          <SecondaryButton
            data-testid="btc-bridge-button"
            width="100%"
            margin="16px 0 0 0"
            onClick={(e) => {
              e.stopPropagation();
              history.push('/bridge');
            }}
          >
            <StyledBridgeIcon color={theme.colors.icon1} />
            {t('Bridge')}
          </SecondaryButton>
        ) : null}
      </NetworkCard>
    </>
  );
}
