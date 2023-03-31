import { PropsWithChildren } from 'react';
import { Tooltip } from '@avalabs/k2-components';
import { truncateAddress } from '@avalabs/utils-sdk';

interface TokenEllipsisProps {
  maxLength: number;
  text: string;
  className?: string;
}

export function TokenEllipsis({
  maxLength,
  text,
  className,
}: PropsWithChildren<TokenEllipsisProps>) {
  const name =
    text.length <= maxLength ? text : truncateAddress(text, maxLength / 2);
  return (
    <span className={className}>
      <Tooltip placement="bottom" title={text}>
        <>{name}</>
      </Tooltip>
    </span>
  );
}
