import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Status } from '#app-root/lots/schemas/lot.schema';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LessThanDate } from '#app-root/validations/less-than-date.validation';

export class CreateLotDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ enum: Status })
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @Min(0)
  currentPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @Min(0)
  estimatedPrice: number;

  @ApiProperty()
  @IsDate()
  @LessThanDate()
  @Transform(({ value }) => new Date(value))
  lotStartTime: Date;

  @ApiProperty()
  @IsDate()
  @LessThanDate('lotStartTime')
  @Transform(({ value }) => new Date(value))
  lotEndTime: Date;

  userId: string;
}
