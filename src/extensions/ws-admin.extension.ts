import {BindingKey, inject, injectable} from '@loopback/core';
import {Server, Socket} from 'socket.io';
import {asWsHandler, IWsHandler, UserService} from '../services';

@injectable(asWsHandler)
export class WsAdminHandler implements IWsHandler {
  static BINDING_KEY = BindingKey.create<WsAdminHandler>(
    `services.${WsAdminHandler.name}`,
  );

  constructor(
    @inject(UserService.BINDING_KEY) private userService: UserService,
  ) {}

  path = '/admin';

  async onConnection(io: Server, socket: Socket): Promise<void> {
    socket.on('data', data => {
      console.log('/ADMIN, Data received', {id: socket.id, data});

      this.userService.addNewUser(data.username ?? socket.id);
    });
  }
}
