import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CrudService } from 'src/common/crud.service';
import { Organizer } from './entities/organizer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OrganizersService extends CrudService<Organizer> {
  constructor(
    @InjectRepository(Organizer)
    private organizerRepository: Repository<Organizer>,
    private readonly jwtService: JwtService,
  ) {
    super(organizerRepository);
  }

  async findOne(id: string): Promise<Organizer> {
    console.log('m here');
    const organizer = await this.organizerRepository.findOneBy({ id: id });
    if (!organizer) {
      throw new NotFoundException(`Organizer with id=${id} was not found`);
    }
    return organizer;
  }
  async signIn(email: string, password: string) {
    const organizer = await this.findByOrganizerNameOrEmail(email);
    if (!organizer)
      throw new UnauthorizedException('Veuillez vérifier vos credentials !');

    const isLoggedIn = await bcrypt.compare(password, organizer.password);
    if (isLoggedIn) {
      const { password, ...payload } = organizer;

      return { access_token: this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Veuillez vérifier vos credentials !');
  }
  findByOrganizerNameOrEmail(identifier: string): Promise<Organizer> {
    return this.organizerRepository.findOne({
      where: [{ name: identifier }, { email: identifier }],
    });
  }

  async create(createOrganizerDto: CreateOrganizerDto): Promise<Organizer> {
    const organizer = this.organizerRepository.create(createOrganizerDto);
    const salt = await bcrypt.genSalt();
    organizer.password = await bcrypt.hash(organizer.password, salt);
    try {
      return await this.organizerRepository.save(organizer);
    } catch (e) {
      throw new ConflictException('Le name et le email doivent être unique');
    }
  }

  async update(
    id: string,
    updateOrganizerDto: UpdateOrganizerDto,
  ): Promise<Organizer> {
    const organizer = await this.findOne(id);

    const { name, email, password, description, profilePicture } =
      updateOrganizerDto;

    organizer.name = name || organizer.name;
    organizer.email = email || organizer.email;
    organizer.password = password || organizer.password;
    organizer.description = description || organizer.description;
    organizer.profilePicture = profilePicture || organizer.profilePicture;

    return await this.organizerRepository.save(organizer);
  }
}
