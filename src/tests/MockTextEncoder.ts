import { TextEncoder } from 'util';

// need to wrap the mock coming from node-utils since return type of the encode method is not type correct
export class MockTextEncoder {
  encoder: TextEncoder;
  readonly encoding: string;
  constructor() {
    this.encoder = new TextEncoder();
    this.encoding = this.encoder.encoding;
  }

  encode(input?: string): Uint8Array {
    return Uint8Array.from(this.encoder.encode(input));
  }

  encodeInto(src: string, dest: Uint8Array) {
    return this.encoder.encodeInto(src, dest);
  }
}
