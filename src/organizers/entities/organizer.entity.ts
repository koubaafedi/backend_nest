import { DateTimeStampEntity } from 'src/common/date-time-stamp.entity';
import { Event } from 'src/events/entities/event.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organizer extends DateTimeStampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  description: string;

  @Column()
  profilePicture: string;

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];
}
