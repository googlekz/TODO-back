import { Body, Controller, Post, Req, Res, Get } from '@nestjs/common';
import { LoginService } from './login.service';
import { Response } from 'express';

@Controller('login')
export class LoginControllers {
  constructor(private readonly loginService: LoginService) {}

  /**
   * Запрос на логирование
   * Добавление куки
   * @param body
   * @param res
   */
  @Post()
  async login(@Body() body, @Res() res: Response) {
    const login = await this.loginService.login(body);
    res.cookie('refreshToken', login.refreshToken, {
      maxAge: 30 * 25 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(login);
  }
}

@Controller('logout')
export class LogoutControllers {
  constructor(private readonly loginService: LoginService) {}

  /**
   * Запрос на выход из аккаунта
   * Очистка куки
   * @param req
   * @param res
   */
  @Post()
  async logout(@Req() req, @Res() res) {
    const { refreshToken } = req.cookies;
    const token = await this.loginService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  }
}

@Controller('refresh')
export class RefreshControllers {
  constructor(private readonly refreshService: LoginService) {}

  /**
   * Запрос на обновление токена
   * @param req
   * @param res
   */
  @Get()
  async refresh(@Req() req, @Res() res) {
    const { refreshToken } = req.cookies;
    const userData = await this.refreshService.refresh(refreshToken);
    // res.clearCookie('refreshToken');
    return res.json(userData);
  }
}
