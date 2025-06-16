import { CSSProperties, FC } from 'react';
import CurrentAccount from '../CurrentAccount';
import { Box, Button, List, MenuItem, Select, Stack } from '@avalabs/k2-alpine';
import QRCodeSVG from 'qrcode.react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { useAccountsContext } from '@core/ui';
import { AddressItem, getAddressItemProps, Chain } from '../AddressItem';
import { useTranslation } from 'react-i18next';
import * as Styled from '../Styled';
import { ChainListItem } from '../ChainListItem';

export const QRCode: FC = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(search);
  const accountId = searchParams.get('accountId');
  const chain = (searchParams.get('chain') ?? 'CChain') as Chain;
  const { getAccountById } = useAccountsContext();

  if (!accountId) {
    return <Redirect to="/account-management" />;
  }
  const account = getAccountById(accountId);

  if (!account) {
    return <Redirect to="/account-management" />;
  }

  const props = getAddressItemProps(chain, account);

  return (
    <Stack height={1} gap={2}>
      <CurrentAccount />
      <Box
        marginInline="auto"
        width={200}
        paddingInlineEnd={0.5}
        borderRadius={3}
        bgcolor="surface.primary"
      >
        <Select
          label=""
          fullWidth
          value={chain}
          onChange={(e) => {
            history.push({
              pathname: '/account-management/qr-code',
              search: new URLSearchParams({
                accountId,
                chain: e.target.value as string,
              }).toString(),
            });
          }}
        >
          {account.addressC && (
            <MenuItem value={'CChain' satisfies Chain}>
              <ChainListItem
                {...getAddressItemProps('CChain', account)}
                iconSize={20}
              />
            </MenuItem>
          )}
          {account.addressAVM && (
            <MenuItem value={'XChain' satisfies Chain}>
              <ChainListItem
                {...getAddressItemProps('XChain', account)}
                iconSize={20}
              />
            </MenuItem>
          )}
          {account.addressBTC && (
            <MenuItem value={'BTC' satisfies Chain}>
              <ChainListItem
                {...getAddressItemProps('BTC', account)}
                iconSize={20}
              />
            </MenuItem>
          )}
          {account.addressC && (
            <MenuItem value={'ETH' satisfies Chain}>
              <ChainListItem
                {...getAddressItemProps('ETH', account)}
                iconSize={20}
              />
            </MenuItem>
          )}
          {account.addressSVM && (
            <MenuItem value={'SOL' satisfies Chain}>
              <ChainListItem
                {...getAddressItemProps('SOL', account)}
                iconSize={20}
              />
            </MenuItem>
          )}
        </Select>
      </Box>

      <Box
        marginInline="auto"
        bgcolor="surface.primary"
        position="relative"
        padding={2}
        borderRadius={3}
      >
        <QRCodeSVG
          renderAs="svg"
          value={props.address ?? ''}
          level="Q"
          size={160}
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            '--font-size': '10px',
            '--radius': 4,
            '--total': props.label.length * 4 + 4 * 3,
            transform: 'translate(-50%, -50%)',
            background: 'inherit',
            width: 84,
            height: 84,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            '& [style*="--index"]': {
              content: `"${props.label}"`,
              fontSize: 'calc(var(--font-size, 2) * 1rem)',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform:
                'translate(-50%, -50%) rotate(calc(360deg / var(--total) * var(--index))) translateY(calc(var(--radius, 5) * -1ch))',
            },
          }}
        >
          <props.Icon id="qr-code-icon" size={50} />

          {new Array(4)
            .fill(props.label + ' * ')
            .join('')
            .split('')
            .map((char, index) => (
              <span key={index} style={{ '--index': index } as CSSProperties}>
                {char}
              </span>
            ))}
        </Box>
      </Box>

      <Box marginBlock="auto">
        <Styled.Card>
          <List>
            <AddressItem
              {...props}
              truncate={false}
              copyActionVisibility="always"
            />
          </List>
        </Styled.Card>
      </Box>
      <Button
        sx={{ mt: 'auto' }}
        variant="contained"
        size="small"
        color="secondary"
        onClick={() => {
          history.goBack();
        }}
      >
        {t('Dismiss')}
      </Button>
    </Stack>
  );
};
