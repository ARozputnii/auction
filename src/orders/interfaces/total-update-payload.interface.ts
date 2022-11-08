import { UpdateOrderDto } from '#app-root/orders/dto/update-order.dto';

export interface TotalUpdatePayloadInterface {
  readonly id: string;
  readonly updateOrderDto: UpdateOrderDto;
  readonly currentUserId: string;
}
