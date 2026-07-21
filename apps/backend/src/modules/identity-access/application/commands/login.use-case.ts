import { Inject, Injectable } from '@nestjs/common';
import { Email } from '../../domain/value-objects/email.vo';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { AuthTokenService } from '../../domain/repositories/auth-token.service';
import { AUTH_TOKEN_SERVICE } from '../../domain/repositories/auth-token.service';
import { LoginDto, AuthTokenResult } from '../dto/login.dto';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authTokenService: AuthTokenService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthTokenResult> {
    const email = Email.create(dto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await user.comparePassword(dto.password);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.authTokenService.generateToken({
      userId: user.id.toString(),
      email: user.email.toString(),
    });

    return { accessToken };
  }
}
