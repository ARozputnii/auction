import { Injectable } from '@nestjs/common';
import { DatabaseService } from '#app-root/database/database.service';
import { userMock } from '#test/mocks/entities/user.mock';
import { Connection } from 'mongoose';
import { User } from '#app-root/users/schemas/user.schema';
import { UsersService } from '#app-root/users/users.service';
import { Lot } from '#app-root/lots/schemas/lot.schema';
import { lotMock } from '#test/mocks/entities/lot.mock';
import { bidMock } from '#test/mocks/entities/bid.mock';
import { Bid } from '#app-root/bids/schemas/bid.schema';

@Injectable()
export class SeederService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly userService: UsersService,
  ) {}

  public get dbConnection(): Connection {
    return this.dbService.getDbHandle();
  }

  async run() {
    const user = await this.insertUser();
    const lot = await this.insertLot(user);
    const bid = await this.insertBid(user, lot);
    await this.dbConnection.close();

    return console.log(
      `created: \n User: ${user._id}\n Lot: ${lot._id}\n Bid: ${bid._id}`,
    );
  }

  private async insertUser(): Promise<User> {
    const userData = userMock();
    userData.email = 'user@mail.com';
    userData.password = await this.userService.bcryptPassword('123123');

    return await this.dbConnection.models.User.create(userData);
  }

  private async insertLot(user): Promise<Lot> {
    const lotData = lotMock(user._id);

    return await this.dbConnection.models.Lot.create(lotData);
  }

  private async insertBid(user, lot): Promise<Bid> {
    const bidData = bidMock(lot._id, user._id);

    return await this.dbConnection.models.Bid.create(bidData);
  }
}
