import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/commands/login.use-case';
import { InvalidCredentialsError } from '../../application/errors/invalid-credentials.error';
import { LoginRequestDto } from '../dto/login-request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Returns a JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginRequestDto): Promise<{ accessToken: string }> {
    try {
      return await this.loginUseCase.execute(dto);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
