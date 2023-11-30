import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TodoGroup } from './todo-group.entity';
import { Users } from '../../global/entities/users.entity';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('boolean', { default: false })
  isDone = false;

  @ManyToOne(() => TodoGroup, (TodoGroup) => TodoGroup.id, { cascade: true })
  TodoGroup: TodoGroup;
}
