import { KeystoneService } from './KeystoneService';
import { ETHSignature, EthSignRequest } from '@keystonehq/bc-ur-registry-eth';

import { CBOR, KeystoneEvent } from '@core/types/src/models';

jest.mock('@keystonehq/bc-ur-registry-eth', () => {
  const actual = jest.requireActual('@keystonehq/bc-ur-registry-eth');
  return {
    DataType: actual.DataType,
    ETHSignature: {
      fromCBOR: jest.fn(),
    },
    EthSignRequest: {
      constructETHRequest: jest.fn(),
    },
  };
});

const tabId = 852;

describe('background/services/keystone/KeystoneService.ts', () => {
  const signatureBuffer = Buffer.from([]);
  const mockRegistryType = jest.fn().mockImplementation(() => {
    return {
      getTag: jest.fn().mockReturnValue(111),
      getType: jest.fn().mockReturnValue('222'),
    };
  });

  const mockedUR = {
    cbor: Buffer.from('cbor').toString('hex'),
    type: 'urType',
  };

  const mockedRequest = { toUR: jest.fn() };
  const requestId: any = 'uuid';

  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(ETHSignature, 'fromCBOR').mockImplementation(
      () =>
        ({
          getRegistryType: jest.fn().mockReturnValue(mockRegistryType),
          getSignature: jest.fn().mockReturnValue(signatureBuffer),
        }) as any as ETHSignature,
    );
    mockedRequest.toUR.mockReturnValue(mockedUR);
    jest
      .spyOn(EthSignRequest, 'constructETHRequest')
      .mockReturnValue(mockedRequest as any as EthSignRequest);

    jest.spyOn(crypto, 'randomUUID').mockReturnValue(requestId);
  });

  describe('onLock', () => {
    let service: KeystoneService;

    beforeEach(async () => {
      service = new KeystoneService();
      service.onUnlock();
    });

    it('cleans up subscriptions', () => {
      // @ts-expect-error keystoneRequestSubscription is private
      jest.spyOn(service.keystoneRequestSubscription, 'unsubscribe');

      service.onLock();

      expect(
        // @ts-expect-error keystoneRequestSubscription is private
        service.keystoneRequestSubscription?.unsubscribe,
      ).toHaveBeenCalled();
    });
  });

  describe('requestSignature', () => {
    let service: KeystoneService;

    beforeEach(async () => {
      service = new KeystoneService();
    });

    describe('when extension is locked', () => {
      beforeEach(() => {
        service.onLock();
      });

      it('does not pass the signature requests to the UI', () => {
        const eventListener = jest.fn();
        service.addListener(KeystoneEvent.DEVICE_REQUEST, eventListener);

        const qrCode: CBOR = {
          cbor: 'qr-code-contents',
          type: 'eth-sign-request',
        };
        service.requestSignature(qrCode);

        expect(eventListener).not.toHaveBeenCalled();
      });
    });

    describe('when extension is unlocked', () => {
      beforeEach(() => {
        service.onUnlock();
      });

      it('pushes the requests through the event emitter', (done) => {
        const eventListener = jest.fn();
        service.addListener(KeystoneEvent.DEVICE_REQUEST, eventListener);

        const qrCode: CBOR = {
          cbor: 'qr-code-contents',
          type: 'eth-sign-request',
        };

        // Send request & await device response
        const promise = service.requestSignature(qrCode, tabId);

        // Mock response
        service.submitSignatureResponse({
          requestId,
          ...mockedUR,
        });

        promise.then(() => {
          expect(eventListener).toHaveBeenCalledTimes(1);
          expect(eventListener).toHaveBeenCalledWith({
            requestId,
            tabId,
            ...qrCode,
          });
          done();
        });
      });

      it('only handles responses with matching requestId', (done) => {
        const eventListener = jest.fn();
        service.addListener(KeystoneEvent.DEVICE_REQUEST, eventListener);

        const qrCode: CBOR = {
          cbor: 'qr-code-contents',
          type: 'eth-sign-request',
        };

        // Send request & await device response
        const promise = service.requestSignature(qrCode, tabId);

        // Mock non-matching response
        const nonMatchingResponse = {
          requestId: 'wrong-uuid',
          type: 'eth-signature',
          cbor: 'a1b2c3d4',
        };
        service.submitSignatureResponse(nonMatchingResponse);

        // Mock matching respopnse after the non-matching one
        const matchingResponse = {
          requestId,
          type: 'eth-signature',
          cbor: 'd4c3b2a1',
        };
        service.submitSignatureResponse(matchingResponse);

        promise.then((result) => {
          expect(result).toEqual(Buffer.from(matchingResponse.cbor, 'hex'));
          done();
        });
      });
    });
  });
});
