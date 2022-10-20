import { Module } from '@nestjs/common';
import { UsersModule } from '#app-root/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from '#app-root/auth/jwtOptions';
import { AuthService } from '#app-root/auth/auth.service';
import { LocalStrategy } from '#app-root/auth/local.strategy';
import { JwtStrategy } from '#app-root/auth/jwt.strategy';
import { AuthController } from '#app-root/auth/auth.controller';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register(jwtOptions)],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
