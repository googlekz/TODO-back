import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../global/entities/users.entity';
import { RegistrationControllers } from './registration.controllers';
import { RegistrationService } from './registration.service';
import { Token } from '../global/entities/token.entity';
import { TokenService } from '../helpers/token';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Token])],
  controllers: [RegistrationControllers],
  providers: [RegistrationService, TokenService],
})
export class RegistrationModule {}
