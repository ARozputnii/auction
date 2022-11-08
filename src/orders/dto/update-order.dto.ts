import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ArrivalType, Status } from '#app-root/orders/schemas/order.schema';

export class UpdateOrderDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  arrivalLocation: string;

  @ApiProperty({ enum: Status })
  @IsOptional()
  @IsEnum(ArrivalType)
  arrivalType: ArrivalType;
}
