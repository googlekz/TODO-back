import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../global/entities/users.entity';
import { Repository } from 'typeorm';
import bcrypt = require('bcrypt');
import { TokenService } from '../helpers/token';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Users)
    private UsersRepository: Repository<Users>,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Создание пользователя
   * @param userData
   */
  async createUser(userData: Users) {
    if (!userData) {
      throw new HttpException(
        {
          status: 400,
          errors: ['BAD REQUEST'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let { login } = userData;
    const { password } = userData;

    login = login.toLowerCase();

    const candidate = await this.UsersRepository.findOne({
      where: { login },
    });

    if (candidate) {
      throw new HttpException(
        {
          status: 409,
          errors: ['Login already exists'],
        },
        HttpStatus.CONFLICT,
      );
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const user = this.UsersRepository.create({
      login,
      password: hashPassword,
    });
    await this.UsersRepository.save(user);
    const token = this.tokenService.generateTokens({
      login,
      password: hashPassword,
    });
    await this.tokenService.saveToken(user.id, token.refreshToken);
    return {
      ...token,
      login: user.login,
    };
  }
}
