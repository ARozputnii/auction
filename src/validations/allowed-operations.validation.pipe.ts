import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { OrderOperationType } from '#app-root/orders/types/order-operation.type';

@Injectable()
export class AllowedOperationsValidationPipe implements PipeTransform {
  private readonly operations: OrderOperationType;

  constructor(operations) {
    this.operations = operations;
  }

  transform(value: any) {
    if (value && !this.operations.includes(value)) {
      throw new HttpException(
        'This operation is not allowed for the order',
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}
