import { isSafeRemoteUrl } from './isSafeRemoteUrl';

describe('src/utils/isSafeRemoteUrl.ts', () => {
  describe('isSafeRemoteUrl', () => {
    it('allows https URLs to public hosts', () => {
      expect(isSafeRemoteUrl('https://ipfs.io/ipfs/abc123')).toBe(true);
      expect(isSafeRemoteUrl('https://example.com/meta.json?a=1')).toBe(true);
      expect(isSafeRemoteUrl('https://8.8.8.8/meta.json')).toBe(true);
    });

    it('rejects non-https schemes', () => {
      expect(isSafeRemoteUrl('http://example.com/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('file:///etc/passwd')).toBe(false);
      expect(isSafeRemoteUrl('data:application/json;base64,e30=')).toBe(false);
      expect(isSafeRemoteUrl('ftp://example.com/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('chrome-extension://abc/meta.json')).toBe(false);
    });

    it('rejects malformed and relative URLs', () => {
      expect(isSafeRemoteUrl('')).toBe(false);
      expect(isSafeRemoteUrl('not a url')).toBe(false);
      expect(isSafeRemoteUrl('/relative/path.json')).toBe(false);
    });

    it('rejects loopback, private, link-local and mDNS hosts', () => {
      expect(isSafeRemoteUrl('https://localhost/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://localhost:8545/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://127.0.0.1/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://127.1.2.3/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://10.0.0.5/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://192.168.1.1/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://172.16.0.1/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://172.31.255.255/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://169.254.169.254/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://0.0.0.0/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://router.local/meta.json')).toBe(false);
    });

    it('rejects IPv6 literals', () => {
      expect(isSafeRemoteUrl('https://[::1]/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://[fc00::1]/meta.json')).toBe(false);
      expect(isSafeRemoteUrl('https://[2606:4700::1111]/meta.json')).toBe(
        false,
      );
    });

    it('does not reject public hosts that merely look private', () => {
      // 172.32.x is outside the RFC1918 172.16.0.0/12 block.
      expect(isSafeRemoteUrl('https://172.32.0.1/meta.json')).toBe(true);
      expect(isSafeRemoteUrl('https://localhost.example.com/meta.json')).toBe(
        true,
      );
    });
  });
});
