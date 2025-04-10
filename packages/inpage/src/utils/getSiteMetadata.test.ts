import { getSiteMetadata } from './getSiteMetadata';

describe('src/background/providers/utils/getSiteMetadata', () => {
  beforeEach(() => {
    jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue(new URL('https://mockdomain.example') as any);
    jest.spyOn(document, 'title', 'get').mockReturnValue('DOCUMENT TITLE');
  });

  describe('name', () => {
    it('gets name from og:site_name', async () => {
      jest.spyOn(document, 'querySelector').mockImplementation((path) => {
        return {
          'head > meta[property="og:site_name"]': {
            content: 'OG SITE NAME',
          } as any,
          'head > meta[name="title"]': { content: 'META TITLE' } as any,
        }[path];
      });

      const metadata = await getSiteMetadata();
      expect(metadata.name).toEqual('OG SITE NAME');
    });
    it('gets name from meta title', async () => {
      jest.spyOn(document, 'querySelector').mockImplementation((path) => {
        return {
          'head > meta[name="title"]': { content: 'META TITLE' } as any,
        }[path];
      });

      const metadata = await getSiteMetadata();
      expect(metadata.name).toEqual('META TITLE');
    });
    it('gets name from document title', async () => {
      jest.spyOn(document, 'querySelector').mockReturnValue(null);

      const metadata = await getSiteMetadata();
      expect(metadata.name).toEqual('DOCUMENT TITLE');
    });
    it('fallbacks to hostname if nothing is available', async () => {
      jest.spyOn(document, 'querySelector').mockReturnValue(null);

      const metadata = await getSiteMetadata();
      expect(metadata.name).toEqual('DOCUMENT TITLE');
    });
  });

  describe('domain', () => {
    it('gets the domain from the hostname', async () => {
      const metadata = await getSiteMetadata();
      expect(metadata.domain).toEqual('mockdomain.example');
    });
  });

  describe('icon', () => {
    it('gets icon from head', (done) => {
      jest.spyOn(document, 'querySelectorAll').mockImplementation((path) => {
        return {
          'head > link[rel~="icon"]': [
            {
              href: 'https://site.example/icon.svg',
            },
          ] as any,
        }[path];
      });
      const imgElementMock = {} as any;
      const createElementSpy = jest
        .spyOn(document, 'createElement')
        .mockReturnValue(imgElementMock);

      getSiteMetadata().then((metadata) => {
        expect(metadata.icon).toEqual('https://site.example/icon.svg');
        done();
      });
      expect(createElementSpy).toHaveBeenCalledTimes(1);
      expect(imgElementMock.src).toBe('https://site.example/icon.svg');

      imgElementMock.onload();
    });
    it('checks if icon exists', async () => {
      jest.spyOn(document, 'querySelectorAll').mockImplementation((path) => {
        return {
          'head > link[rel~="icon"]': [
            {
              href: 'https://site.example/icon.svg',
            },
            {
              href: 'https://site.example/icon2.svg',
            },
          ] as any,
        }[path];
      });
      const imgElementMock1 = {} as any;
      const imgElementMock2 = {} as any;
      const createElementSpy = jest
        .spyOn(document, 'createElement')
        .mockReturnValueOnce(imgElementMock1)
        .mockReturnValueOnce(imgElementMock2);

      const promise = getSiteMetadata();
      expect(createElementSpy).toHaveBeenCalledTimes(1);
      expect(imgElementMock1.src).toBe('https://site.example/icon.svg');
      imgElementMock1.onerror();

      await new Promise(process.nextTick);

      expect(createElementSpy).toHaveBeenCalledTimes(2);
      expect(imgElementMock2.src).toBe('https://site.example/icon2.svg');
      imgElementMock2.onload();

      const metadata = await promise;
      expect(metadata.icon).toEqual('https://site.example/icon2.svg');
    });

    it('returns undefined when no icon available', (done) => {
      jest.spyOn(document, 'querySelectorAll').mockImplementation((path) => {
        return {
          'head > link[rel~="icon"]': [
            {
              href: 'https://site.example/icon.svg',
            },
          ] as any,
        }[path];
      });
      const imgElementMock = {} as any;
      const createElementSpy = jest
        .spyOn(document, 'createElement')
        .mockReturnValue(imgElementMock);

      getSiteMetadata().then((metadata) => {
        expect(metadata.icon).toEqual(undefined);
        done();
      });
      expect(createElementSpy).toHaveBeenCalledTimes(1);

      imgElementMock.onerror();
    });
  });
});
