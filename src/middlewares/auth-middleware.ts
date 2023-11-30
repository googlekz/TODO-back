import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../helpers/token';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new HttpException(
          { status: 401, errors: ['token error'] },
          HttpStatus.BAD_REQUEST,
        );
      }
      const accessToken = authorization.split(' ')[1];
      if (!accessToken) {
        throw new HttpException(
          { status: 401, errors: ['token error'] },
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.tokenService.validateAccessToken(accessToken);
      next();
    } catch (e) {
      throw new HttpException(
        { status: 401, errors: ['token error'] },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
