import { CreateOrderDto } from '#app-root/orders/dto/create-order.dto';

export interface CreatePayloadInterface {
  readonly createOrderDto: CreateOrderDto;
  readonly currentUserId: string;
}
