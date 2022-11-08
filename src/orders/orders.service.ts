import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Order,
  OrderDocument,
  Status,
} from '#app-root/orders/schemas/order.schema';
import { Lot, LotDocument } from '#app-root/lots/schemas/lot.schema';
import { UpdateStatusPayloadInterface } from '#app-root/orders/interfaces/update-status-payload.interface';
import { CreatePayloadInterface } from '#app-root/orders/interfaces/create-payload.interface';
import { TotalUpdatePayloadInterface } from '#app-root/orders/interfaces/total-update-payload.interface';
import { OrderOperationType } from '#app-root/orders/types/order-operation.type';

const OperationStatusMapping: Record<OrderOperationType, Status> = {
  receive: Status.sent,
  execute: Status.pending,
  update: Status.pending,
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Lot.name) private readonly lotModel: Model<LotDocument>,
  ) {}

  async create(createPayload: CreatePayloadInterface): Promise<Order> {
    const createParams = {
      ...createPayload.createOrderDto,
      userId: createPayload.currentUserId,
    };
    return await this.orderModel.create(createParams);
  }

  async update(updatePayload: TotalUpdatePayloadInterface): Promise<Order> {
    const order = await this.orderModel.findOne({ _id: updatePayload.id });

    if (String(order.userId) !== updatePayload.currentUserId) {
      throw new HttpException(
        'Available only to the owner of the order',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.checkAccessbyOperation(order);

    return await this.orderModel.findOneAndUpdate(
      { _id: updatePayload.id },
      updatePayload.updateOrderDto,
      {
        new: true,
      },
    );
  }

  async switchStatus(updatePayload: UpdateStatusPayloadInterface) {
    const order = await this.orderModel.findOne({ _id: updatePayload.id });

    this.checkAccessbyOperation(order, updatePayload.operation);

    if (updatePayload.operation === 'execute') {
      return await this.executeOperation(order, updatePayload.currentUserId);
    } else {
      return await this.receiveOperation(order, updatePayload.currentUserId);
    }
  }

  private async executeOperation(
    order: Order,
    currentUserId: string,
  ): Promise<Order> {
    const lot = await this.lotModel.findById(order.lotId);

    if (String(lot.userId) !== currentUserId) {
      throw new HttpException(
        'Available only to the lot winner.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.orderModel.findOneAndUpdate(
      { _id: order._id },
      { status: Status.sent },
      { new: true },
    );
  }

  private async receiveOperation(
    order: Order,
    currentUserId: string,
  ): Promise<Order> {
    if (String(order.userId) !== currentUserId) {
      throw new HttpException(
        'Available only to the owner of the order',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.orderModel.findOneAndUpdate(
      { _id: order._id },
      { status: Status.delivered },
      { new: true },
    );
  }

  private checkAccessbyOperation(order: Order, operation = 'update'): void {
    const status = order.status;

    if (String(OperationStatusMapping[operation]) !== String(status)) {
      throw new HttpException(
        `Not available for orders with this status`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
