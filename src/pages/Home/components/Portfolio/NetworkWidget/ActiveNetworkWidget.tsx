import { Assetlist } from './Assetlist';
import {
  HorizontalFlex,
  HorizontalSeparator,
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

export function ActiveNetworkWidget({
  assetList,
  activeNetworkBalance,
}: ActiveNetworkWidgetProps) {
  const theme = useTheme();
  const history = useHistory();
  const { network } = useNetworkContext();
  const { currencyFormatter } = useSettingsContext();
  if (!network) {
    return null;
  }

  const handleCardClick = (e) => {
    e.stopPropagation();
    history.push('/tokenlist');
  };

  return (
    <>
      <NetworkCard
        data-testid="active-network-card"
        display="block"
        onClick={handleCardClick}
      >
        <VerticalFlex>
          <HorizontalFlex
            justify="space-between"
            align="flex-start"
            width="100%"
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
            <Badge>
              <Typography
                color={theme.palette.grey[900]}
                size={10}
                height="17px"
              >
                Active
              </Typography>
            </Badge>
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
      </NetworkCard>
    </>
  );
}
