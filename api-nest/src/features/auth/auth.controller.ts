import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, LoginResponse } from './auth.service';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshTokenDto {
  refreshToken!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Check the user's email and password.
  // Parameters: LoginDto with email and password.
  // Returns: access and refresh tokens plus the user profile.
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Returns auth tokens.' })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.authService.login(loginDto.email, loginDto.password);
  }

  // Exchange a refresh token for a new access token.
  // Parameters: RefreshTokenDto with refreshToken.
  // Returns: a new access token.
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Returns a new access token.' })
  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto): any {
    if (!refreshTokenDto.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
