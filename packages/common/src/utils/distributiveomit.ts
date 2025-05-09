// if you want to remove properties from a union ype, you can use this
// currently working stackoverflow answer: https://stackoverflow.com/questions/57103834/typescript-omit-a-property-from-all-interfaces-in-a-union-but-keep-the-union-s/57103940#57103940

export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;
