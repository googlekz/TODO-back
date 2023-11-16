import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { Users } from '../global/entities/users.entity';
import { Response } from 'express';
import { checkField } from '../helpers/validation';

@Controller('registration')
export class RegistrationControllers {
  constructor(private readonly registrationService: RegistrationService) {}

  /**
   * Запрос на создание пользователя
   * @param userData
   * @param res
   */
  @Post()
  async createUser(@Body() userData: Users, @Res() res: Response) {
    const condition =
      !userData ||
      !checkField('password', userData.password) ||
      !checkField('login', userData.login);

    if (condition) {
      throw new HttpException(
        {
          status: 400,
          errors: ['BAD REQUEST'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.registrationService.createUser(userData);
    res.cookie('refreshToken', user.refreshToken, {
      maxAge: 30 * 25 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(user);
  }
}
