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
  SecondaryDropDownMenuItem,
  CaretIcon,
  IconDirection,
  GlobeIcon,
  SecondaryCard,
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

const SiteAvatar = styled(VerticalFlex)<{ margin: string }>`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: ${({ margin }) => margin ?? '0px'};
`;

const AccountName = styled(Typography)`
  max-width: 165px;
  margin: 0 8px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 600;
`;

export function PermissionsPage() {
  const params = new URLSearchParams(window.location.search);
  const domain = params.get('domainUrl') as string;
  const domainName = params.get('domainName') as string;
  const domainIcon = params.get('domainIcon') as string;
  const { permissions, updateAccountPermission } = usePermissionContext();
  const theme = useTheme();
  const { accounts, activeAccount, selectAccount } = useAccountsContext();
  const [selectedAccount, setSelectedAccount] = useState<Account>(
    activeAccount || accounts[0]
  );
  const scrollbarsRef = useRef<ScrollbarsRef>(null);
  const selectedAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollbarsRef || !selectedAccountRef || !selectedAccount) {
      return;
    }
    if (selectedAccountRef.current?.offsetTop) {
      scrollbarsRef.current?.scrollTop(selectedAccountRef.current.offsetTop);
    }
  }, [selectedAccount, selectedAccountRef, scrollbarsRef]);

  const onApproveClicked = async () => {
    updateAccountPermission({
      addressC: selectedAccount.addressC,
      hasPermission: true,
      domain,
    });
    await selectAccount(selectedAccount.index);

    window.close();
  };

  if (!permissions) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex
      width="100%"
      align={'center'}
      padding={'16px'}
      color={theme.colors.text1}
    >
      <Typography as="h1" size={24} weight={700} margin="24px 0">
        Connect Wallet to Site?
      </Typography>
      <SiteAvatar margin="16px" justify="center" align="center">
        <TokenIcon height="48px" width="48px" src={domainIcon}>
          <GlobeIcon height="48px" width="48px" color={theme.colors.text1} />
        </TokenIcon>
      </SiteAvatar>
      <Typography as="h2" weight="bold" size={18} height="22px">
        {domainName}
      </Typography>
      <Typography
        margin="2px"
        size={12}
        weight={400}
        color={theme.colors.text2}
        height="15px"
      >
        {domain}
      </Typography>
      <VerticalFlex margin="24px 0 16px 0" flex={1} width="100%">
        <Typography size={12} margin="8px 0">
          Selected account
        </Typography>
        <SecondaryDropDownMenu
          icon={
            <SecondaryCard padding="16px" width="100%">
              <HorizontalFlex
                width="100%"
                justify="space-between"
                align={'center'}
              >
                <AccountName>{selectedAccount?.name}</AccountName>
                <CaretIcon
                  direction={IconDirection.DOWN}
                  color={theme.colors.text1}
                  height="12px"
                />
              </HorizontalFlex>
            </SecondaryCard>
          }
        >
          <VerticalFlex width="305.5px" height="168px">
            <Scrollbars
              style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
              ref={scrollbarsRef}
            >
              {accounts.map((account) => (
                <SecondaryDropDownMenuItem
                  width="100%"
                  key={account.index}
                  onClick={() => setSelectedAccount(account)}
                  selected={account.index === selectedAccount.index}
                  ref={
                    selectedAccount.index === account.index
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
                      <AccountName>{account.name}</AccountName>
                      {selectedAccount.index === account.index && (
                        <CheckmarkIcon
                          height="16px"
                          color={theme.colors.text1}
                        />
                      )}
                      {selectedAccount.index !== account.index &&
                        permissions[domain]?.accounts[account.addressC] && (
                          <CheckmarkIcon
                            height="16px"
                            color={theme.colors.success}
                          />
                        )}
                    </HorizontalFlex>
                  </VerticalFlex>
                </SecondaryDropDownMenuItem>
              ))}
            </Scrollbars>
          </VerticalFlex>
        </SecondaryDropDownMenu>
      </VerticalFlex>
      <VerticalFlex width="100%" justify="space-between">
        <Typography
          size={12}
          margin="16px"
          color={theme.colors.text2}
          align="center"
        >
          Only connect to sites that you trust
        </Typography>
        <HorizontalFlex justify="space-between">
          <SecondaryButton onClick={() => window.close()} width="141px">
            Reject
          </SecondaryButton>
          <PrimaryButton onClick={() => onApproveClicked()} width="141px">
            Approve
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
