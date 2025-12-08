import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdUnfoldMore } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { ClickableStack } from '../styled';
import { Account } from '@core/types';
import { TruncatedText } from '@/components/Header/components/styledComponents';

type Props = {
  account?: Account;
  accountName: string;
  formattedSum: string;
  currency: string;
  // onWidthChange?: (width: number) => void;
};

export const AccountSummaryInfo = ({
  accountName,
  formattedSum,
  currency,
  // onWidthChange,
}: Props) => {
  const history = useHistory();
  const theme = useTheme();

  return (
    <ClickableStack
      position="relative"
      overflow="visible"
      maxWidth="75%"
      width="fit-content"
      rowGap={0.5}
      onClick={() => {
        history.push('/account-management');
      }}
    >
      <Stack direction="row" alignItems="center" height={theme.spacing(3.7)}>
        <TruncatedText
          noWrap
          variant="h2"
          color="text.secondary"
          lineHeight={3.7}
          sx={{ minWidth: 0, flex: '0 1 auto' }}
          showEllipsis
        >
          {accountName}
        </TruncatedText>
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
