import { ImportMissingKeysStatus } from '../types';

export const getEventByStatus = (status: ImportMissingKeysStatus) => {
  switch (status) {
    case 'waiting':
      return { name: 'EnableAddress_Waiting' };
    case 'importing':
      return { name: 'EnableAddress_Connected' };
    case 'request-approved':
      return { name: 'EnableAddress_Importing_Started' };
    case 'connected':
      return { name: 'EnableAddress_Request_Approved' };
    case 'request-rejected':
      return { name: 'EnableAddress_Error', error: 'request_rejected' };
    case 'incorrect-device-error':
      return { name: 'EnableAddress_Error', error: 'incorrect_device' };
    case 'import-error':
      return { name: 'EnableAddress_Error', error: 'import_failed' };
    default:
      return null;
  }
};
