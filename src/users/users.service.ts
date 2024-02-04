import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CrudService } from 'src/common/crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Event } from 'src/events/entities/event.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService extends CrudService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super(userRepository);
  }
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User with id=${id} was not found`);
    }
    return user;
  }
  async signIn(email: string, password: string) {
    const user = await this.findByUserNameOrEmail(email);
    if (!user)
      throw new UnauthorizedException('Veuillez vérifier vos credentials !');

    const isLoggedIn = await bcrypt.compare(password, user.password);
    if (isLoggedIn) {
      const { password, ...payload } = user;

      return { access_token: this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Veuillez vérifier vos credentials !');
  }

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException(
        'Le username et le email doivent être unique',
      );
    }
  }

  findByUserNameOrEmail(identifier: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ username: identifier }, { email: identifier }],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const { username, email, password, bio, profilePicture } = updateUserDto;

    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    return await this.userRepository.save(user);
  }

  async addEventToAttendedEvents(user: User, event: Event): Promise<void> {
    user.attendedEvents = user.attendedEvents || [];
    user.attendedEvents.push(event);
    await this.userRepository.save(user);
  }
}
