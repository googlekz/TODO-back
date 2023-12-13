import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoGroup } from './entities/todo-group.entity';
import { TokenService } from '../helpers/token';
import { LoginService } from '../login/login.service';
import { TodoItem } from './entities/todo-item.entity';

interface IGroup {
  title: string;
  userId: number;
}

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoGroup)
    private TodoGroupRepository: Repository<TodoGroup>,
    @InjectRepository(TodoItem)
    private TodoRepository: Repository<TodoItem>,
    private tokenService: TokenService,
    private loginService: LoginService,
  ) {}

  /**
   * Получить все группы и заметки
   * @param userId
   */
  async findAllGroups(userId) {
    return await this.TodoGroupRepository.find({
      relations: {
        items: true,
      },
      where: {
        userId,
      },
    });
  }

  /**
   * Получение userId по accessToken
   * @param accessToken
   */
  async getUserId(accessToken) {
    const { login } = await this.tokenService.validateAccessToken(accessToken);
    const { id } = await this.loginService.findUserFromLogin(login);
    return id;
  }

  /**
   * Вызов 2 функция на получение userId
   * @param req
   */
  async getUserIdFromToken(req) {
    const accessToken = await this.getAccessToken(req);
    return await this.getUserId(accessToken);
  }

  /**
   * Получение accessToken через headers
   * @param req
   */
  async getAccessToken(req) {
    const { authorization } = req.headers;
    return authorization.split(' ')[1];
  }

  /**
   * Создание группы
   * @param payload
   */
  async createGroup(payload: IGroup) {
    const newGroup = this.TodoGroupRepository.create(payload);
    return this.TodoGroupRepository.save(newGroup);
  }

  /**
   * Создание todo
   * @param payload
   */
  async createTodo(payload: ITodo) {
    const newTodo = this.TodoRepository.create({
      title: payload.title,
      todoGroupId: payload.groupId,
    });
    return this.TodoRepository.save(newTodo);
  }

  async updateItem(id, body) {
    const itemToUpdate = await this.TodoRepository.findOneBy({
      id,
    });

    itemToUpdate.isDone = body.isDone;
    await this.TodoRepository.save(itemToUpdate);
  }
}

interface ITodo {
  title: string;
  groupId: number;
}
