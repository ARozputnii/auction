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
import { ApiProperty } from '@nestjs/swagger';
import {IUser} from "#app-root/users/interfaces/user.interface";

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
  @Transform(({ value }) => new Date(value))
  lotStartTime: Date;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  lotEndTime: Date;

  userId: string;
}
