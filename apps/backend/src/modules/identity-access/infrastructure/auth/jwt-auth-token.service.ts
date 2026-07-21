import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenService } from '../../domain/repositories/auth-token.service';

@Injectable()
export class JwtAuthTokenService implements AuthTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: {
    userId: string;
    email: string;
  }): Promise<string> {
    return this.jwtService.signAsync({
      sub: payload.userId,
      email: payload.email,
    });
  }
}
