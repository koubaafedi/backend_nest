import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwtpayload.dto';
import { OrganizersService } from '../organizers.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly organizerService: OrganizersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(jwtPayloadDto: JwtPayloadDto) {
    const user = await this.organizerService.findByOrganizerNameOrEmail(
      jwtPayloadDto.email,
    );
    if (!user) {
      return new UnauthorizedException('Veuillez vérifier vos credentials !');
    }
    return user;
  }
}
