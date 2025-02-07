import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayloadDto } from 'src/modules/auth/dtos';

import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    const configService = new ConfigService();
    const secretOrKey = configService.get<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: JwtPayloadDto) {
    const userIsDisabled = await this.authService.userIsDisabled(payload.sub);
    if (userIsDisabled) throw new UnauthorizedException();
    return {
      id: payload.sub,
      companyId: payload.companyId,
      active: payload.active,
      rule: payload.rule,
    };
  }
}
