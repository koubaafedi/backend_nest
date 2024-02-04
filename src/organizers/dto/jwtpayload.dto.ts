import { OmitType } from '@nestjs/mapped-types';
import { CreateOrganizerDto } from './create-organizer.dto';

export class JwtPayloadDto extends OmitType(CreateOrganizerDto, ['password']) {}
