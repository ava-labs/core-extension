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
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 24px;
  font-weight: 600;
  margin: 0 16px 0 0;
`;

const TransparentInputBase = styled(AccountName)`
  border: none;
  background: transparent;
  flex-grow: 1;
  width: 200px;
  height: 24px;
`;

export function EditableAccountName({
  name,
  enabled,
  onSave,
}: EditableAccountNameProps) {
  const theme = useTheme();
  const [accountName, setAccountName] = useState(name);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setEdit(false);
    }
  }, [enabled]);

  const editAddress = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setEdit(true);
  };

  const onSaveClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setEdit(false);
    onSave(accountName);
  };

  return (
    <HorizontalFlex align="center" margin="0 32px 0 0">
      {edit && enabled ? (
        <>
          <TransparentInputBase
            as="input"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            autoFocus
          />
          <TextButton onClick={onSaveClicked}>Save</TextButton>
        </>
      ) : (
        <>
          <AccountName>{accountName}</AccountName>
          {enabled && (
            <PencilIcon color={theme.colors.text} onClick={editAddress} />
          )}
        </>
      )}
    </HorizontalFlex>
  );
}
