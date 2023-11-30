import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TodoItem } from './todo-item.entity';
import { Users } from '../../global/entities/users.entity';

@Entity()
export class TodoGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('integer', { default: 0 })
  notification = 0;

  @OneToMany(() => TodoItem, (TodoItem) => TodoItem.TodoGroup)
  items: TodoItem[];

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @Column()
  userId: number;
}
