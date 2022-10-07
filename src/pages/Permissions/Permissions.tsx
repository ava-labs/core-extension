import { useState, useRef, useEffect } from 'react';
import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  CheckmarkIcon,
  PrimaryButton,
  SecondaryButton,
  LoadingIcon,
  SecondaryDropDownMenu,
  CaretIcon,
  IconDirection,
  GlobeIcon,
  Card,
  ComponentSize,
  DropDownMenuItem,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import {
  Scrollbars,
  ScrollbarsRef,
} from '@src/components/common/scrollbars/Scrollbars';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { Account } from '@src/background/services/accounts/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import { usePermissionContext } from '@src/contexts/PermissionsProvider';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { ActionStatus } from '@src/background/services/actions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { t } from 'i18next';

const AccountName = styled(Typography)<{ selected: boolean }>`
  max-width: 165px;
  margin: 0 8px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  height: 17px;
  font-weight: ${({ selected }) => (selected ? '600' : '400')};
`;

export function PermissionsPage() {
  const requestId = useGetRequestId();
  const { permissions } = usePermissionContext();
  const theme = useTheme();
  const { accounts, activeAccount } = useAccountsContext();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const scrollbarsRef = useRef<ScrollbarsRef>(null);
  const selectedAccountRef = useRef<HTMLDivElement>(null);

  const {
    action: request,
    cancelHandler,
    updateAction,
  } = useApproveAction(requestId);

  useEffect(() => {
    if (!selectedAccount && activeAccount) {
      setSelectedAccount(activeAccount);
    }
  }, [activeAccount, selectedAccount]);

  useEffect(() => {
    if (!scrollbarsRef || !selectedAccountRef || !selectedAccount) {
      return;
    }
    if (selectedAccountRef.current?.offsetTop) {
      scrollbarsRef.current?.scrollTop(selectedAccountRef.current.offsetTop);
    }
  }, [selectedAccount, selectedAccountRef, scrollbarsRef]);

  const onApproveClicked = async () => {
    if (!selectedAccount) {
      return;
    }

    updateAction({
      status: ActionStatus.SUBMITTING,
      id: requestId,
      result: selectedAccount.index,
    });
  };

  if (!permissions || !request) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex
      width="100%"
      align={'center'}
      padding="0 16px"
      color={theme.colors.text1}
    >
      <HorizontalFlex padding="12px 0" width="100%">
        <Typography as="h1" size={20} height="29px" weight={600}>
          {t('Connect Wallet to site?')}
        </Typography>
      </HorizontalFlex>
      <SiteAvatar margin="8px 0 16px" justify="center" align="center">
        <TokenIcon
          height="48px"
          width="48px"
          src={request.displayData.domainIcon}
        >
          <GlobeIcon height="48px" width="48px" color={theme.colors.icon1} />
        </TokenIcon>
      </SiteAvatar>
      <Typography as="h2" weight="bold" size={18} height="22px">
        {request.displayData.domainName}
      </Typography>
      <Typography
        margin="2px 0 0 0"
        size={12}
        height="15px"
        color={theme.colors.text2}
      >
        {request.displayData.domainUrl}
      </Typography>
      <VerticalFlex margin="24px 0 0 0" flex={1} width="100%">
        <Typography size={12} height="15px" margin="0 0 4px">
          {t('Selected Account')}
        </Typography>
        <SecondaryDropDownMenu
          icon={
            <Card
              data-testid="connect-account-dropdown"
              padding="11px 16px"
              margin="0 0 8px"
              width="100%"
            >
              <HorizontalFlex
                width="100%"
                justify="space-between"
                align={'center'}
              >
                <AccountName selected={false}>
                  {selectedAccount?.name}
                </AccountName>
                <HorizontalFlex width="20px" height="20px">
                  <CaretIcon
                    direction={IconDirection.DOWN}
                    color={theme.colors.icon1}
                    height="20px"
                  />
                </HorizontalFlex>
              </HorizontalFlex>
            </Card>
          }
        >
          <VerticalFlex width="343px" height="168px">
            <Scrollbars
              style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
              ref={scrollbarsRef}
            >
              {accounts.map((account) => (
                <DropDownMenuItem
                  data-testid="connect-account-menu-item"
                  padding="11px 16px"
                  width="100%"
                  key={account.index}
                  onClick={() => setSelectedAccount(account)}
                  selected={account.index === selectedAccount?.index}
                  ref={
                    selectedAccount?.index === account.index
                      ? selectedAccountRef
                      : undefined
                  }
                >
                  <VerticalFlex padding="0px" width="100%">
                    <HorizontalFlex
                      width="100%"
                      justify="space-between"
                      align="center"
                    >
                      <AccountName
                        selected={selectedAccount?.index === account.index}
                      >
                        {account.name}
                      </AccountName>
                      {selectedAccount?.index === account.index && (
                        <CheckmarkIcon
                          height="16px"
                          color={theme.colors.text1}
                        />
                      )}
                      {selectedAccount?.index !== account.index &&
                        permissions[request.displayData.domainUrl]?.accounts[
                          account.addressC
                        ] && (
                          <CheckmarkIcon
                            height="16px"
                            color={theme.colors.success}
                          />
                        )}
                    </HorizontalFlex>
                  </VerticalFlex>
                </DropDownMenuItem>
              ))}
            </Scrollbars>
          </VerticalFlex>
        </SecondaryDropDownMenu>
      </VerticalFlex>
      <VerticalFlex width="100%" justify="space-between">
        <Typography
          size={12}
          height="15px"
          margin="0 0 16px"
          color={theme.colors.text2}
          align="center"
        >
          {t('Only connect to sites that you trust.')}
        </Typography>
        <HorizontalFlex justify="space-between">
          <SecondaryButton
            data-testid="connect-reject-btn"
            size={ComponentSize.LARGE}
            onClick={() => {
              cancelHandler();
              window.close();
            }}
            width="168px"
          >
            {t('Reject')}
          </SecondaryButton>
          <PrimaryButton
            data-testid="connect-approve-btn"
            size={ComponentSize.LARGE}
            onClick={() => onApproveClicked()}
            width="168px"
          >
            {t('Approve')}
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
