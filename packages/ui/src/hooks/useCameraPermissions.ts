import { useCallback, useEffect, useState } from 'react';

export function useCameraPermissions() {
  const [observer, setObserver] = useState<PermissionStatus>();
  const [permissions, setPermissions] = useState<PermissionState>();

  const getPermissions = useCallback(async () => {
    const permissionsObserver = await navigator.permissions.query({
      name: 'camera' as PermissionName,
    });
    permissionsObserver.onchange = () =>
      setPermissions(permissionsObserver.state);

    setPermissions(permissionsObserver.state);
    setObserver(permissionsObserver);
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
