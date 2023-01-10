import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPermissionsUserService } from '../user-permissions_user/user-permissions_user.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserPermissionsUserService,
    private jwtService: JwtService,
    private configService: ConfigService, //private verifyService: VerifyToken
  ) {}
  public getCookieWithJwtAccessToken(id: number) {
    //get the cookie
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_KEY'),
      expiresIn: '10h',
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=10h`;
  }

  public getCookieWithJwtRefreshToken(id: number) {
    // get refresh token
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_REFRESH_KEY'),
      expiresIn: '15d',
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=15d`;
    return {
      cookie,
      token,
    };
  }

  verifyJwt(token: string, key: string) {
    try {
      return this.jwtService.verify(token, { secret: key });
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshToken(request: any) {
    const auth = this.verifyJwt(
      request?.cookies.Authentication,
      this.configService.get('SECRET_KEY'),
    );
    const refresh = this.verifyJwt(
      request?.cookies?.Refresh,
      this.configService.get('SECRET_REFRESH_KEY'),
    );
    if (auth.id == refresh.id) {
      const accessTokenCookie = this.getCookieWithJwtAccessToken(
        request.user.id,
      ); //get new access token
      request.res.setHeader('Set-Cookie', accessTokenCookie); // set new access token in the cookie
      return { id: request.user.id };
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async login(id: number) {
    const accessTokenCookie = this.getCookieWithJwtAccessToken(id); //get access token
    const refreshTokenCookie = this.getCookieWithJwtRefreshToken(id); //get refresh token
    await this.userService.setCurrentRefreshToken(refreshTokenCookie.token, id); //set current refresh token to database
    return {
      accessToken: accessTokenCookie,
      refreshToken: refreshTokenCookie.cookie,
    };
  }

  async logout() {
    const clearToken = [
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
    ];
    return clearToken;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneUser(email, password);
    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
