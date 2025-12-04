import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdUnfoldMore } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { ClickableStack } from '../styled';
import { AddressList } from '@/components/AddressList';
import { Account } from '@core/types';
import { useState, useEffect, useRef } from 'react';

type Props = {
  account?: Account;
  accountName: string;
  formattedSum: string;
  currency: string;
  onWidthChange?: (width: number) => void;
};

export const AccountSummaryInfo = ({
  account,
  accountName,
  formattedSum,
  currency,
  onWidthChange,
}: Props) => {
  const history = useHistory();
  const theme = useTheme();
  const [isAddressListHovered, setIsAddressListHovered] = useState(false);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !onWidthChange) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        onWidthChange(Math.ceil(entry.contentRect.width));
      }
    });

    observer.observe(element);
    onWidthChange(Math.ceil(element.getBoundingClientRect().width));

    return () => observer.disconnect();
  }, [onWidthChange]);

  return (
    <Stack
      ref={containerRef}
      position="relative"
      overflow="visible"
      sx={{ maxWidth: '75%', width: 'fit-content' }}
    >
      <ClickableStack
        onClick={() => {
          history.push('/account-management');
        }}
        onMouseEnter={() => setIsAccountHovered(true)}
        onMouseLeave={() => setIsAccountHovered(false)}
      >
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Typography noWrap variant="h2" color="text.secondary">
            {accountName}
          </Typography>
          <MdUnfoldMore size={16} color={theme.palette.text.secondary} />
        </Stack>

        <Stack direction="row" alignItems="baseline" gap={0.5}>
          <Typography variant="h2">{formattedSum}</Typography>
          <Typography variant="body3">{currency}</Typography>
        </Stack>
      </ClickableStack>
      <AddressList
        isAddressAppear={isAccountHovered || isAddressListHovered}
        activeAccount={account}
        onMouseEnter={() => setIsAddressListHovered(true)}
        onMouseLeave={() => setIsAddressListHovered(false)}
      />
    </Stack>
  );
};
