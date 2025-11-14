import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  TypographyProps,
  useTheme,
} from '@avalabs/k2-alpine';
import { WalletDetails } from '@core/types';
import { useSettingsContext, useWalletTotalBalance } from '@core/ui';
import {
  cloneElement,
  FC,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { RenamableTitle } from '../../RenamableTitle';
import { WalletIconProps } from '@/components/WalletIcon';
import { useHistory } from 'react-router-dom';
import { URL_SEARCH_TOKENS } from '@/pages/AccountManagement/utils/searchParams';
import { MdAdd, MdCircle } from 'react-icons/md';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ErrorIcon,
  Shrinkable,
} from './Styled';
interface WalletCardProps extends PropsWithChildren {
  id: WalletDetails['id'];
  name: WalletDetails['name'];
  icon: ReactElement<WalletIconProps>;
  initialExpanded: boolean;
  disableRename?: boolean;
  isActive: boolean;
  accountCount: number;
}

export const PrimaryWallet: FC<WalletCardProps> = ({
  children,
  disableRename,
  icon,
  id,
  initialExpanded,
  name,
  isActive,
  accountCount,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { push } = useHistory();
  const { isLoading, hasErrorOccurred, totalBalanceInCurrency } =
    useWalletTotalBalance(id);
  const { currencyFormatter } = useSettingsContext();

  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const sharedTitleProps: TypographyProps = {
    width: 1,
    variant: 'h6',
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
      <Accordion
        expanded={isExpanded}
        onChange={(_, expanded) => setIsExpanded(expanded)}
      >
        <AccordionSummary
          component="div"
          icon={cloneElement(icon, { expanded: isExpanded })}
          sx={{
            position: 'relative',
          }}
        >
          {isActive && (
            <MdCircle
              color={theme.palette.success.main}
              size={6}
              style={{
                position: 'absolute',
                left: '4px',
                top: `calc(${theme.spacing(2)} + 0.75em)`,
                zIndex: 1,
              }}
            />
          )}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="calc(100% - 32px)"
          >
            <Stack gap={0} sx={{ lineHeight: 1 }}>
              {disableRename ? (
                <Typography {...sharedTitleProps} sx={{ marginBottom: 0 }}>
                  {name}
                </Typography>
              ) : (
                <RenamableTitle
                  {...sharedTitleProps}
                  onRename={handleRename}
                  sx={{ marginBottom: 0 }}
                >
                  {name}
                </RenamableTitle>
              )}
              <Typography
                variant="subtitle3"
                color="text.secondary"
                sx={{ marginTop: 0, lineHeight: 1 }}
              >
                {t('{{count}} accounts', { count: accountCount })}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={0.5}>
              {isLoading && <CircularProgress size={14} />}
              {!isLoading && !hasErrorOccurred && (
                <Typography variant="h6" color="text.primary">
                  {currencyFormatter(totalBalanceInCurrency ?? 0)}
                </Typography>
              )}
              {!isLoading && hasErrorOccurred && (
                <>
                  <ErrorIcon size={16} />
                  <Typography
                    variant="subtitle3"
                    color="error"
                    component={Shrinkable}
                    whiteSpace="nowrap"
                    id="error-message"
                  >
                    {t('Unable to load balances')}
                  </Typography>
                </>
              )}
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
        <Stack alignItems="center" sx={{ py: 1.5 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<MdAdd />}
            sx={{
              borderRadius: theme.shape.mediumBorderRadius,
              textTransform: 'none',
            }}
          >
            {t('Add Account')}
          </Button>
        </Stack>
      </Accordion>
    </>
  );
};
