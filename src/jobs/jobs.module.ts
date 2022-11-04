import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import bullConfig from '#app-root/config/bull.config';
import { BullRootModuleOptions } from '@nestjs/bull/dist/interfaces/bull-module-options.interface';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [bullConfig],
        }),
      ],
      useFactory: async (configService: ConfigService) =>
        configService.get<BullRootModuleOptions>('bullConfig'),
      inject: [ConfigService],
    }),
  ],
})
export class JobsModule {}
