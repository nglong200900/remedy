import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserPermissionsUserService } from '../../user-permissions_user/user-permissions_user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly userService: UserPermissionsUserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;//get the refresh token from cookie
        },
      ]),
      secretOrKey: configService.get('SECRET_REFRESH_KEY'),
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: any) {
    const refreshToken = request.cookies?.Refresh;
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );//check refresh token matches with current refresh token in database
  }
}
