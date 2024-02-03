import {
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
import { SignInDTO } from './dto/sign-in.dto';

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
    const organizer = await this.organizerRepository.findOneBy({ id: id });
    if (!organizer) {
      throw new NotFoundException(`Organizer with id=${id} was not found`);
    }
    return organizer;
  }
  async signIn(signinDto: SignInDTO) {
    const organizer = await this.findByOrganizerNameOrEmail(signinDto.email);
    if (!organizer)
      throw new UnauthorizedException('Veuillez vérifier vos credentials !');

    const isLoggedIn = await bcrypt.compare(
      signinDto.password,
      organizer.password,
    );
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
    return await this.organizerRepository.save(organizer);
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
