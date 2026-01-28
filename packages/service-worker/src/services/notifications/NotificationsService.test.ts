import { incrementalPromiseResolve, Monitoring } from '@core/common';
import { FirebaseService } from '../firebase/FirebaseService';
import { FirebaseEvents } from '@core/types';
import { StorageService } from '../storage/StorageService';
import { BalanceNotificationService } from './BalanceNotificationService';
import { NewsNotificationService } from './NewsNotificationService';
import { NotificationsService } from './NotificationsService';
import { sendRequest } from './utils/sendRequest';
import { NOTIFICATIONS_CLIENT_ID_STORAGE_KEY } from './constants';

jest.mock('./utils/sendRequest');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  incrementalPromiseResolve: jest.fn(),
  Monitoring: {
    sentryCaptureException: jest.fn(),
    SentryExceptionTypes: {
      NOTIFICATIONS: 'notifications',
    },
  },
}));

describe('NotificationsService', () => {
  const storageServiceMock = {
    loadUnencrypted: jest.fn(),
    saveUnencrypted: jest.fn(),
  };
  const firebaseServiceMock = {
    addFirebaseEventListener: jest.fn(),
    getFcmToken: jest.fn(),
  };
  const balanceNotificationServiceMock = {
    sendBalanceNotification: jest.fn(),
    init: jest.fn(),
  };
  const newsNotificationServiceMock = {
    sendNewsNotification: jest.fn(),
    init: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();

    jest
      .mocked(incrementalPromiseResolve)
      .mockImplementationOnce((prom) => prom());

    new NotificationsService(
      storageServiceMock as unknown as StorageService,
      firebaseServiceMock as unknown as FirebaseService,
      balanceNotificationServiceMock as unknown as BalanceNotificationService,
      newsNotificationServiceMock as unknown as NewsNotificationService,
    );
  });

  it('should subscribe to FCM_INITIALIZED event', () => {
    expect(firebaseServiceMock.addFirebaseEventListener).toHaveBeenCalledWith(
      FirebaseEvents.FCM_INITIALIZED,
      expect.any(Function),
    );
  });

  it('should capture error when fcm token is missing', async () => {
    // simulate FCM_INITIALIZED event
    await jest
      .mocked(firebaseServiceMock.addFirebaseEventListener)
      .mock.calls[0]?.[1]();

    expect(Monitoring.sentryCaptureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error while registering device: fcm token is missing',
      }),
      Monitoring.SentryExceptionTypes.NOTIFICATIONS,
    );

    expect(balanceNotificationServiceMock.init).not.toHaveBeenCalled();
    expect(newsNotificationServiceMock.init).not.toHaveBeenCalled();
  });

  it('should capture error when device registration fails', async () => {
    jest.mocked(sendRequest).mockResolvedValueOnce(undefined);
    jest
      .mocked(firebaseServiceMock.getFcmToken)
      .mockReturnValueOnce('fcmToken');

    // simulate FCM_INITIALIZED event
    await jest
      .mocked(firebaseServiceMock.addFirebaseEventListener)
      .mock.calls[0]?.[1]();

    expect(Monitoring.sentryCaptureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error while registering device: device arn is missing',
      }),
      Monitoring.SentryExceptionTypes.NOTIFICATIONS,
    );

    expect(balanceNotificationServiceMock.init).not.toHaveBeenCalled();
    expect(newsNotificationServiceMock.init).not.toHaveBeenCalled();
  });

  it('should register device successfully', async () => {
    jest
      .mocked(firebaseServiceMock.getFcmToken)
      .mockReturnValueOnce('fcmToken');
    jest.mocked(storageServiceMock.loadUnencrypted).mockResolvedValueOnce({
      clientId: 'clientId',
    });
    jest.mocked(sendRequest).mockResolvedValueOnce({
      deviceArn: 'deviceArn',
    });
    jest
      .mocked(storageServiceMock.saveUnencrypted)
      .mockResolvedValueOnce(undefined);

    await expect(
      jest
        .mocked(firebaseServiceMock.addFirebaseEventListener)
        .mock.calls[0]?.[1](),
    ).resolves.toBeUndefined();

    expect(sendRequest).toHaveBeenCalledWith({
      path: 'v1/push/register',
      clientId: 'clientId',
      payload: {
        deviceToken: 'fcmToken',
      },
    });

    expect(storageServiceMock.saveUnencrypted).toHaveBeenCalledWith(
      NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
      { clientId: 'deviceArn' },
    );

    expect(balanceNotificationServiceMock.init).toHaveBeenCalledWith(
      'deviceArn',
    );
    expect(newsNotificationServiceMock.init).toHaveBeenCalledWith('deviceArn');
  });
});
