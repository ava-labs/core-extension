import { Stack, styled, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdUnfoldMore } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { ClickableStack } from '../styled';
import { Account } from '@core/types';
import { useAccountInfoVisibility } from '@/contexts/AccountInfoVisibilityContext';
type Props = {
  account?: Account;
  accountName: string;
  formattedSum: string;
  currency: string;
};

const AccountName = styled(Typography)({
  lineHeight: 1,
  minWidth: 0,
  flex: '0 1 auto',
  textOverflow: 'ellipsis',
  overflowX: 'clip',
  overflowY: 'visible',
});

export const AccountSummaryInfo = ({
  accountName,
  formattedSum,
  currency,
}: Props) => {
  const history = useHistory();
  const theme = useTheme();
  const { setAccountInfoElement } = useAccountInfoVisibility();

  return (
    <ClickableStack
      position="relative"
      overflow="visible"
      maxWidth="75%"
      width="fit-content"
      rowGap={0.25}
      onClick={() => {
        history.push('/account-management');
      }}
    >
      <Stack direction="row" alignItems="center" mt={-0.5}>
        <AccountName
          noWrap
          variant="h2"
          color="text.secondary"
          ref={setAccountInfoElement}
        >
          {accountName}
        </AccountName>
        <MdUnfoldMore
          size={22}
          color={theme.palette.text.secondary}
          style={{ flexShrink: 0 }}
        />
      </Stack>

      <Stack direction="row" alignItems="baseline" gap={0.5}>
        <Typography variant="h2">{formattedSum}</Typography>
        <Typography variant="body3">{currency}</Typography>
      </Stack>
    </ClickableStack>
  );
};
