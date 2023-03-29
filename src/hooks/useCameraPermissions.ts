import { useCallback, useEffect, useState } from 'react';

export default function useCameraPermissions() {
  const [observer, setObserver] = useState<PermissionStatus>();
  const [permissions, setPermissions] = useState<PermissionState>();

  const getPermissions = useCallback(async () => {
    const observer = await navigator.permissions.query({
      name: 'camera' as PermissionName,
    });
    observer.onchange = () => setPermissions(observer.state);

    setPermissions(observer.state);
    setObserver(observer);
  }, []);

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  useEffect(() => {
    const savedObserver = observer;

    return () => {
      if (savedObserver) {
        savedObserver.onchange = null;
      }
    };
  }, [observer]);

  return {
    permissions,
    refreshPermissions: getPermissions,
  };
}
