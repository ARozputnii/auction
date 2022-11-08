import { OrderOperationType } from '#app-root/orders/types/order-operation.type';

export interface UpdateStatusPayloadInterface {
  readonly id: string;
  readonly currentUserId: string;
  readonly operation: OrderOperationType;
}
