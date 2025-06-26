import { SelectChangeEvent, Typography } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { History } from 'history';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { AddressType, getLabelAndIcon, getNavigateToQRCode } from '../../utils';
import { ArrowDownIcon } from './components/Icons';
import * as Styled from './components/Styled';

type Props = {
  type: AddressType;
  account: Account;
};

const getOnAddressChange = (replace: History['replace'], accountId: string) => {
  const getNavigate = getNavigateToQRCode(replace, accountId);
  return (e: SelectChangeEvent<unknown>) => {
    getNavigate(e.target.value as AddressType)();
  };
};

const ICON_SIZE = 20;
const OPTIONS: AddressType[] = ['C', 'AVM', 'BTC', 'SVM'];

export const AddressSelector: FC<Props> = ({ type, account }) => {
  const { replace } = useHistory();

  return (
    <Styled.Select
      label=""
      fullWidth
      size="small"
      IconComponent={ArrowDownIcon}
      value={type}
      onChange={getOnAddressChange(replace, account.id)}
    >
      {OPTIONS.map((item) => {
        const { Icon, label } = getLabelAndIcon(item);
        return (
          <Styled.HidingMenuItem
            key={item}
            value={item}
            disabled={!account[`address${item}`]}
          >
            <Icon size={ICON_SIZE} />
            <Typography variant="subtitle1">{label}</Typography>
          </Styled.HidingMenuItem>
        );
      })}
    </Styled.Select>
  );
};
