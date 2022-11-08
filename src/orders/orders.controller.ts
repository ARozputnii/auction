import { Body, Controller, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerOptionsUtil } from '#app-root/utils/swagger-options.util';
import { OrdersService } from '#app-root/orders/orders.service';
import { CreateOrderDto } from '#app-root/orders/dto/create-order.dto';
import { MongoIdValidationPipe } from '#app-root/validations/mongo-id.validation.pipe';
import { CurrentUser } from '#app-root/auth/decorators/current-user.decorator';
import { IUser } from '#app-root/users/interfaces/user.interface';
import { AllowedOperationsValidationPipe } from '#app-root/validations/allowed-operations.validation.pipe';
import { OrderOperationType } from '#app-root/orders/types/order-operation.type';
import { UpdateOrderDto } from '#app-root/orders/dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.created('Return created order'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: IUser,
  ) {
    return this.orderService.create({
      createOrderDto,
      currentUserId: currentUser.id,
    });
  }

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.created('Return updated order'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @Patch(':id')
  update(
    @Param('id', new MongoIdValidationPipe()) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() currentUser: IUser,
  ) {
    return this.orderService.update({
      id,
      updateOrderDto,
      currentUserId: currentUser.id,
    });
  }

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.created('Return updated order'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @Patch('switchStatus/:id')
  switchStatus(
    @Param('id', new MongoIdValidationPipe()) id: string,
    @Query(
      'operation',
      new AllowedOperationsValidationPipe(['execute', 'receive']),
    )
    operation: OrderOperationType,
    @CurrentUser() currentUser: IUser,
  ) {
    return this.orderService.switchStatus({
      id,
      currentUserId: currentUser.id,
      operation,
    });
  }
}
