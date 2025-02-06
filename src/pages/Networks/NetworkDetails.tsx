import { Network } from '@avalabs/core-chains-sdk';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ClickAwayListener,
  EditIcon,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  MoreHorizontalIcon,
  Popper,
  Scrollbars,
  ScrollbarsRef,
  Stack,
  StarFilledIcon,
  StarIcon,
  TrashIcon,
  Typography,
  toast,
} from '@avalabs/core-k2-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

import {
  NetworkForm,
  NetworkFormAction,
  NetworkFormActions,
} from './NetworkForm';
import {
  NetworkDetailsDialogOptions,
  NetworkDetailsDialogs,
} from './NetworkDetailsDialogs';
import { useGoBack } from '@src/hooks/useGoBack';

export const NetworkDetails = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { networkId } = useParams<{ networkId: string }>();
  const selectedChainId = parseInt(networkId, 10);
  const {
    networks,
    isFavoriteNetwork,
    addFavoriteNetwork,
    removeFavoriteNetwork,
    setNetwork,
    network,
    isCustomNetwork,
    removeCustomNetwork,
  } = useNetworkContext();
  const [isOpen, setIsOpen] = useState(false);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollbarRef = useRef<ScrollbarsRef | null>(null);
  const { capture } = useAnalyticsContext();
  const goBack = useGoBack();

  const childRef = useRef<NetworkFormActions>(null);
  const [networkState, setNetworkState] = useState<Network>();
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const networkData = networks.find(
      (networkItem) => networkItem.chainId === selectedChainId,
    );

    setNetworkState(networkData);
  }, [networks, setNetworkState, selectedChainId]);

  if (!networkState) {
    return null;
  }

  const isFavorite = networkState && isFavoriteNetwork(networkState.chainId);
  const isCustom = networkState && isCustomNetwork(networkState.chainId);
  const canConnect = networkState.chainId !== network?.chainId;

  const onDeleteSuccess = () => {
    capture('CustomNetworkDeleted');
    toast.success(t('Custom Network Deleted!'), { duration: 2000 });
  };

  const onError = (e: string) => {
    setErrorMessage(e);
    scrollbarRef?.current?.scrollToTop();
  };

  const handleDialogPrimaryClick = (dialog: NetworkDetailsDialogOptions) => {
    switch (dialog) {
      case NetworkDetailsDialogOptions.DELETE_DIALOG:
        setIsDeleting(true);
        removeCustomNetwork(selectedChainId)
          .then(() => {
            goBack();
            onDeleteSuccess();
          })
          .catch((e) => {
            setIsDeleteDialog(false);
            onError(e);
          })
          .finally(() => {
            setIsDeleting(false);
          });
        break;
      default:
        return null;
    }
  };

  return (
    <Stack sx={{ width: 1 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          pr: 1,
        }}
      >
        <PageTitle margin="12px 0">
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              pr: 1,
              gap: 0.5,
            }}
          >
            <IconButton
              data-testid="favorite-button"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (!isFavorite) {
                  addFavoriteNetwork(networkState.chainId);
                  return;
                }
                removeFavoriteNetwork(networkState.chainId);
              }}
            >
              {isFavorite ? (
                <StarFilledIcon size={24} />
              ) : (
                <StarIcon size={24} />
              )}
            </IconButton>

            {isCustom ? (
              <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <IconButton
                  onClick={() => setIsOpen(!isOpen)}
                  ref={selectButtonRef}
                  data-testid="network-options"
                >
                  <MoreHorizontalIcon />

                  <Popper
                    open={isOpen}
                    anchorEl={selectButtonRef.current}
                    placement="bottom-end"
                    transition
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps} timeout={250}>
                        <MenuList
                          dense
                          sx={{
                            width: 180,
                            p: 0,
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              history.push(`/networks/edit/${networkId}`);
                            }}
                            sx={{ flexDirection: 'row', gap: 1 }}
                          >
                            <EditIcon size={14} />
                            {t('Edit')}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setIsDeleteDialog(true);
                              setIsOpen(false);
                            }}
                            sx={{
                              flexDirection: 'row',
                              gap: 1,
                              color: 'error.main',
                            }}
                          >
                            <TrashIcon size={14} />
                            {t('Delete')}
                          </MenuItem>
                        </MenuList>
                      </Grow>
                    )}
                  </Popper>
                </IconButton>
              </ClickAwayListener>
            ) : (
              <Button
                variant="text"
                size="small"
                onClick={() => history.push(`/networks/edit/${networkId}`)}
              >
                {t('Edit')}
              </Button>
            )}
          </Stack>
        </PageTitle>
      </Stack>
      <Stack sx={{ px: 2, flexGrow: 1 }}>
        <Scrollbars ref={scrollbarRef}>
          <Stack sx={{ width: 1, gap: 3, pt: 1, alignItems: 'center' }}>
            <NetworkLogo
              height="80px"
              width="80px"
              padding="16px"
              src={networkState?.logoUri}
              defaultSize={80}
            />
            <Typography variant="h4">{networkState?.chainName}</Typography>
            {errorMessage && (
              <Typography variant="body2" color="error.main">
                {errorMessage}
              </Typography>
            )}
            {networkState && (
              <NetworkForm
                readOnly
                customNetwork={networkState}
                action={NetworkFormAction.Edit}
                isCustomNetwork={isCustom}
                ref={childRef}
              />
            )}
          </Stack>
        </Scrollbars>
      </Stack>
      {canConnect && (
        <Stack
          direction="row"
          sx={{ px: 2, py: 3, alignItems: 'center', gap: 1 }}
        >
          <Button
            fullWidth
            color="primary"
            size="large"
            onClick={() => setNetwork(networkState)}
          >
            {t('Connect Network')}
          </Button>
        </Stack>
      )}
      <NetworkDetailsDialogs
        isPrimaryButtonLoading={isDeleting}
        isDelete={isDeleteDialog}
        handlePrimaryClick={handleDialogPrimaryClick}
        hideDialog={() => setIsDeleteDialog(false)}
      />
    </Stack>
  );
};
