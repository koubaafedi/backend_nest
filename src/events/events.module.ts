import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { OrganizerModule } from 'src/organizers/organizers.module';
import { UserModule } from 'src/users/users.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [TypeOrmModule.forFeature([Event]), OrganizerModule, UserModule],
})
export class EventModule {}
