import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { MongoErrorCodesEnum } from '../database/mongo-error-codes.enum';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userParams: CreateUserDto): Promise<User> {
    const hashedPassword = await this.bcryptPassword(userParams.password);

    try {
      return await this.userModel.create({
        ...userParams,
        password: hashedPassword,
      });
    } catch (error) {
      if (error?.code === MongoErrorCodesEnum.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, payload: Partial<IUser>) {
    try {
      return this.userModel.updateOne({ _id: id }, payload);
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bcryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password.toString(), 10);
  }
}
