import { Network } from '@avalabs/chains-sdk';
import {
  CaretIcon,
  ComponentSize,
  EllipsisIcon,
  HorizontalFlex,
  IconDirection,
  PrimaryButton,
  SecondaryButton,
  StarIcon,
  StarOutlineIcon,
  TextButton,
  Typography,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import { ContainedDropdown } from '@src/components/common/ContainedDropdown';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import {
  Scrollbars,
  ScrollbarsRef,
} from '@src/components/common/scrollbars/Scrollbars';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import {
  NetworkForm,
  NetworkFormAction,
  NetworkFormActions,
} from './NetworkForm';
import { useTranslation } from 'react-i18next';
import { toast } from '@avalabs/k2-components';

const FlexScrollbars = styled(Scrollbars)`
  flex-grow: 1;
  max-height: unset;
  height: 100%;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;

const DropdownContent = styled(VerticalFlex)`
  flex-grow: 1;
  background: ${({ theme }) => theme.colors.bg3};
  border-radius: 0 0 8px 8px;
`;

const NetworkSwitcherItem = styled(HorizontalFlex)`
  color: ${({ theme }) => theme.colors.text1};
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.colors.bg2};
  }
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[700]};
  :last-of-type {
    border-bottom: none;
  }
`;

const NetworkLogoContainer = styled.div`
  padding: 16px;
`;

export const NetworkDetails = () => {
  const { t } = useTranslation();
  const theme = useTheme();
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
    saveCustomNetwork,
    updateDefaultNetwork,
  } = useNetworkContext();
  const { showDialog, clearDialog } = useDialog();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollbarRef = useRef<ScrollbarsRef | null>(null);
  const { capture } = useAnalyticsContext();

  const childRef = useRef<NetworkFormActions>(null);
  const [networkState, setNetworkState] = useState<Network>();

  useEffect(() => {
    const networkData = networks.find(
      (networkItem) => networkItem.chainId === selectedChainId
    );

    setNetworkState(networkData);
  }, [networks, setNetworkState, selectedChainId]);

  if (!networkState) {
    return null;
  }

  const goBack = () => {
    history.length <= 2 ? history.replace('/home') : history.goBack();
  };
  const isFavorite = networkState && isFavoriteNetwork(networkState.chainId);
  const isCustom = networkState && isCustomNetwork(networkState.chainId);

  const handleChange = (network: Network, isValid: boolean) => {
    setIsFormValid(isValid);
    setNetworkState({
      ...network,
    });
  };

  const onDeleteSuccess = () => {
    capture('CustomNetworkDeleted');
    toast.success(t('Custom Network Deleted!'), { duration: 2000 });
    history.push('/networks?activeTab=NETWORKS');
  };
  const onEditSuccess = () => {
    capture('CustomNetworkEdited');
    toast.success(t('Custom Network Edited!'), { duration: 2000 });
    setIsEdit(false);
    setErrorMessage('');
  };
  const onUpdateURLSuccess = () => {
    capture('DefaultNetworkRPCEdited');
    toast.success(t('RPC URL Updated!'), { duration: 2000 });
    setIsEdit(false);
    setErrorMessage('');
  };
  const onResetURLSuccess = () => {
    capture('DefaultNetworkRPCReset');
    toast.success(t('RPC URL Reset!'), { duration: 2000 });
    setIsEdit(false);
    setErrorMessage('');
  };

  const handleEdit = () => {
    if (!isCustom) {
      onUpdateRpcUrl();
    } else {
      saveCustomNetwork(networkState)
        .then(() => {
          onEditSuccess();
        })
        .catch((e) => onError(e));
    }
  };

  const onError = (e: string) => {
    setErrorMessage(e);
    scrollbarRef?.current?.scrollToTop();
  };

  const onDelete = () => {
    showDialog({
      title: t('Delete Network?'),
      body: t('Are you sure you want to delete this network?'),
      confirmText: t('Delete'),
      width: '343px',
      onConfirm: () => {
        clearDialog();
        goBack();
        removeCustomNetwork(selectedChainId)
          .then(() => {
            onDeleteSuccess();
          })
          .catch((e) => onError(e));
      },
      cancelText: t('Cancel'),
      onCancel: () => {
        clearDialog();
      },
    });
  };

  const onUpdateRpcUrl = () => {
    showDialog({
      title: t('Warning'),
      body: t('Core functionality may be unstable with custom RPC URLs.'),
      confirmText: t('Confirm Save'),
      width: '343px',
      onConfirm: () => {
        clearDialog();
        updateDefaultNetwork(networkState)
          .then(() => {
            onUpdateURLSuccess();
          })
          .catch((e) => onError(e));
      },
      cancelText: t('Back'),
      onCancel: () => {
        clearDialog();
      },
    });
  };

  const handleResetUrl = () => {
    showDialog({
      title: t('Reset RPC?'),
      body: t("Resetting the RPC URL will put it back to it's default URL. "),
      confirmText: t('Reset'),
      width: '343px',
      onConfirm: () => {
        clearDialog();
        // We're resetting the RPC url, so we want to send it as undefined to the backend.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { rpcUrl, ...networkWithoutRpcUrl } = networkState;

        updateDefaultNetwork(networkWithoutRpcUrl)
          .then(() => {
            onResetURLSuccess();
          })
          .catch((e) => onError(e));
      },
      cancelText: t('Back'),
      onCancel: () => {
        clearDialog();
      },
    });
  };

  return (
    <VerticalFlex width="100%" padding="0 16px 16px" position="relative">
      <HorizontalFlex
        justify="space-between"
        height="53px"
        align="center"
        padding="0 8px"
      >
        <TextButton data-testid="go-back-button" onClick={() => goBack()}>
          <CaretIcon
            height="20px"
            width="20px"
            color={theme.colors.icon1}
            direction={IconDirection.LEFT}
          />
        </TextButton>
        <HorizontalFlex align="center">
          <TextButton
            onClick={(e) => {
              e.stopPropagation();
              if (!isFavorite) {
                addFavoriteNetwork(networkState.chainId);
                return;
              }
              removeFavoriteNetwork(networkState.chainId);
            }}
            data-testid="favorite-button"
          >
            {isEdit ? null : !isFavorite ? (
              <StarOutlineIcon width="20px" color={theme.colors.icon1} />
            ) : (
              <StarIcon width="20px" color={theme.colors.icon1} />
            )}
          </TextButton>

          {isEdit ? null : isCustom ? (
            <TextButton
              padding="0 0 0 24px"
              onClick={() => setIsOpen(!isOpen)}
              ref={selectButtonRef}
              data-testid="network-options"
            >
              <EllipsisIcon height="6px" color={theme.colors.icon1} />
            </TextButton>
          ) : (
            <TextButton padding="0 0 0 16px" onClick={() => setIsEdit(true)}>
              Edit
            </TextButton>
          )}
          <ContainedDropdown
            isOpen={isOpen}
            width="120px"
            height="auto"
            anchorEl={selectButtonRef}
            setIsOpen={setIsOpen}
            margin="8px 16px 0 0"
            borderRadius="8px"
          >
            <DropdownContent>
              <VerticalFlex>
                <NetworkSwitcherItem
                  onClick={() => {
                    setIsOpen(false);
                    setIsEdit(true);
                  }}
                >
                  <Typography weight={600} size={14}>
                    {t('Edit')}
                  </Typography>
                </NetworkSwitcherItem>
                <NetworkSwitcherItem
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                >
                  <Typography weight={600} size={14}>
                    {t('Delete')}
                  </Typography>
                </NetworkSwitcherItem>
              </VerticalFlex>
            </DropdownContent>
          </ContainedDropdown>
        </HorizontalFlex>
      </HorizontalFlex>
      <FlexScrollbars ref={scrollbarRef}>
        <VerticalFlex width="100%">
          <VerticalFlex align="center" marginBottom="24px">
            <NetworkLogoContainer>
              <NetworkLogo
                height="80px"
                width="80px"
                padding="16px"
                src={networkState?.logoUri}
              />
            </NetworkLogoContainer>

            <Typography weight={700} size={18} height="22px">
              {networkState?.chainName}
            </Typography>
          </VerticalFlex>
          {errorMessage && (
            <Typography
              color={theme.colors.error}
              size={14}
              padding="8px 0"
              margin="0 0 16px 0"
            >
              {errorMessage}
            </Typography>
          )}
          {networkState && (
            <NetworkForm
              customNetwork={networkState}
              handleChange={handleChange}
              readOnly={!isEdit}
              action={NetworkFormAction.Edit}
              isCustomNetwork={isCustom}
              handleResetUrl={handleResetUrl}
              ref={childRef}
            />
          )}
        </VerticalFlex>
      </FlexScrollbars>
      {!isEdit && networkState.chainId !== network?.chainId && (
        <VerticalFlex
          align="center"
          grow="1"
          justify="flex-end"
          margin="24px 16px 8px"
        >
          <PrimaryButton
            size={ComponentSize.LARGE}
            width="100%"
            onClick={() => {
              setNetwork(networkState);
            }}
          >
            {t('Connect Network')}
          </PrimaryButton>
        </VerticalFlex>
      )}
      {isEdit && (
        <VerticalFlex
          padding="16px 0 0 0"
          align="center"
          grow="1"
          justify="flex-end"
          width="100%"
        >
          <HorizontalFlex width="100%">
            <SecondaryButton
              size={ComponentSize.LARGE}
              width="100%"
              margin="0 8px 0 0"
              onClick={() => {
                childRef.current?.resetFormErrors();
                setIsFormValid(true);
                setIsEdit(false);
                setErrorMessage('');
                setNetworkState(networkState);
              }}
            >
              {t('Cancel')}
            </SecondaryButton>
            <PrimaryButton
              size={ComponentSize.LARGE}
              width="100%"
              onClick={handleEdit}
              disabled={!isFormValid}
            >
              {t('Save')}
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
};
