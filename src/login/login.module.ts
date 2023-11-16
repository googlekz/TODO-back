import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../global/entities/users.entity';
import {
  LoginControllers,
  LogoutControllers,
  RefreshControllers,
} from './login.controllers';
import { LoginService } from './login.service';
import { TokenService } from '../helpers/token';
import { Token } from '../global/entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Token])],
  controllers: [LoginControllers, LogoutControllers, RefreshControllers],
  providers: [
    LoginService,
    TokenService,
    LogoutControllers,
    RefreshControllers,
  ],
})
export class LoginModule {}
