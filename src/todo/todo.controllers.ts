import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoControllers {
  constructor(private todoService: TodoService) {}

  @Get('groups')
  async findAllGroups(@Req() req) {
    const userId = await this.todoService.getUserIdFromToken(req);

    return await this.todoService.findAllGroups(userId);
  }

  @Post('groups')
  async createGroup(@Req() req, @Body() body) {
    const userId = await this.todoService.getUserIdFromToken(req);

    return this.todoService.createGroup({
      title: body.title,
      userId,
    });
  }

  @Post('item')
  async createTodo(@Body() body) {
    return this.todoService.createTodo({
      title: body.title,
      groupId: body.groupId,
    });
  }
}
