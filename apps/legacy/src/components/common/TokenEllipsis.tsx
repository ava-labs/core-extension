import { PropsWithChildren } from 'react';
import { SxProps, Tooltip } from '@avalabs/core-k2-components';
import { truncateAddress } from '@avalabs/core-utils-sdk';

interface TokenEllipsisProps {
  maxLength: number;
  text: string;
  className?: string;
  sx?: SxProps;
}

function isTruncated(maxLength, text) {
  return text.length > maxLength;
}

export function TokenEllipsis({
  maxLength,
  text,
  className,
  sx,
}: PropsWithChildren<TokenEllipsisProps>) {
  const name =
    text.length <= maxLength ? text : truncateAddress(text, maxLength / 2);
  return (
    <span className={className}>
      <Tooltip
        placement="bottom"
        title={text}
        disableHoverListener={!isTruncated(maxLength, text)}
        disableFocusListener={!isTruncated(maxLength, text)}
        sx={sx ?? { cursor: 'pointer' }}
      >
        <>{name}</>
      </Tooltip>
    </span>
  );
}
