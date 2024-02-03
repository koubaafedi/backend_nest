import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateOrganizerDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(4)
  password: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsUrl()
  profilePicture: string;
}
