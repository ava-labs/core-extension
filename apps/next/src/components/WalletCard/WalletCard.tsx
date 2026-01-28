import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { WalletDetails } from '@core/types';
import {
  useNavigation,
  useSettingsContext,
  useWalletTotalBalance,
} from '@core/ui';
import {
  cloneElement,
  FC,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { RenamableTitle } from '../../pages/AccountManagement/components/RenamableTitle';
import * as Styled from './Styled';
import { WalletIconProps } from '@/components/WalletIcon';
import { URL_SEARCH_TOKENS } from '@/pages/AccountManagement/utils/searchParams';
interface WalletCardProps extends PropsWithChildren {
  accountsNumber: number;
  id: WalletDetails['id'];
  name: WalletDetails['name'];
  icon: ReactElement<WalletIconProps>;
  initialExpanded: boolean;
  disableRename?: boolean;
  showActiveIndicator?: boolean;
}

export const WalletCard: FC<WalletCardProps> = ({
  accountsNumber,
  children,
  disableRename,
  icon,
  id,
  initialExpanded,
  name,
  showActiveIndicator,
}) => {
  const { t } = useTranslation();
  const { push } = useNavigation('slide');
  const { isLoading, hasErrorOccurred, totalBalanceInCurrency } =
    useWalletTotalBalance(id);
  const { currencyFormatter } = useSettingsContext();

  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const sharedTitleProps: TypographyProps = {
    width: 1,
    variant: 'h6',
    fontFamily: 'Aeonik',
    lineHeight: 1.5,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const handleRename: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    push({
      pathname: '/account-management/rename',
      search: new URLSearchParams({
        [URL_SEARCH_TOKENS.wallet]: id,
      }).toString(),
    });
  };

  return (
    <>
      <Styled.Accordion
        expanded={isExpanded}
        onChange={(_, expanded) => setIsExpanded(expanded)}
      >
        <Styled.AccordionSummary
          component="div"
          icon={
            <Stack direction="row" alignItems="center">
              {showActiveIndicator && (
                <Box
                  position="absolute"
                  left={4}
                  width={6}
                  height={6}
                  borderRadius="50%"
                  bgcolor="success.main"
                />
              )}
              {cloneElement(icon, { expanded: isExpanded })}
            </Stack>
          }
        >
          <Stack
            direction="row"
            alignItems="center"
            width="calc(100% - 32px)"
            justifyContent="space-between"
            gap={2}
            mr={1}
          >
            {disableRename ? (
              <Stack minWidth={0} overflow="hidden" flex={1}>
                <Typography {...sharedTitleProps}>{name}</Typography>
                <Typography variant="body3" color="text.disabled">
                  {accountsNumber > 1
                    ? t('{{count}} accounts', { count: accountsNumber })
                    : t('{{count}} account', { count: accountsNumber })}
                </Typography>
              </Stack>
            ) : (
              <Stack minWidth={0} overflow="hidden" flex={1}>
                <RenamableTitle {...sharedTitleProps} onRename={handleRename}>
                  {name}
                </RenamableTitle>
                <Typography variant="body3" color="text.disabled">
                  {accountsNumber > 1
                    ? t('{{count}} accounts', { count: accountsNumber })
                    : t('{{count}} account', { count: accountsNumber })}
                </Typography>
              </Stack>
            )}
            {isLoading && <CircularProgress size={14} sx={{ flexShrink: 0 }} />}
            {!isLoading && !hasErrorOccurred && (
              <Typography variant="h6" flexShrink={0}>
                {currencyFormatter(totalBalanceInCurrency ?? 0)}
              </Typography>
            )}
          </Stack>
        </Styled.AccordionSummary>
        <Styled.AccordionDetails>{children}</Styled.AccordionDetails>
      </Styled.Accordion>
    </>
  );
};
