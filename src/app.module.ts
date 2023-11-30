import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './login/login.module';
import { RegistrationModule } from './registration/registration.module';
import { TodoModule } from './todo/todo.module';
import { AuthMiddleware } from './middlewares/auth-middleware';
import { TokenService } from './helpers/token';
import { Token } from './global/entities/token.entity';

@Module({
  imports: [
    TodoModule,
    RegistrationModule,
    LoginModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        post: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  providers: [TokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes('todo/groups');
  }
}
