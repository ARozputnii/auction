import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BidsService } from '#app-root/bids/bids.service';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerOptionsUtil } from '#app-root/utils/swagger-options.util';
import { CurrentUser } from '#app-root/auth/decorators/current-user.decorator';
import { IUser } from '#app-root/users/interfaces/user.interface';
import { MongoIdValidationPipe } from '#app-root/validations/mongo-id.validation.pipe';
import { CreateBidDto } from '#app-root/bids/dto/create-bid.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.created('Return created bid'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @Post(':lotId')
  create(
    @Param('lotId', new MongoIdValidationPipe()) lotId: string,
    @Body() createBidDto: CreateBidDto,
    @CurrentUser() currentUser: IUser,
  ) {
    createBidDto.userId = currentUser.id;
    createBidDto.lotId = lotId;

    return this.bidsService.create(createBidDto);
  }

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.ok('Return all bits'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @Get(':lotId')
  findAll(@Param('lotId', new MongoIdValidationPipe()) lotId: string) {
    return this.bidsService.findAll(lotId);
  }
}
