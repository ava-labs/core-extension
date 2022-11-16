import {
  Card,
  CloseIcon,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { LedgerNano } from '@src/components/common/LedgerNano';
import styled, { useTheme } from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';

const CloseButton = styled(TextButton)`
  align-self: flex-end;
`;

const StyledCard = styled(Card)`
  padding: 16px;
  width: 343px;

  &.dialog {
    padding: 0px;
    margin-top: -10px;
    width: initial;
  }
`;

export function LedgerWrongVersion({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <StyledCard className={className}>
      <VerticalFlex align="center">
        <CloseButton onClick={() => onClose?.()}>
          <CloseIcon height="16px" color={theme.colors.icon1} />
        </CloseButton>
        <Typography size={18} weight={700} height="28px">
          {t('Update Required')}
        </Typography>
        <Typography
          align="center"
          size={14}
          height="20px"
          padding="8px 0 32px 0"
        >
          <Trans
            i18nKey="Please update the <typography>Avalanche Application</typography> on your Ledger device to continue."
            components={{
              typography: <Typography weight={600} />,
            }}
          />
        </Typography>
        <LedgerNano />
        <Typography size={14} height="20px" padding="24px 0 8px 0">
          <Trans
            i18nKey="Download <typography>Ledger Live</typography> to update."
            components={{
              typography: (
                <Typography color={theme.colors.secondary1} weight={600} />
              ),
            }}
          />
        </Typography>
      </VerticalFlex>
    </StyledCard>
  );
}
