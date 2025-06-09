import { Typography } from '@/components/Typography';
import { AccordionDetails, CircularProgress, Stack } from '@avalabs/k2-alpine';
import { WalletDetails } from '@core/types';
import { useSettingsContext, useWalletTotalBalance } from '@core/ui';
import { cloneElement, FC, ReactElement, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './Styled';
import { ViewPChainButton } from './ViewPChainButton';
import { WalletIconProps } from './WalletIcon';
interface WalletCardProps {
  id: WalletDetails['id'];
  name: WalletDetails['name'];
  icon: ReactElement<WalletIconProps>;
  initialExpanded: boolean;
  children: ReactElement[];
}

export const WalletCard: FC<WalletCardProps> = ({
  id,
  name,
  icon,
  initialExpanded,
  children,
}) => {
  const { t } = useTranslation();
  const detailsRef = useRef<HTMLDivElement>(null);
  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    hasBalanceOnUnderivedAccounts,
  } = useWalletTotalBalance(id);
  const { currencyFormatter } = useSettingsContext();

  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <>
      <Styled.Accordion
        expanded={isExpanded}
        onChange={(_, expanded) => setIsExpanded(expanded)}
      >
        <Styled.NarrowSummary
          icon={cloneElement(icon, { expanded: isExpanded })}
        >
          <Stack
            direction="row"
            height="21px"
            alignItems="center"
            gap={0.5}
            width="calc(100% - 8px)"
          >
            <Typography
              variant="titleBold"
              marginInlineEnd="auto"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {name}
            </Typography>
            {isLoading && <CircularProgress size={14} />}
            {!isLoading && !hasErrorOccurred && (
              <Typography variant="title" color="text.disabled">
                {currencyFormatter(totalBalanceInCurrency ?? 0)}
              </Typography>
            )}
            {!isLoading && hasErrorOccurred && (
              <>
                <Styled.ErrorIcon size={16} />
                <Typography
                  variant="title"
                  color="error"
                  component="span"
                  whiteSpace="nowrap"
                >
                  {t('Unable to load balances')}
                </Typography>
              </>
            )}
          </Stack>
        </Styled.NarrowSummary>
        <AccordionDetails
          ref={detailsRef}
          sx={{
            paddingInline: 1.5,
          }}
        >
          {children}
        </AccordionDetails>
      </Styled.Accordion>
      {hasBalanceOnUnderivedAccounts && <ViewPChainButton />}
    </>
  );
};
