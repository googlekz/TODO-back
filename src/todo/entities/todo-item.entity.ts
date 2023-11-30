import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TodoGroup } from './todo-group.entity';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('boolean', { default: false })
  isDone = false;

  @ManyToOne(() => TodoGroup, (TodoGroup) => TodoGroup.items)
  todoGroup: TodoGroup;

  @Column()
  todoGroupId: number;
}
