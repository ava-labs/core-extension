import { TokenEllipsis } from './TokenEllipsis';
import {
  Typography,
  ChevronDownIcon,
  Stack,
  ChevronUpIcon,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

export interface Token {
  icon?: JSX.Element;
  name?: string;
}

export interface TokenSelectorProps {
  token?: Token | null;
  onClick?: () => void;
  isOpen?: boolean;
  hideCaretIcon?: boolean;
  label?: string;
}

export function TokenSelector({
  token,
  onClick,
  isOpen,
  hideCaretIcon,
  label,
}: TokenSelectorProps) {
  const { t } = useTranslation();
  return (
    <Stack
      onClick={hideCaretIcon ? undefined : onClick}
      sx={{
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        cursor: hideCaretIcon ? 'default' : 'pointer',
        pr: 2,
      }}
    >
      {!token && (
        <>
          <Typography variant="body2" sx={{ mr: 1 }} fontWeight={600}>
            {label || t('Select')}
          </Typography>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </>
      )}
      {token && (
        <>
          {token.icon}
          <Typography variant="body2" sx={{ mx: 1 }} fontWeight={600}>
            <TokenEllipsis
              maxLength={7}
              text={token.name || ''}
              sx={{ cursor: hideCaretIcon ? 'default' : 'pointer' }}
            />
          </Typography>
          {!hideCaretIcon ? (
            isOpen ? (
              <ChevronUpIcon />
            ) : (
              <ChevronDownIcon />
            )
          ) : null}
        </>
      )}
    </Stack>
  );
}
