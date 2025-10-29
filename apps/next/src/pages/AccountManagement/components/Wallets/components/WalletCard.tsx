import { CircularProgress, Stack, Typography } from '@avalabs/k2-alpine';
import { WalletDetails } from '@core/types';
import { useSettingsContext, useWalletTotalBalance } from '@core/ui';
import {
  cloneElement,
  FC,
  PropsWithChildren,
  ReactElement,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { RenamableTitle } from '../../RenamableTitle';
import * as Styled from './Styled';
import { WalletIconProps } from '@/components/WalletIcon';
interface WalletCardProps extends PropsWithChildren {
  id: WalletDetails['id'];
  name: WalletDetails['name'];
  icon: ReactElement<WalletIconProps>;
  initialExpanded: boolean;
  disableRename?: boolean;
}

export const WalletCard: FC<WalletCardProps> = ({
  children,
  disableRename,
  icon,
  id,
  initialExpanded,
  name,
}) => {
  const { t } = useTranslation();
  const { isLoading, hasErrorOccurred, totalBalanceInCurrency } =
    useWalletTotalBalance(id);
  const { currencyFormatter } = useSettingsContext();

  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const Title = disableRename ? Typography : RenamableTitle;

  return (
    <>
      <Styled.Accordion
        expanded={isExpanded}
        onChange={(_, expanded) => setIsExpanded(expanded)}
      >
        <Styled.AccordionSummary
          component="div"
          icon={cloneElement(icon, { expanded: isExpanded })}
        >
          <Stack
            direction="row"
            height="21px"
            alignItems="center"
            gap={0.5}
            width="calc(100% - 32px)"
          >
            <Title
              type="wallet"
              tokenId={id}
              width={1}
              variant="subtitle3"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {name}
            </Title>
            {isLoading && <CircularProgress size={14} />}
            {!isLoading && !hasErrorOccurred && (
              <Typography variant="body3" color="text.disabled">
                {currencyFormatter(totalBalanceInCurrency ?? 0)}
              </Typography>
            )}
            {!isLoading && hasErrorOccurred && (
              <>
                <Styled.ErrorIcon size={16} />
                <Typography
                  variant="subtitle3"
                  color="error"
                  component={Styled.Shrinkable}
                  whiteSpace="nowrap"
                  id="error-message"
                >
                  {t('Unable to load balances')}
                </Typography>
              </>
            )}
          </Stack>
        </Styled.AccordionSummary>
        <Styled.AccordionDetails>{children}</Styled.AccordionDetails>
      </Styled.Accordion>
    </>
  );
};
