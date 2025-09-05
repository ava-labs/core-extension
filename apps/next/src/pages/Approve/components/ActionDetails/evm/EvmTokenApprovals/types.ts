import { getApprovalValue } from './lib';

export type LimitType = 'requested' | 'unlimited' | 'custom';
export type SpendLimit = {
  type: LimitType;
  value?: bigint;
};

export type NullableApprovalValue = ReturnType<typeof getApprovalValue>;
export type ApprovalValue = NonNullable<NullableApprovalValue>;
