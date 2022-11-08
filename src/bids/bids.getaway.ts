import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Namespace } from 'socket.io';

@WebSocketGateway({
  namespace: 'bids',
})
@Injectable()
export class BidsGateway {
  @WebSocketServer() io: Namespace;
}
