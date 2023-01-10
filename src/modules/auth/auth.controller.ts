import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';
import { CreateUserPermissionsUserDto } from '../user-permissions_user/dto/create-user-permissions_user.dto';
import { UserPermissionsUserService } from '../user-permissions_user/user-permissions_user.service';
import { AuthService } from './auth.service';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(
    private authService: AuthService,
    private userPermissionsUserService: UserPermissionsUserService,
  ) {}

  @Post('login')
  @Public()
  @ApiBody({ type: Object })
  @UseGuards(LocalAuthGuard)
  async login(@Req() request: any, @Body() body: any) {
    const { user } = request;
    const data = await this.authService.login(user.id);
    request.res.setHeader('Set-Cookie', [data.accessToken, data.refreshToken]); // set the refresh token and access token
    return { message: `Success! Login with email ${body.email}` };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @Public()
  refresh(@Req() request: any) {
    return this.authService.refreshToken(request);
  }

  @ApiBearerAuth('access-token')
  @Get('profile')
  getProfile(@Req() req: any) {
    return { data: req.user };
  }

  @Post('register')
  @Public()
  async register(@Body() user: CreateUserPermissionsUserDto) {
    // register user
    return this.userPermissionsUserService.create(user);
  }

  @ApiBearerAuth('access-token')
  @Get('logout')
  async Logout(@Req() request: any) {
    const clearToken = await this.authService.logout();
    request.res.setHeader('Set-Cookie', clearToken); //clear token in the cookie
    return { message: 'Logout success' };
  }
}
