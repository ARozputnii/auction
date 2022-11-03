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

export class UpdateLotDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ enum: Status })
  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @Min(0)
  currentPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @Min(0)
  estimatedPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @LessThanDate()
  @Transform(({ value }) => new Date(value))
  lotStartTime: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @LessThanDate('lotStartTime')
  @Transform(({ value }) => new Date(value))
  lotEndTime: Date;
}
