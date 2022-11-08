import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ArrivalType, Status } from '#app-root/orders/schemas/order.schema';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  arrivalLocation: string;

  @ApiProperty({ enum: Status })
  @IsNotEmpty()
  @IsEnum(ArrivalType)
  arrivalType: ArrivalType;

  @ApiProperty({ enum: Status })
  @IsMongoId()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  bidId: string;
}
