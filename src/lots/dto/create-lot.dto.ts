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
import { User } from '#app-root/users/schemas/user.schema';

export class CreateLotDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @Min(0)
  currentPrice: number;

  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @Min(0)
  estimatedPrice: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  lotStartTime: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  lotEndTime: Date;

  userId: User;
}
