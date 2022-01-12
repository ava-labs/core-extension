import {
  HorizontalFlex,
  PencilIcon,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import { useEffect, useState } from 'react';
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
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
  margin: 0 8px 0 0;
`;

const TransparentInputBase = styled(AccountName)`
  border: none;
  background: transparent;
  flex-grow: 1;
  width: 200px;
  height: 22px;
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

  const editAddress = (e) => {
    e.stopPropagation();
    setEdit(true);
  };

  const onSaveClicked = (e) => {
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
            <PencilIcon
              height="16px"
              color={theme.colors.text1}
              onClick={editAddress}
            />
          )}
        </>
      )}
    </HorizontalFlex>
  );
}
