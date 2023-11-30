import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from './entities/todo-item.entity';
import { TodoGroup } from './entities/todo-group.entity';
import { TodoControllers } from './todo.controllers';
import { TodoService } from './todo.service';
import { Token } from '../global/entities/token.entity';
import { TokenService } from '../helpers/token';
import { LoginService } from '../login/login.service';
import { Users } from '../global/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem, TodoGroup, Token, Users])],
  controllers: [TodoControllers],
  providers: [TodoService, TokenService, LoginService],
})
export class TodoModule {}
