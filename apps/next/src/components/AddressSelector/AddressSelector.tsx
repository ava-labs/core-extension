import { FC } from 'react';
import { Typography } from '@avalabs/k2-alpine';
import { Account, AddressType } from '@core/types';

import { getChainLabelAndIconByAddressType } from '@/utils/getChainLabelAndIconByAddressType';
import * as Styled from './components/Styled';
import { ArrowDownIcon } from './components/Icons';

type Props = {
  type: AddressType;
  account: Account;
  onChange: (e: AddressType) => void;
};

const ICON_SIZE = 20;
const OPTIONS: AddressType[] = ['C', 'AVM', 'BTC', 'SVM'];

export const AddressSelector: FC<Props> = ({ type, account, onChange }) => {
  return (
    <Styled.Select
      label=""
      fullWidth
      size="small"
      IconComponent={ArrowDownIcon}
      value={type}
      onChange={(e) => onChange(e.target.value as AddressType)}
      renderValue={(value) => {
        const { label } = getChainLabelAndIconByAddressType(
          value as AddressType,
        );
        return (
          <Typography variant="subtitle3" lineHeight={1}>
            {label}
          </Typography>
        );
      }}
    >
      {OPTIONS.map((item) => {
        const { Icon, label } = getChainLabelAndIconByAddressType(item);
        return (
          <Styled.HidingMenuItem
            key={item}
            value={item}
            disabled={!account[`address${item}`]}
          >
            <Icon size={ICON_SIZE} />
            <Typography variant="subtitle3">{label}</Typography>
          </Styled.HidingMenuItem>
        );
      })}
    </Styled.Select>
  );
};
