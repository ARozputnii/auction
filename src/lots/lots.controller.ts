import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { LotsService } from '#app-root/lots/lots.service';
import { CreateLotDto } from '#app-root/lots/dto/create-lot.dto';
import { UpdateLotDto } from '#app-root/lots/dto/update-lot.dto';

@Controller('/lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  create(@Body() createLotDto: CreateLotDto, @Request() req) {
    createLotDto.userId = req.user.id;
    return this.lotsService.create(createLotDto);
  }

  @Get()
  findAll() {
    return this.lotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotDto: UpdateLotDto) {
    return this.lotsService.update(id, updateLotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotsService.remove(id);
  }
}
