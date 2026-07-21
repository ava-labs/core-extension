import { HYPERCORE_CAIP_ID } from './isHyperliquidNetwork';

/** Relay / Fusion SDK chain id for HyperCore withdrawals (not a real EVM chain). */
export const FUSION_HYPERCORE_CAIP_ID = 'eip155:1337';

/** Map extension CAIP ids to the Fusion SDK boundary (HyperCore only today). */
export const toFusionCaipId = (caipId: string) =>
  caipId === HYPERCORE_CAIP_ID ? FUSION_HYPERCORE_CAIP_ID : caipId;

/** Map Fusion SDK CAIP ids back to extension network registry ids. */
export const fromFusionCaipId = (caipId: string) =>
  caipId === FUSION_HYPERCORE_CAIP_ID ? HYPERCORE_CAIP_ID : caipId;

export const caipIdsMatchForFusion = (a: string, b: string) =>
  toFusionCaipId(a) === toFusionCaipId(b);
