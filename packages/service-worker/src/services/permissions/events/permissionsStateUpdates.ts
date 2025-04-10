import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '../../../connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { PermissionEvents } from '../models';
import { PermissionsService } from '../PermissionsService';

@singleton()
export class PermissionStateUpdateEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private permissionsService: PermissionsService) {
    this.permissionsService.addListener(
      PermissionEvents.PERMISSIONS_STATE_UPDATE,
      (permissions) => {
        this.eventEmitter.emit('update', {
          name: PermissionEvents.PERMISSIONS_STATE_UPDATE,
          value: permissions,
        });
      },
    );
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void,
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
