export function serializeLedgerError(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }
  if (e && typeof e === 'object') {
    // DMK errors carry their info on enumerable/own fields (e.g. `_tag`,
    // `errorCode`, `originalError`) rather than a `message`.
    try {
      const own = Object.fromEntries(
        Object.getOwnPropertyNames(e).map((key) => [key, Reflect.get(e, key)]),
      );
      const json = JSON.stringify(own);
      if (json && json !== '{}') {
        return json;
      }
      const tag = '_tag' in e ? e._tag : undefined;
      return String(tag ?? e.constructor?.name ?? e);
    } catch {
      return String(e);
    }
  }
  return String(e);
}
