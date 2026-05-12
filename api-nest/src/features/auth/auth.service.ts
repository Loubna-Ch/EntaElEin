import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/entities/user.entity';

export interface LoginResponse {
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  username: string;
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Verify credentials and create JWT tokens.
  // Parameters: email and password.
  // Returns: user data, access token, and refresh token.
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.userid,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // Validate a refresh token and issue a new access token.
  // Parameters: refreshToken string.
  // Returns: a new access token.
  refreshToken(refreshToken: string): { accessToken: string } {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const accessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
          role: payload.role,
          username: payload.username,
        },
        { expiresIn: '15m' },
      );
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Load one user by id for JWT validation.
  // Parameters: userid number.
  // Returns: the matching user record.
  async validateUser(userid: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userid },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // Remove the password before returning user data.
  // Parameters: a full User entity.
  // Returns: the same user without the password field.
  sanitizeUser(user: User): Partial<User> {
    const { password: _password, ...result } = user;
    void _password;
    return result;
  }
}
