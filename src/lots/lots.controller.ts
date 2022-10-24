import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { LotsService } from '#app-root/lots/lots.service';
import { CreateLotDto } from '#app-root/lots/dto/create-lot.dto';
import { UpdateLotDto } from '#app-root/lots/dto/update-lot.dto';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerOptionsUtil } from '#app-root/utils/swagger-options.util';
import { MongoIdValidationPipe } from '#app-root/validations/mongo-id.validation.pipe';
import { CurrentUser } from '#app-root/auth/decorators/current-user.decorator';
import { IUser } from '#app-root/users/interfaces/user.interface';

@ApiTags('Lots')
@Controller('/lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.created('Return created lot'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @Post()
  create(
    @Body() createLotDto: CreateLotDto,
    @CurrentUser() currentUser: IUser,
  ) {
    createLotDto.userId = currentUser.id;
    return this.lotsService.create(createLotDto);
  }

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.ok('Return all lots'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @Get()
  findAll(@Query('own') own: boolean, @CurrentUser() currentUser: IUser) {
    const filters = { own, user: currentUser };
    return this.lotsService.findAll(filters);
  }

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.ok('Return one lot'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id', new MongoIdValidationPipe()) id: string) {
    return this.lotsService.findOne(id);
  }

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.ok('Return updated lot'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @ApiNotFoundResponse(SwaggerOptionsUtil.notFound())
  @Patch(':id')
  update(
    @Param('id', new MongoIdValidationPipe()) id: string,
    @Body() updateLotDto: UpdateLotDto,
  ) {
    return this.lotsService.update(id, updateLotDto);
  }

  @ApiBearerAuth('JWT')
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @ApiNotFoundResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new MongoIdValidationPipe()) id: string) {
    return this.lotsService.remove(id);
  }
}
