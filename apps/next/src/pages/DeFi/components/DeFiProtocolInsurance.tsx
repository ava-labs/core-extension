import { Divider, Stack, Typography } from '@avalabs/k2-alpine';
import { DefiInsuranceBuyerItem } from '@core/types';
import { FC } from 'react';
import { useConvertedCurrencyFormatter } from '@core/ui';

type DeFiProtocolInsuranceProps = {
  items: DefiInsuranceBuyerItem[];
};

export const DeFiProtocolInsurance: FC<DeFiProtocolInsuranceProps> = ({
  items,
}) => {
  return (
    <Stack direction="column" gap={1}>
      {items.map(
        (
          { description, netUsdValue }: DefiInsuranceBuyerItem,
          index: number,
        ) => {
          const key = `defi-insurance-${index}`;
          return (
            <Stack key={key} direction="column" gap={0.5}>
              <DeFiProtocolInsuranceSection
                description={description}
                value={netUsdValue}
              />
              {items.length > 1 && <Divider variant="fullWidth" />}
            </Stack>
          );
        },
      )}
    </Stack>
  );
};

type DeFiProtocolInsuranceSectionProps = {
  description: string;
  value: number;
};

const DeFiProtocolInsuranceSection: FC<DeFiProtocolInsuranceSectionProps> = ({
  description,
  value,
}) => {
  const formatValue = useConvertedCurrencyFormatter();

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Typography noWrap variant="body3" color="text.secondary" flex={1}>
        {description}
      </Typography>

      <Typography variant="body3" color="text.secondary">
        {formatValue(value)}
      </Typography>
    </Stack>
  );
};
