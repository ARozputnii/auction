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

export class UpdateLotDto {
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @Min(0)
  currentPrice: number;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @Min(0)
  estimatedPrice: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  lotStartTime: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  lotEndTime: Date;
}
