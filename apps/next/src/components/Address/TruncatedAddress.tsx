import { FC } from 'react';
import {
  Tooltip,
  TooltipProps,
  truncateAddress,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';

export type TruncatedAddressProps = Omit<TypographyProps, 'children'> & {
  address: string;
  /**
   * Total number of characters left visible, matching k2-alpine's
   * `truncateAddress` contract: the leading chunk is `visibleChars - 4`
   * and the trailing chunk is always the last 4 characters.
   */
  visibleChars?: number;
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>;
};

/**
 * Renders a shortened address that always keeps the full value reachable.
 *
 * `truncateAddress` returns a *shortened string*, not a CSS ellipsis, so the
 * characters it drops are absent from the DOM entirely — selecting, copying or
 * inspecting the node cannot recover them. Every place we shorten an address
 * therefore has to offer the full value some other way, and this component is
 * that way: the tooltip carries it for sighted users and `data-address` keeps
 * it in the DOM for tests and assistive tooling.
 *
 * Prefer this over calling `truncateAddress` directly.
 */
export const TruncatedAddress: FC<TruncatedAddressProps> = ({
  address,
  visibleChars = 10,
  tooltipProps,
  ...typographyProps
}) => (
  <Tooltip title={address} {...tooltipProps}>
    <Typography
      variant="mono"
      color="text.secondary"
      data-address={address}
      {...typographyProps}
    >
      {truncateAddress(address, visibleChars)}
    </Typography>
  </Tooltip>
);
