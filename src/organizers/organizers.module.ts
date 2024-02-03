import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from './entities/organizer.entity';
import { OrganizersService } from './organizers.service';
import { OrganizersController } from './organizers.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [OrganizersController],
  providers: [OrganizersService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([Organizer]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [OrganizersService],
})
export class OrganizerModule {}
