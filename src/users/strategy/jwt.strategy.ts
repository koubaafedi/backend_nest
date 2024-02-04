import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwtpayload.dto';
import { UsersService } from '../users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret123456',
    });
  }

  async validate(jwtPayloadDto: JwtPayloadDto) {
    const user = await this.usersService.findByUserNameOrEmail(
      jwtPayloadDto.email,
    );
    if (!user) {
      return new UnauthorizedException('Veuillez vérifier vos credentials !');
    }
    return user;
  }
}
