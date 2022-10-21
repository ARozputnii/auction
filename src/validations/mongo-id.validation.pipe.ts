import { NotFoundException } from '@nestjs/common';
import { Injectable, PipeTransform } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new NotFoundException();
    }

    return value;
  }
}
