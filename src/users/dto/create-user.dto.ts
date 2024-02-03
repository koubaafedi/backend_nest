import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(4)
  password: string;
  @IsOptional()
  @IsString()
  bio: string;
  @IsOptional()
  @IsUrl()
  profilePicture: string;
}
