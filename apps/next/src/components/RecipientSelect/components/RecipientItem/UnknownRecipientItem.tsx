import { FC } from 'react';
import { FaCheck, FaQuestion } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Fade,
  Stack,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';

import { AddressType } from '@core/types';

import { HexagonalIcon } from '@/components/HexagonalIcon';

import { UnknownRecipient } from '../../types';
import { StyledMenuItem } from './StyledMenuItem';

type UnknownRecipientItemProps = {
  recipient: UnknownRecipient;
  addressType: AddressType;
  isSelected: boolean;
};

export const UnknownRecipientItem: FC<UnknownRecipientItemProps> = ({
  recipient,
  addressType,
  isSelected,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <StyledMenuItem value={recipient.id} {...rest}>
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <HexagonalIcon size={32}>
          <Box display="flex" color="text.secondary">
            <FaQuestion />
          </Box>
        </HexagonalIcon>
        <Stack gap={0.25} flexGrow={1}>
          <Typography variant="body2" fontWeight="fontWeightMedium">
            {t('Unknown')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {truncateAddress(recipient.address, 20)}
          </Typography>
        </Stack>
        <Stack position="relative" height={12}>
          <Fade in={isSelected} mountOnEnter unmountOnExit>
            <FaCheck
              className="check"
              style={{ position: 'absolute', right: 0 }}
            />
          </Fade>
        </Stack>
      </Stack>
    </StyledMenuItem>
  );
};
