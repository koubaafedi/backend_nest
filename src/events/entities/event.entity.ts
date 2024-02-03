import { DateTimeStampEntity } from 'src/common/date-time-stamp.entity';
import { Organizer } from 'src/organizers/entities/organizer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Event extends DateTimeStampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column()
  picture: string;

  @ManyToOne(() => Organizer, (organizer) => organizer.events, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  organizer: Organizer;

  @ManyToMany(() => User, (user) => user.attendedEvents, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  volunteers: User[];
}
