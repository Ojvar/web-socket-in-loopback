import {
  BindingKey,
  BindingScope,
  BindingTemplate,
  CoreBindings,
  extensionFilter,
  extensionFor,
  Getter,
  inject,
  injectable,
  LifeCycleObserver,
  lifeCycleObserver,
} from '@loopback/core';
import { SocketIoApplication } from '../application';
import { Server, Socket } from 'socket.io';
import { HttpErrors } from '@loopback/rest';

export interface IWsHandler {
  path: string;
  onConnection(io: Server, socket: Socket): Promise<void>;
}

export const asWsHandler: BindingTemplate = binding => {
  extensionFor(WebSocketService.EP_NAME)(binding);
  binding.tag({ namespace: 'handlers' });
};

@lifeCycleObserver('services')
@injectable({ scope: BindingScope.APPLICATION })
export class WebSocketService implements LifeCycleObserver {
  static EP_NAME = 'SocketServer';
  static BINDING_KEY = BindingKey.create<WebSocketService>(
    `services.${WebSocketService.name}`,
  );

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: SocketIoApplication,
    @inject.getter(extensionFilter(WebSocketService.EP_NAME))
    private getHandlers: Getter<IWsHandler[]>,
  ) { }

  private _ws: Server;

  get ws(): Server {
    return this._ws;
  }

  async start(): Promise<void> {
    console.log('WS STARTING');
    const io = new Server(this.app.restServer.httpServer?.server, {
      // path: '/ws/',
      cors: { origin: '*' },
    });
    if (!io) {
      throw new HttpErrors.InternalServerError('Starting web socket failed');
    }
    this._ws = io;
    console.log('WS CREATED');

    const handlers = await this.getHandlers();
    handlers.forEach(handler => {
      console.log('CREATE EXTENSION : ', handler.path);
      io.of(handler.path).on(
        'connection',
        async (socket: Socket) => await handler.onConnection(io, socket),
      );
    });
  }

  stop() {
    this._ws.close(err => {
      console.error('Websocket Closing failed : ', err);
    });
  }
}
