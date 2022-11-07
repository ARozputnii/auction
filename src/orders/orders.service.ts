import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '#app-root/orders/dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Order,
  OrderDocument,
  Status,
} from '#app-root/orders/schemas/order.schema';
import { UpdateOrderDto } from '#app-root/orders/dto/update-order.dto';
import { Lot, LotDocument } from '#app-root/lots/schemas/lot.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Lot.name) private readonly lotModel: Model<LotDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.orderModel.create(createOrderDto);
  }

  async update(
    _id: string,
    updateOrderDto: UpdateOrderDto,
    operation: string,
  ): Promise<Order> {
    const order = await this.orderModel.findOne({ _id });
    const currentUserId = updateOrderDto.currentUserId;

    this.checkAccessToOperation(order, operation);

    if (operation) {
      return await this.makeOperation(operation, order, currentUserId);
    } else {
      return await this.orderModel.findOneAndUpdate({ _id }, updateOrderDto, {
        new: true,
      });
    }
  }

  private async makeOperation(
    operation: string,
    order: Order,
    currentUserId: string,
  ) {
    if (operation === 'execute') {
      return await this.executeOperation(order, currentUserId);
    } else {
      return await this.receiveOperation(order, currentUserId);
    }
  }

  private async executeOperation(
    order: Order,
    currentUserId: string,
  ): Promise<Order> {
    const lot = await this.lotModel.findById(order.lotId);

    if (String(lot.userId) === currentUserId) {
      return await this.orderModel.findOneAndUpdate(
        { _id: order._id },
        { status: Status.sent },
        { new: true },
      );
    } else {
      throw new HttpException(
        'Available only to the lot winner.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async receiveOperation(
    order: Order,
    currentUserId: string,
  ): Promise<Order> {
    if (String(order.userId) === currentUserId) {
      return await this.orderModel.findOneAndUpdate(
        { _id: order._id },
        { status: Status.delivered },
        { new: true },
      );
    } else {
      throw new HttpException(
        'Available only to the owner of the order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private checkAccessToOperation(order: Order, operation: string): void {
    let status: string;

    if (operation === 'receive') {
      status = String(Status.sent);
    } else {
      status = String(Status.pending);
    }

    if (String(order.status) !== status) {
      throw new HttpException(
        `Available only for orders with ${Status[status]} status`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
