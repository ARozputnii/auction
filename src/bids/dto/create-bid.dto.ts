import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBidDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @Min(1)
  proposedPrice: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  lotId: string;
}
