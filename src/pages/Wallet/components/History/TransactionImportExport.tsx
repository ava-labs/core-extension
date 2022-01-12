import {
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionImportExport } from '@avalabs/wallet-react-components';

export function TransactionImportExport({
  item,
}: {
  item: TransactionImportExport;
}) {
  return (
    <HorizontalFlex width={'100%'} justify={'space-between'}>
      <Typography>{item.type}</Typography>
      <HorizontalFlex>
        <VerticalFlex>
          <SubTextTypography>Direction</SubTextTypography>
          <Typography>
            {item.source} to {item.destination}
          </Typography>
        </VerticalFlex>
      </HorizontalFlex>
      <VerticalFlex>
        <Typography>{item.amountDisplayValue} AVAX</Typography>
      </VerticalFlex>
      <VerticalFlex>
        <a target="blank" href={item.explorerLink}>
          Link
        </a>
      </VerticalFlex>
    </HorizontalFlex>
  );
}
