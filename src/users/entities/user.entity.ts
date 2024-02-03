import { DateTimeStampEntity } from 'src/common/date-time-stamp.entity';
import { Event } from 'src/events/entities/event.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends DateTimeStampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  bio: string;

  @Column()
  profilePicture: string;

  @ManyToMany(() => Event, (event) => event.volunteers)
  attendedEvents: Event[];
}
