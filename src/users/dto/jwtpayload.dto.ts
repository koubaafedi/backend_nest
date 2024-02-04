import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';

export class JwtPayloadDto extends OmitType(CreateUserDTO, ['password']) {}
