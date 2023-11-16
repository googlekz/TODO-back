import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../global/entities/users.entity';
import { Repository } from 'typeorm';
import bcrypt = require('bcrypt');
import { TokenService } from '../helpers/token';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Users)
    private UsersRepository: Repository<Users>,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Вход в аккаунт
   * @param payload
   */
  async login(payload) {
    const { login, password } = payload;
    const user = await this.UsersRepository.findOne({
      where: {
        login,
      },
    });
    if (!user) {
      throw new HttpException(
        {
          status: 401,
          errors: ['Пользователь не найден'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw new HttpException(
        {
          status: 401,
          errors: ['Некорректный пароль'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const token = this.tokenService.generateTokens({
      login,
      password: hashPassword,
    });
    await this.tokenService.saveToken(user.id, token.refreshToken);
    return {
      ...token,
      login,
    };
  }

  /**
   * Выход из аккаунта
   * @param refreshToken
   */
  async logout(refreshToken) {
    return await this.tokenService.removeToken(refreshToken);
  }

  /**
   * Обновление токена
   */
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new HttpException(
        {
          status: 401,
          errors: ['Неавторизованный пользователь'],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenData = this.tokenService.findToken(refreshToken);
    if (!tokenData || !userData) {
      throw new HttpException(
        { status: 401, errors: ['Не удалось выйти'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { id, login, password } = await this.UsersRepository.findOne({
      where: {
        login: userData.login,
      },
    });
    const hashPassword = await bcrypt.hash(password, 3);
    const token = this.tokenService.generateTokens({
      login,
      password: hashPassword,
    });
    await this.tokenService.saveToken(id, token.refreshToken);
    return {
      ...token,
      login,
    };
  }
}
