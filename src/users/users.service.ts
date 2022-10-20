import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '#app-root/users/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '#app-root/users/dto/create-user.dto';
import { MongoErrorCodesEnum } from '#app-root/database/mongo-error-codes.enum';
import { IUser } from '#app-root/users/interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userParams: CreateUserDto): Promise<User> {
    if (userParams.password !== userParams.passwordConfirmation) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

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
    if (
      payload.passwordConfirmation &&
      payload.password !== payload.passwordConfirmation
    ) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

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
