import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ChainId } from '@avalabs/core-chains-sdk';
import {
  Collapse,
  Divider,
  GlobeIcon,
  IconButton,
  InfoCircleIcon,
  Scrollbars,
  Stack,
  StarFilledIcon,
  StarIcon,
  Tooltip,
  Typography,
  toast,
  useTheme,
} from '@avalabs/core-k2-components';

import { NetworkLogo } from '@/components/common/NetworkLogo';
import { useAccountsContext, useNetworkContext } from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import {
  ipfsResolverWithFallback,
  isChainSupportedByAccount,
} from '@core/common';
import { NetworkWithCaipId } from '@core/types';

import { NetworkListItem } from './NetworkListItem';
import {
  AnimatedGlobeIconContainer,
  AnimatedNetworkLogo,
  NetworkLogoContainer,
} from './NetworkLogo';

interface NetworkListProps {
  networkList: NetworkWithCaipId[];
}

export function NetworkList({ networkList }: NetworkListProps) {
  const { t } = useTranslation();
  const {
    accounts: { active },
  } = useAccountsContext();
  const {
    network,
    setNetwork,
    removeFavoriteNetwork,
    isFavoriteNetwork,
    addFavoriteNetwork,
  } = useNetworkContext();
  const history = useHistory();
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const [favoritedItem, setFavoritedItem] = useState<number | null>(null);

  if (!networkList.length) {
    return null;
  }

  return (
    <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
      <TransitionGroup component={null}>
        {networkList.map((networkItem, index) => {
          const isFavorite = isFavoriteNetwork(networkItem.chainId);
          const isSupportedByActiveAccount = isChainSupportedByAccount(
            networkItem,
            active,
          );
          return (
            <Collapse key={networkItem.chainId} className="item">
              {index > 0 && <Divider sx={{ mx: 2 }} />}
              <Tooltip
                wrapWithSpan={false}
                title={
                  isSupportedByActiveAccount
                    ? ''
                    : t('This network is not supported by your active account')
                }
              >
                <NetworkListItem
                  onClick={() => {
                    if (!isSupportedByActiveAccount) {
                      return;
                    }
                    setNetwork(networkItem);
                    toast.success(t('Active Network has changed!'), {
                      duration: 2000,
                    });
                    history.push('/home');
                  }}
                  role="button"
                  aria-disabled={!isSupportedByActiveAccount}
                  data-testid={`network-li-${index}`}
                  isActive={networkItem.chainId === network?.chainId}
                  sx={{
                    opacity: isSupportedByActiveAccount ? 1 : 0.5,
                    cursor: isSupportedByActiveAccount
                      ? 'pointer'
                      : 'not-allowed',
                  }}
                >
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
                    <NetworkLogoContainer>
                      <CSSTransition
                        key={networkItem.chainId}
                        timeout={500}
                        classNames="item"
                        appear
                        in={favoritedItem === networkItem.chainId}
                      >
                        {networkItem.logoUri ? (
                          <AnimatedNetworkLogo
                            src={ipfsResolverWithFallback(networkItem.logoUri)}
                            position={index + 1}
                            isFavorited={index === favoritedItem}
                          />
                        ) : (
                          <AnimatedGlobeIconContainer
                            position={index + 1}
                            isFavorited={index === favoritedItem}
                          >
                            <GlobeIcon
                              width="100%"
                              height="100%"
                              color={theme.palette.common.white}
                              size={32}
                            />
                          </AnimatedGlobeIconContainer>
                        )}
                      </CSSTransition>

                      <NetworkLogo
                        src={networkItem.logoUri}
                        width="32px"
                        height="32px"
                        position="absolute"
                        defaultSize={32}
                      />
                    </NetworkLogoContainer>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'fontWeightSemibold' }}
                    >
                      {networkItem.chainName}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ flexShrink: 0, alignItems: 'center' }}
                  >
                    {networkItem.chainId !== ChainId.AVALANCHE_MAINNET_ID && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isFavorite) {
                            setFavoritedItem(networkItem.chainId);
                            addFavoriteNetwork(networkItem.chainId);
                          } else {
                            setFavoritedItem(null);
                            removeFavoriteNetwork(networkItem.chainId);
                          }
                        }}
                        data-testid="favorite-network"
                      >
                        {isFavorite ? (
                          <StarFilledIcon size={24} />
                        ) : (
                          <StarIcon size={24} />
                        )}
                      </IconButton>
                    )}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        capture('NetworkDetailsClicked', {
                          chainId: networkItem.chainId,
                        });
                        history.push(
                          `/networks/details/${networkItem.chainId}`,
                        );
                      }}
                      data-testid="network-details"
                    >
                      <InfoCircleIcon size={24} />
                    </IconButton>
                  </Stack>
                </NetworkListItem>
              </Tooltip>
            </Collapse>
          );
        })}
      </TransitionGroup>
    </Scrollbars>
  );
}
