import { Network } from '@avalabs/chains-sdk';
import {
  CaretIcon,
  ComponentSize,
  CustomToast,
  EllipsisIcon,
  HorizontalFlex,
  IconDirection,
  PrimaryButton,
  SecondaryButton,
  StarIcon,
  StarOutlineIcon,
  TextButton,
  toast,
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
import { useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { NetworkForm, NetworkFormAction } from './NetworkForm';

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
  } = useNetworkContext();
  const { showDialog, clearDialog } = useDialog();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollbarRef = useRef<ScrollbarsRef | null>(null);
  const { capture } = useAnalyticsContext();

  const networkData = networks.find(
    (networkItem) => networkItem.chainId === selectedChainId
  );
  const [networkState, setNetworkState] = useState(networkData);

  if (!networkData || !networkState) {
    return null;
  }

  const goBack = () => {
    history.length <= 2 ? history.replace('/home') : history.goBack();
  };
  const isFavorite = networkData && isFavoriteNetwork(networkData.chainId);
  const isCustom = networkData && isCustomNetwork(networkData.chainId);

  const handleChange = (network: Network) => {
    setNetworkState({
      ...network,
    });
  };

  const onDeleteSuccess = () => {
    capture('CustomNetworkDeleted');
    toast.custom(<CustomToast label="Custom Network Deleted!" />);
    history.push('/networks?activeTab=NETWORKS');
  };
  const onEditSuccess = () => {
    capture('CustomNetworkEdited');
    toast.custom(<CustomToast label="Custom Network Edited!" />);
    setIsEdit(false);
    setErrorMessage('');
  };

  const handleEdit = () => {
    saveCustomNetwork(networkState)
      .then(() => {
        onEditSuccess();
      })
      .catch((e) => onError(e));
  };

  const onError = (e: string) => {
    setErrorMessage(e);
    scrollbarRef?.current?.scrollToTop();
  };

  const onDelete = () => {
    showDialog({
      title: 'Delete Network?',
      body: 'Are you sure you want to delete this network?',
      confirmText: 'Delete',
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
      cancelText: 'Cancel',
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
        <TextButton onClick={() => goBack()}>
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
                addFavoriteNetwork(networkData.chainId);
                return;
              }
              removeFavoriteNetwork(networkData.chainId);
            }}
          >
            {!isFavorite ? (
              <StarOutlineIcon width="20px" color={theme.colors.icon1} />
            ) : (
              <StarIcon width="20px" color={theme.colors.icon1} />
            )}
          </TextButton>

          {isCustom && (
            <TextButton
              padding="0 0 0 24px"
              onClick={() => setIsOpen(!isOpen)}
              ref={selectButtonRef}
            >
              <EllipsisIcon height="6px" color={theme.colors.icon1} />
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
                    Edit
                  </Typography>
                </NetworkSwitcherItem>
                <NetworkSwitcherItem
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                >
                  <Typography weight={600} size={14}>
                    Delete
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
                src={networkData?.logoUri}
              />
            </NetworkLogoContainer>

            <Typography weight={700} size={18} height="22px">
              {networkData?.chainName}
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
            />
          )}
        </VerticalFlex>
      </FlexScrollbars>
      {!isEdit && networkData.chainId !== network?.chainId && (
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
              setNetwork(networkData);
            }}
          >
            Connect
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
                setIsEdit(false);
                setErrorMessage('');
                setNetworkState(networkData);
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size={ComponentSize.LARGE}
              width="100%"
              onClick={handleEdit}
            >
              Save
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
};
