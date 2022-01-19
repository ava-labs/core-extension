import {
  HorizontalFlex,
  PencilIcon,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';

interface EditableAccountNameProps {
  name: string;
  enabled: boolean;
  onSave: (name: string) => void;
}

const AccountName = styled(Typography)`
  max-width: 245px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  margin: 0 8px 0 0;
`;

const TransparentInputBase = styled(AccountName)`
  border: none;
  background: transparent;
  flex-grow: 1;
  width: 100%;
  height: 22px;
`;

const StyledPencilIcon = styled(PencilIcon)`
  cursor: pointer;
`;

export function EditableAccountName({
  name,
  enabled,
  onSave,
}: EditableAccountNameProps) {
  const theme = useTheme();
  const [accountName, setAccountName] = useState<string>(name);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      setEdit(false);
    }
  }, [enabled]);

  const editAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdit(true);
  };

  const onSaveClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdit(false);
    onSave(accountName);
  };

  return (
    <HorizontalFlex
      width={edit ? '100%' : 'auto'}
      align="center"
      justify="space-between"
      padding="0 25px 0 0"
    >
      {edit && enabled ? (
        <>
          <TransparentInputBase
            as="input"
            value={accountName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAccountName(e.target.value);
            }}
            autoFocus
          />
          <TextButton onClick={onSaveClicked}>Save</TextButton>
        </>
      ) : (
        <>
          <AccountName>{accountName}</AccountName>
          {enabled && (
            <StyledPencilIcon
              height="16"
              color={theme.colors.text1}
              onClick={editAddress}
            />
          )}
        </>
      )}
    </HorizontalFlex>
  );
}
