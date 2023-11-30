import jwt = require('jsonwebtoken');
import { Token } from '../global/entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private TokenRepository: Repository<Token>,
  ) {}

  /**
   * Генерация токена
   * @param payload
   */
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Сохранение токена
   * @param userId
   * @param refreshToken
   */
  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await this.TokenRepository.findOne({
      where: {
        userId: userId,
      },
    });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return this.TokenRepository.save(tokenData);
    }
    const newToken = this.TokenRepository.create({
      userId: userId,
      refreshToken,
    });
    await this.TokenRepository.save(newToken);
  }

  /**
   * Найти токен
   * @param refreshToken
   */
  async removeToken(refreshToken: string) {
    const tokenData = await this.findToken(refreshToken);
    if (tokenData) {
      return await this.TokenRepository.remove(tokenData);
    }
  }

  /**
   * Проверка access токена на актуальность
   * @param token
   */
  async validateAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  }

  /**
   * Проверка refresh токена на актуальность
   * @param token
   */
  async validateRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }

  /**
   * Удаление токена
   * @param refreshToken
   */
  async findToken(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        { status: 401, errors: ['Пустой токен'] },
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokenData = await this.TokenRepository.findOne({
      where: {
        refreshToken,
      },
    });

    if (tokenData) {
      return tokenData;
    }

    // throw new HttpException(
    //   { status: 401, errors: ['Не удалось выйти'] },
    //   HttpStatus.BAD_REQUEST,
    // );
  }
}
