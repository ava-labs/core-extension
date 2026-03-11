import { toast as k2Toast } from '@avalabs/k2-alpine';

const TOAST_DURATION_SUCCESS = 3000;
const TOAST_DURATION_INFO = 3000;
const TOAST_DURATION_ERROR = 5000;

export const toast: typeof k2Toast = {
  ...k2Toast,
  success: (title, options?) =>
    k2Toast.success(title, {
      duration: TOAST_DURATION_SUCCESS,
      ...options,
    }),
  info: (title, options?) =>
    k2Toast.info(title, {
      duration: TOAST_DURATION_INFO,
      ...options,
    }),
  error: (title, options?) =>
    k2Toast.error(title, {
      duration: TOAST_DURATION_ERROR,
      ...options,
    }),
};
