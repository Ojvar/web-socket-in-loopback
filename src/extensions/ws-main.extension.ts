import {BindingKey, injectable} from '@loopback/core';
import {Server, Socket} from 'socket.io';
import {asWsHandler, IWsHandler} from '../services';

@injectable(asWsHandler)
export class WsMainHandler implements IWsHandler {
  static BINDING_KEY = BindingKey.create<WsMainHandler>(
    `services.${WsMainHandler.name}`,
  );

  constructor() {}

  path = '/';

  async onConnection(io: Server, socket: Socket): Promise<void> {
    socket.on('data', data => {
      console.log('/MAIN, Data received', {id: socket.id, data});
    });
  }
}
