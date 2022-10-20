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

@ApiTags('Lots')
@Controller('/lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.created('Return created lot'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @Post()
  create(@Body() createLotDto: CreateLotDto, @Request() req) {
    createLotDto.userId = req.user.id;
    return this.lotsService.create(createLotDto);
  }

  @ApiBearerAuth('JWT')
  @ApiResponse(SwaggerOptionsUtil.ok('Return all lots'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @Get()
  findAll() {
    return this.lotsService.findAll();
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
