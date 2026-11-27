import {
  createTransferManager,
  type TransferManager,
} from '@avalabs/fusion-sdk';
import { useEffect, useRef, useState } from 'react';

import { useFeatureFlagContext } from '@core/ui';
import { hasAtLeastOneElement, getEnabledTransferServices } from '@core/common';

import { asLateJoinCapable } from '../../lib/lateJoin';
import { useSigners } from './useSigners';
import { useTransferEnvironment } from './useTransferEnvironment';
import { useTransferServiceInitializers } from './useTransferServiceInitializers';

const getInitializedServices = (
  status: ReturnType<TransferManager['status']>,
) =>
  new Set(
    Object.entries(status.services)
      .filter(([, service]) => service?.status === 'initialized')
      .map(([type]) => type),
  );

type ManagerState = {
  key: string;
  manager?: TransferManager;
  error: boolean;
  statusRevision: number;
};

export const useTransferManager = ({ enabled = true } = {}) => {
  const { featureFlags } = useFeatureFlagContext();
  const [state, setState] = useState<ManagerState>();

  const signers = useSigners();
  const environment = useTransferEnvironment();
  const enabledServices = getEnabledTransferServices(featureFlags);
  const { serviceInitializers, capabilitySignature } =
    useTransferServiceInitializers(enabledServices, signers);

  const serviceInitializersRef = useRef(serviceInitializers);
  serviceInitializersRef.current = serviceInitializers;

  const hasInitializers = hasAtLeastOneElement(serviceInitializers);
  const key =
    enabled && environment && hasInitializers
      ? `${environment}:${enabledServices.join(',')}:${capabilitySignature}`
      : undefined;

  useEffect(() => {
    const initializers = serviceInitializersRef.current;

    if (!key || !environment || !hasAtLeastOneElement(initializers)) {
      setState(undefined);
      return;
    }

    // We need to use a flag to abort setting of the manager if the component is unmounted.
    // Otherwise we run into race-conditions (i.e. if two managers are created in quick succession).
    let aborted = false;
    let created: TransferManager | undefined;
    let unsubscribe: (() => void) | undefined;

    createTransferManager({
      environment,
      serviceInitializers: initializers,
    })
      .then((_manager) => {
        if (aborted) {
          asLateJoinCapable(_manager).dispose?.();
          return;
        }

        created = _manager;

        // Subscribing before the manager is exposed so a service joining in between is not missed.
        let revision = 0;
        let initializedServices = getInitializedServices(_manager.status());
        unsubscribe = asLateJoinCapable(_manager).onStatusChange?.(
          (nextStatus) => {
            const nextInitialized = getInitializedServices(nextStatus);
            const hasJoined = [...nextInitialized].some(
              (service) => !initializedServices.has(service),
            );
            initializedServices = nextInitialized;

            if (!hasJoined) {
              return;
            }

            revision += 1;
            setState((previous) =>
              previous?.manager === _manager
                ? { ...previous, statusRevision: revision }
                : previous,
            );
          },
        );

        setState({
          key,
          manager: _manager,
          error: false,
          statusRevision: revision,
        });
      })
      .catch((err) => {
        if (aborted) return;

        setState({
          key,
          manager: undefined,
          error: true,
          statusRevision: 0,
        });
        console.error('[useTransferManager]', err);
      });

    return () => {
      aborted = true;
      unsubscribe?.();

      if (created) {
        asLateJoinCapable(created).dispose?.();
      }
    };
  }, [key, environment]);

  const current = key !== undefined && state?.key === key ? state : undefined;

  return {
    manager: current?.manager,
    error: current?.error ?? false,
    statusRevision: current?.statusRevision ?? 0,
  };
};
