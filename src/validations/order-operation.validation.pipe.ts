import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class OrderOperationValidationPipe implements PipeTransform {
  private get allowedOperations() {
    return ['execute', 'receive'];
  }

  transform(value: any) {
    if (value && !this.allowedOperations.includes(value)) {
      throw new HttpException(
        'This operation is not allowed for the order',
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}
